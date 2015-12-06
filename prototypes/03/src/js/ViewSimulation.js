// ViewSimulation.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSimulation() {
	this._count = Math.random() * 0xFF;
	bongiovi.View.call(this, null, glslify("../shaders/sim.frag"));
}

var p = ViewSimulation.prototype = new bongiovi.View();
p.constructor = ViewSimulation;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture, textureExtra) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("time", "uniform1f", this._count);
	this.shader.uniform("maxRadius", "uniform1f", params.maxRadius);
	this.shader.uniform("windSpeed", "uniform1f", params.windSpeed);
	this.shader.uniform("noiseOffset", "uniform1f", params.noiseOffset);
	this.shader.uniform("noiseDifference", "uniform1f", params.noiseDifference);
	texture.bind(0);

	if(textureExtra) {
		this.shader.uniform("textureExtra", "uniform1i", 1);
		textureExtra.bind(1);
	}
	GL.draw(this.mesh);

	this._count += .008;
};

module.exports = ViewSimulation;