// ViewPostBg.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewPostBg() {
	bongiovi.View.call(this, null, glslify('../shaders/postBg.frag'));
}

var p = ViewPostBg.prototype = new bongiovi.View();
p.constructor = ViewPostBg;


p._init = function() {
	gl = GL.gl;

	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewPostBg;