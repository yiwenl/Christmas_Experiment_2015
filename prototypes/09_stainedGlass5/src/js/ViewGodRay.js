// ViewGodRay.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewGodRay() {
	this.count = 0;
	bongiovi.View.call(this, null, glslify('../shaders/godray.frag'));
}

var p = ViewGodRay.prototype = new bongiovi.View();
p.constructor = ViewGodRay;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 

	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture) {
	this.count += .03;
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("time", "uniform1f", this.count);
	this.shader.uniform("density", "uniform1f", params.density);
	this.shader.uniform("weight", "uniform1f", params.weight);
	this.shader.uniform("decay", "uniform1f", params.decay);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewGodRay;