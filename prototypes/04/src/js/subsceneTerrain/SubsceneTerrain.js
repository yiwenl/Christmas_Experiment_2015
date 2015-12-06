var GL = bongiovi.GL;
var gl;
var ViewTerrain = require("./ViewTerrain");
var ViewNoise = require("./ViewNoise");
var ViewNormal = require("./ViewNormal");

function SubsceneTerrain(scene) {
	gl = GL.gl;
	this.scene = scene;
	this._initTextures();
	this._initViews();
}


var p = SubsceneTerrain.prototype;

p._initTextures = function() {
	console.log('Init Textures : SubsceneTerrain');
	var noiseSize             = 512;
	this._fboNoise            = new bongiovi.FrameBuffer(noiseSize, noiseSize);
	this._fboNormal           = new bongiovi.FrameBuffer(noiseSize, noiseSize);	

	this._textureNoise        = new bongiovi.GLTexture(images.noise);
	this._textureDetailHeight = new bongiovi.GLTexture(images.detailHeight);
};


p._initViews = function() {
	this._vNoise     = new ViewNoise(params.noise);
	this._vNormal    = new ViewNormal(params.terrainNoiseHeight/300*3.0);

	GL.setMatrices(this.scene.cameraOtho);
	GL.rotate(this.scene.rotationFront);

	this._fboNoise.bind();
	GL.clear();
	GL.setViewport(0, 0, this._fboNoise.width, this._fboNoise.height);
	this._vNoise.setNoise(params.noise);
	this._vNoise.render(this._textureDetailHeight);
	this._fboNoise.unbind();

	this._fboNormal.bind();
	GL.clear();
	this._vNormal.render(this._fboNoise.getTexture());
	this._fboNormal.unbind();
};


p.render = function() {
	
};

module.exports = SubsceneTerrain;