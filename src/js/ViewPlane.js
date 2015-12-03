// ViewPlane.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewPlane() {
	bongiovi.View.call(this);
}

var p = ViewPlane.prototype = new bongiovi.View();
p.constructor = ViewPlane;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 

	var size = 200;
	this.mesh = bongiovi.MeshUtils.createPlane(size, size*6/5, 1);
};

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewPlane;