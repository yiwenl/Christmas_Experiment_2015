// ViewSimulation.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSimulation() {
	this._count = Math.random() * 0xFFFF;
	bongiovi.View.call(this, null, glslify("./shaders/sim1.frag"));
}

var p = ViewSimulation.prototype = new bongiovi.View();
p.constructor = ViewSimulation;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("time", "uniform1f", this._count);
	this.shader.uniform("skipCount", "uniform1f", params.skipCount);
	this.shader.uniform("speed", "uniform1f", params.speed.value);

	texture.bind(0);
	GL.draw(this.mesh);

	this._count += .05;
};

module.exports = ViewSimulation;