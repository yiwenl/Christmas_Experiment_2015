// ViewPost.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewPost() {
	this.textureBlur = null;
	bongiovi.View.call(this, null, glslify('../shaders/post.frag'));
}

var p = ViewPost.prototype = new bongiovi.View();
p.constructor = ViewPost;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture) {
	if(!this.textureBlur){
		return;
	}
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureBlur", "uniform1i", 1);
	this.textureBlur.bind(1);
	this.shader.uniform("bloom", "uniform1f", params.post.bloom);
	this.shader.uniform("gamma", "uniform1f", params.post.gamma || 2.2);
	GL.draw(this.mesh);
};

module.exports = ViewPost;