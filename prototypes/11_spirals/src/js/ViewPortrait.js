// ViewPortrait.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewPortrait() {
	bongiovi.View.call(this, glslify("../shaders/portrait.vert"));
}

var p = ViewPortrait.prototype = new bongiovi.View();
p.constructor = ViewPortrait;


p._init = function() {
	gl = GL.gl;
	var size = 200;
	var ratio = 1280/1020;
	this.mesh = bongiovi.MeshUtils.createPlane(size, size*ratio, 1);
};

p.render = function(texture, rotation, y) {
	rotation = rotation === undefined ? 0 : rotation;
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("rotation", "uniform1f", rotation);
	this.shader.uniform("position", "uniform3fv", [0, y, -params.z]);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewPortrait;