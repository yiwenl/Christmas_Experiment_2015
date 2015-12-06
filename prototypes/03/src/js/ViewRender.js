// ViewRender.js
var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewRender() {
	this.time = Math.random() * 0xFF;
	bongiovi.View.call(this, glslify("../shaders/render.vert"), glslify("../shaders/render.frag"));
}

var p = ViewRender.prototype = new bongiovi.View();
p.constructor = ViewRender;


p._init = function() {
	gl = GL.gl;
	var positions    = [];
	var coords       = [];
	var indices      = []; 
	var count        = 0;
	var numParticles = params.numParticles;
	var size 		 = 1;
	var uvOffset 	 = [];
	var normals 	 = [];

	for(var j=0; j<numParticles; j++) {
		for(var i=0; i<numParticles; i++) {
			positions.push([-size, 0, -size]);
			positions.push([ size, 0, -size]);
			positions.push([ size, 0,  size]);
			positions.push([-size, 0,  size]);

			normals.push([0, 1, 0]);
			normals.push([0, 1, 0]);
			normals.push([0, 1, 0]);
			normals.push([0, 1, 0]);

			ux = i/numParticles;
			uy = j/numParticles;
			coords.push([0, 0]);
			coords.push([1, 0]);
			coords.push([1, 1]);
			coords.push([0, 1]);

			uvOffset.push([ux, uy]);
			uvOffset.push([ux, uy]);
			uvOffset.push([ux, uy]);
			uvOffset.push([ux, uy]);

			indices.push(count*4 + 3);
			indices.push(count*4 + 2);
			indices.push(count*4 + 0);
			indices.push(count*4 + 2);
			indices.push(count*4 + 1);
			indices.push(count*4 + 0);
			

			count ++;

			positions.push([-size, 0, -size]);
			positions.push([ size, 0, -size]);
			positions.push([ size, 0,  size]);
			positions.push([-size, 0,  size]);

			normals.push([0, -1, 0]);
			normals.push([0, -1, 0]);
			normals.push([0, -1, 0]);
			normals.push([0, -1, 0]);

			coords.push([0, 0]);
			coords.push([1, 0]);
			coords.push([1, 1]);
			coords.push([0, 1]);

			uvOffset.push([ux, uy]);
			uvOffset.push([ux, uy]);
			uvOffset.push([ux, uy]);
			uvOffset.push([ux, uy]);

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
	this.mesh.bufferData(uvOffset, "aUVOffset", 2);
	this.mesh.bufferData(normals, "aNormal", 3);
};

p.render = function(texture, textureNext, percent, textureExtra, camera, textureFlower) {

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureNext", "uniform1i", 1);
	textureNext.bind(1);
	this.shader.uniform("textureExtra", "uniform1i", 2);
	textureExtra.bind(2);
	this.shader.uniform("textureFlower", "uniform1i", 3);
	textureFlower.bind(3);
	this.shader.uniform("percent", "uniform1f", percent);
	this.shader.uniform("time", "uniform1f", this.time);
	this.shader.uniform("near", "uniform1f", camera.near);
	this.shader.uniform("far", "uniform1f", camera.far);
	this.shader.uniform("maxRadius", "uniform1f", params.maxRadius);
	this.shader.uniform("lightDir", "uniform3fv", params.lightPos);
	this.shader.uniform("lightColor", "uniform3fv", params.lightColor);

	this.time += .05;

	GL.draw(this.mesh);
};



p.tick = function() {
	
};

module.exports = ViewRender;