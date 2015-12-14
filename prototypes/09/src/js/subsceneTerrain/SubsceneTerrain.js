// SubsceneTerrain.js
var GL = bongiovi.GL, gl;

var ViewTerrain = require("./ViewTerrain");
var ViewNoise = require("./ViewNoise");
var ViewNormal = require("./ViewNormal");

function SubsceneTerrain(scene) {
	this.count = 0;
	gl                 = GL.gl;
	this.scene         = scene;
	this.camera        = scene.camera;
	this.cameraOtho    = scene.cameraOtho;
	this.rotationFront = scene.rotationFront;

	window.addEventListener("resize", this.resize.bind(this));

	this._initTextures();
	this._initViews();
	this.resize();
}


var p = SubsceneTerrain.prototype;


p._initTextures = function() {
	this._textureNoise        = new bongiovi.GLTexture(images.noise);
	this._textureDetailHeight = new bongiovi.GLTexture(images.detailHeight);

	var noiseSize             = 512;
	this._fboNoise            = new bongiovi.FrameBuffer(noiseSize, noiseSize);
	this._fboNormal           = new bongiovi.FrameBuffer(noiseSize, noiseSize);
};


p._initViews = function() {
	this._vCopy 	 = new bongiovi.ViewCopy();
	this._vTerrain   = new ViewTerrain();
	this._vNoise     = new ViewNoise(params.terrain.noise);
	this._vNormal    = new ViewNormal(params.terrain.terrainNoiseHeight/300*3.0);


	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._fboNoise.bind();
	GL.clear();
	GL.setViewport(0, 0, this._fboNoise.width, this._fboNoise.height);
	this._vNoise.setNoise(params.terrain.noise);
	this._vNoise.render(this._textureDetailHeight);
	this._fboNoise.unbind();

	this._fboNormal.bind();
	GL.clear();
	this._vNormal.render(this._fboNoise.getTexture());
	this._fboNormal.unbind();
};


p.render = function() {
	this.count += .01;
	var r = 1000.0;
	params.terrain.lightPos[0] = Math.cos(this.count) * r;
	params.terrain.lightPos[2] = Math.sin(this.count) * r;
	// GL.setMatrices(this.cameraOtho);
	// GL.rotate(this.rotationFront);

	// this._vCopy.render(this._fboNoise.getTexture());

	// return;
	var numTiles = 2;
	var size = 2000;
	for(var j=0; j<numTiles; j++) {
		for(var i=0; i<numTiles; i++) {
			var uvOffset = [i/numTiles, j/numTiles];
			this._vTerrain.render(this._fboNoise.getTexture(), numTiles, size, uvOffset, this._fboNormal.getTexture(), this._textureNoise, this.camera);
		}
	}
};


p.resize = function(e) {
	
};


module.exports = SubsceneTerrain;