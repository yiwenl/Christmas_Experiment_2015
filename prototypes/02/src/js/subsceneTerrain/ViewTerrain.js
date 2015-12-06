// ViewTerrain.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewTerrain() {
	bongiovi.View.call(this, glslify("../../shaders/terrain.vert"), glslify("../../shaders/terrain.frag"));
}

var p = ViewTerrain.prototype = new bongiovi.View();
p.constructor = ViewTerrain;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 
	var count = 0;
	var num = 25;
	var size = 200, uvGap = 1/num;

	function getPosition(i, j) {
		var pos = [0, -150, 0]
		pos[0] = -size/2 + size * i/num;
		pos[2] = size/2 - size * j/num;

		return pos;
	}

	for(var j=0; j<num; j++) {
		for(var i=0; i<num; i++) {
			positions.push(getPosition(i, j));
			positions.push(getPosition(i+1, j));
			positions.push(getPosition(i+1, j+1));
			positions.push(getPosition(i, j+1));

			coords.push([i/num, j/num]);
			coords.push([i/num+uvGap, j/num]);
			coords.push([i/num+uvGap, j/num+uvGap]);
			coords.push([i/num, j/num+uvGap]);

			indices.push(count*4 + 0);
			indices.push(count*4 + 1);
			indices.push(count*4 + 2);
			indices.push(count*4 + 0);
			indices.push(count*4 + 2);
			indices.push(count*4 + 3);

			count ++;
		}
	}


	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(texture, numTiles, size, uvOffset, textureNormal, textureNoise, camera) {
	this.shader.bind();

	this.shader.uniform("size", "uniform1f", size);
	this.shader.uniform("numTiles", "uniform1f", numTiles);
	this.shader.uniform("height", "uniform1f", params.terrainNoiseHeight);
	this.shader.uniform("uvOffset", "uniform2fv", uvOffset);
	this.shader.uniform("bumpOffset", "uniform1f", params.bump);
	this.shader.uniform("lightDir", "uniform3fv", params.lightPos);
	this.shader.uniform("lightColor", "uniform3fv", params.lightColor);
	this.shader.uniform("cameraPos", "uniform3fv", camera.position);
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureNormal", "uniform1i", 1);
	textureNormal.bind(1);
	this.shader.uniform("textureNoise", "uniform1i", 2);
	textureNoise.bind(2);
	if(camera) {
		this.shader.uniform("near", "uniform1f", camera.near);
		this.shader.uniform("far", "uniform1f", camera.far);
	}
	GL.draw(this.mesh);
};

module.exports = ViewTerrain;