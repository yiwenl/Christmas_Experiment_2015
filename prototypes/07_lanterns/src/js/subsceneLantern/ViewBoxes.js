// ViewBoxes.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");
var random = function(min, max) { return min + Math.random() * (max - min);	}

function ViewBoxes() {
	this.count = 0xFFFF;
	bongiovi.View.call(this, glslify('./shaders/box.vert'), glslify('./shaders/box.frag'));
}

var p = ViewBoxes.prototype = new bongiovi.View();
p.constructor = ViewBoxes;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var uvs = [];
	var indices = []; 
	var normals = [];
	var count = 0;
	

	function createCube(i, j) {
		var size = random(2, 5);
		var x = y = z = size;	
		var ux = i/numParticles;
		var uy = j/numParticles;


		// BACK
		positions.push([-x,  y, -z]);
		positions.push([ x,  y, -z]);
		positions.push([ x, -y, -z]);
		positions.push([-x, -y, -z]);

		normals.push([0, 0, -1]);
		normals.push([0, 0, -1]);
		normals.push([0, 0, -1]);
		normals.push([0, 0, -1]);

		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);

		uvs.push([0, 0]);
		uvs.push([1, 0]);
		uvs.push([1, 1]);
		uvs.push([0, 1]);

		indices.push(count*4 + 0);
		indices.push(count*4 + 1);
		indices.push(count*4 + 2);
		indices.push(count*4 + 0);
		indices.push(count*4 + 2);
		indices.push(count*4 + 3);

		count ++;

		// RIGHT
		positions.push([ x,  y, -z]);
		positions.push([ x,  y,  z]);
		positions.push([ x, -y,  z]);
		positions.push([ x, -y, -z]);

		normals.push([1, 0, 0]);
		normals.push([1, 0, 0]);
		normals.push([1, 0, 0]);
		normals.push([1, 0, 0]);

		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);

		uvs.push([0, 0]);
		uvs.push([1, 0]);
		uvs.push([1, 1]);
		uvs.push([0, 1]);

		indices.push(count*4 + 0);
		indices.push(count*4 + 1);
		indices.push(count*4 + 2);
		indices.push(count*4 + 0);
		indices.push(count*4 + 2);
		indices.push(count*4 + 3);

		count ++;

		// FRONT
		positions.push([ x,  y,  z]);
		positions.push([-x,  y,  z]);
		positions.push([-x, -y,  z]);
		positions.push([ x, -y,  z]);

		normals.push([0, 0, 1]);
		normals.push([0, 0, 1]);
		normals.push([0, 0, 1]);
		normals.push([0, 0, 1]);

		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);

		uvs.push([0, 0]);
		uvs.push([1, 0]);
		uvs.push([1, 1]);
		uvs.push([0, 1]);

		indices.push(count*4 + 0);
		indices.push(count*4 + 1);
		indices.push(count*4 + 2);
		indices.push(count*4 + 0);
		indices.push(count*4 + 2);
		indices.push(count*4 + 3);

		count ++;


		// LEFT
		positions.push([-x,  y,  z]);
		positions.push([-x,  y, -z]);
		positions.push([-x, -y, -z]);
		positions.push([-x, -y,  z]);

		normals.push([-1, 0, 0]);
		normals.push([-1, 0, 0]);
		normals.push([-1, 0, 0]);
		normals.push([-1, 0, 0]);

		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);

		uvs.push([0, 0]);
		uvs.push([1, 0]);
		uvs.push([1, 1]);
		uvs.push([0, 1]);

		indices.push(count*4 + 0);
		indices.push(count*4 + 1);
		indices.push(count*4 + 2);
		indices.push(count*4 + 0);
		indices.push(count*4 + 2);
		indices.push(count*4 + 3);

		count ++;

		// TOP
		positions.push([-x,  y,  z]);
		positions.push([ x,  y,  z]);
		positions.push([ x,  y, -z]);
		positions.push([-x,  y, -z]);

		normals.push([0, 1, 0]);
		normals.push([0, 1, 0]);
		normals.push([0, 1, 0]);
		normals.push([0, 1, 0]);

		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);

		uvs.push([0, 0]);
		uvs.push([1, 0]);
		uvs.push([1, 1]);
		uvs.push([0, 1]);

		indices.push(count*4 + 0);
		indices.push(count*4 + 1);
		indices.push(count*4 + 2);
		indices.push(count*4 + 0);
		indices.push(count*4 + 2);
		indices.push(count*4 + 3);

		count ++;

		// BOTTOM
		positions.push([-x, -y, -z]);
		positions.push([ x, -y, -z]);
		positions.push([ x, -y,  z]);
		positions.push([-x, -y,  z]);

		normals.push([0, -1, 0]);
		normals.push([0, -1, 0]);
		normals.push([0, -1, 0]);
		normals.push([0, -1, 0]);

		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);

		uvs.push([0, 0]);
		uvs.push([1, 0]);
		uvs.push([1, 1]);
		uvs.push([0, 1]);

		indices.push(count*4 + 0);
		indices.push(count*4 + 1);
		indices.push(count*4 + 2);
		indices.push(count*4 + 0);
		indices.push(count*4 + 2);
		indices.push(count*4 + 3);

		count ++;
	}


	var numParticles = params.numParticles;

	for(var j=0; j<numParticles; j++) {
		for(var i=0; i<numParticles; i++) {
			createCube(i, j);
		}
	}



	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(normals, "aNormal", 3);
	this.mesh.bufferData(uvs, "aUV", 2);
};

p.render = function(texture, textureNext, textureMap, percent, textureNormal) {
	this.count += .1;
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureNext", "uniform1i", 1);
	textureNext.bind(1);
	this.shader.uniform("textureMap", "uniform1i", 2);
	textureMap.bind(2);
	this.shader.uniform("textureNormal", "uniform1i", 3);
	textureNormal.bind(3);
	this.shader.uniform("time", "uniform1f", this.count);
	this.shader.uniform("gamma", "uniform1f", params.gamma);
	this.shader.uniform("percent", "uniform1f", percent);
	GL.draw(this.mesh);
};

module.exports = ViewBoxes;