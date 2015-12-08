// ViewFXAA.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewFXAA() {
	bongiovi.View.call(this, null, glslify("../shaders/fxaa.frag"));
}

var p = ViewFXAA.prototype = new bongiovi.View();
p.constructor = ViewFXAA;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("resolution", "uniform2fv", [GL.width, GL.height]);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewFXAA;