// ViewBlur.js


var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewBlur() {
	bongiovi.View.call(this, null, glslify('../../shaders/blur.frag'));
}

var p = ViewBlur.prototype = new bongiovi.View();
p.constructor = ViewBlur;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 

	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture, isVertical) {
	var dir = isVertical ? [0, 1] : [1, 0];
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("resolution", "uniform2fv", [GL.width, GL.height]);
	this.shader.uniform("direction", "uniform2fv", dir);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewBlur;