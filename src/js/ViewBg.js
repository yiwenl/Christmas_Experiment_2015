// ViewBg.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewBg() {
	bongiovi.View.call(this, null, glslify('../shaders/bg.frag'));
}

var p = ViewBg.prototype = new bongiovi.View();
p.constructor = ViewBg;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture, textureNext) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureNext", "uniform1i", 1);
	textureNext.bind(1);
	this.shader.uniform("bgOffset", "uniform1f", params.post.bgOffset);
	GL.draw(this.mesh);
};

module.exports = ViewBg;