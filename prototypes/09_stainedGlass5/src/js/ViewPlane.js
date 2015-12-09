// ViewPlane.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewPlane() {
	bongiovi.View.call(this, glslify('../shaders/glass.vert'));
}

var p = ViewPlane.prototype = new bongiovi.View();
p.constructor = ViewPlane;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 

	var size = 200;
	var ratio = 1280/1020;
	this.mesh = bongiovi.MeshUtils.createPlane(size, size*ratio, 1);
};

p.render = function(texture, rotation) {
	rotation = rotation === undefined ? 0 : rotation;
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("rotation", "uniform1f", rotation);
	this.shader.uniform("z", "uniform1f", -params.z);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewPlane;