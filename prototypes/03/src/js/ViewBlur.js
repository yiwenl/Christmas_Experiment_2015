// ViewBlur.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewBlur(isVBlur) {
	this.blur = .5;
	if(isVBlur) {
		bongiovi.View.call(this, glslify("../shaders/VBlur.vert"), glslify("../shaders/blur.frag"));
	} else {
		bongiovi.View.call(this, glslify("../shaders/HBlur.vert"), glslify("../shaders/blur.frag"));
	}
	
}

var p = ViewBlur.prototype = new bongiovi.View();
p.constructor = ViewBlur;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("blur", "uniform1f", this.blur);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewBlur;