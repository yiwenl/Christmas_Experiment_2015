// ViewBloom.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewBloom() {
	bongiovi.View.call(this, null, glslify("../shaders/bloom.frag"));
}

var p = ViewBloom.prototype = new bongiovi.View();
p.constructor = ViewBloom;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture, textureBlur, threshold) {
	threshold === undefined ? .5 : threshold;
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureBlur", "uniform1i", 1);
	textureBlur.bind(1);
	this.shader.uniform("threshold", "uniform1f", threshold);
	GL.draw(this.mesh);
};

module.exports = ViewBloom;