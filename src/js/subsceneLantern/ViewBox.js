// ViewBox.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewBox() {
	this.count = 0;
	this.position = [-120, 0, 1100];
	// bongiovi.View.call(this, bongiovi.ShaderLibs.get('generalVert'), bongiovi.ShaderLibs.get('simpleColorFrag'));
	bongiovi.View.call(this, glslify('./shaders/singlebox.vert'), glslify('./shaders/singlebox.frag'));
}

var p = ViewBox.prototype = new bongiovi.View();
p.constructor = ViewBox;


p._init = function() {
	gl = GL.gl;
	// var positions = [];
	// var coords = [];
	// var indices = []; 

	var size = 50;

	this.mesh = bongiovi.MeshUtils.createCube(size, size*1.5, size, true);

	// this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	// this.mesh.bufferVertex(positions);
	// this.mesh.bufferTexCoords(coords);
	// this.mesh.bufferIndices(indices);
};

p.render = function(textureMap, textureNormal, textureEnv) {
	this.count += .01;
	this.position[1] = Math.sin(this.count) * 6 + Math.cos(this.count*1.732) * 5 - 90;
	this.shader.bind();
	// this.shader.uniform("texture", "uniform1i", 0);
	// texture.bind(0);

	this.shader.uniform("textureMap", "uniform1i", 0);
	textureMap.bind(0);
	this.shader.uniform("textureNormal", "uniform1i", 1);
	textureNormal.bind(1);
	this.shader.uniform("textureEnv", "uniform1i", 2);
	textureEnv.bind(2);

	this.shader.uniform("color", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("scale", "uniform3fv", [1, 1, 1]);
	this.shader.uniform("position", "uniform3fv", this.position);
	this.shader.uniform("opacity", "uniform1f", params.lanternOpacity.value);
	this.shader.uniform("time", "uniform1f", this.count);
	this.shader.uniform("gamma", "uniform1f", params.gamma);
	this.shader.uniform("near", "uniform1f", GL.camera.near);
	this.shader.uniform("far", "uniform1f", GL.camera.far);
	GL.draw(this.mesh);
};

module.exports = ViewBox;