// ViewPost.frag
var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewPost() {
	bongiovi.View.call(this, null, glslify("../shaders/post.frag"));
}

var p = ViewPost.prototype = new bongiovi.View();
p.constructor = ViewPost;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture, textureBlur, textureDepth, camera) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureBlur", "uniform1i", 1);
	textureBlur.bind(1);
	this.shader.uniform("textureDepth", "uniform1i", 2);
	textureDepth.bind(2);
	this.shader.uniform("focus", "uniform1f", params.focusLength);
	this.shader.uniform("depthContrast", "uniform1f", params.depthContrast);
	this.shader.uniform("zNear", "uniform1f", camera.near);
	this.shader.uniform("zFar", "uniform1f", camera.far);
	GL.draw(this.mesh);
};

module.exports = ViewPost;