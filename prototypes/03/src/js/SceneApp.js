// SceneApp.js

var GL = bongiovi.GL, gl;
var SoundCloudLoader = require("./SoundCloudLoader");
var ViewSave = require("./ViewSave");
var ViewSaveExtra = require("./ViewSaveExtra");
var ViewRender = require("./ViewRender");
var ViewSimulation = require("./ViewSimulation");
var ViewSky = require("./ViewSky");
var ViewBlur = require("./ViewBlur");
var ViewPost = require("./ViewPost");
var ViewTerrain = require("./ViewTerrain");
var ViewNoise = require("./ViewNoise");
var ViewNormal = require("./ViewNormal");

function SceneApp() {
	gl = GL.gl;
	this.sum = 0;
	this.count = 0;
	this.easeSum = new bongiovi.EaseNumber(0, .25);
	bongiovi.Scene.call(this);
	this.camera.setPerspective(65 * Math.PI/180, GL.aspectRatio, 5, 200);

	window.addEventListener("resize", this.resize.bind(this));

	this.camera.lockRotation(false);
	this.sceneRotation.lock(true);

	this.camera._rx.value = -.05;
	this.camera._ry.value = -.1;
	this.camera.radius.setTo(90);
	this.camera.radius.value = 100;
	this.camera.center[1] = -30.0;

	this.resize();
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	if(!gl) gl = GL.gl;
	this._textureSky          = new bongiovi.GLTexture(images.bg);
	this._textureNoise        = new bongiovi.GLTexture(images.noise);
	this._textureDetailHeight = new bongiovi.GLTexture(images.detailHeight);
	this._textureFlower       = new bongiovi.GLTexture(images.flower);
	
	var num                   = params.numParticles;
	var o                     = { minFilter:gl.NEAREST,magFilter:gl.NEAREST}
	this._fboCurrent          = new bongiovi.FrameBuffer(num*2, num*2, o);
	this._fboTarget           = new bongiovi.FrameBuffer(num*2, num*2, o);
	this._fboExtras           = new bongiovi.FrameBuffer(num*2, num*2, o);
	
	this._fboRender           = new bongiovi.FrameBuffer(GL.width, GL.height, o);
	var blurSize              = 256*2;
	this._fboVBlur            = new bongiovi.FrameBuffer(blurSize, blurSize);
	this._fboFinalBlur        = new bongiovi.FrameBuffer(blurSize, blurSize);
	
	var noiseSize             = 512;
	this._fboNoise            = new bongiovi.FrameBuffer(noiseSize, noiseSize);
	this._fboNormal           = new bongiovi.FrameBuffer(noiseSize, noiseSize);
};

p._initViews = function() {
	this._vSave      = new ViewSave();
	this._vSaveExtra = new ViewSaveExtra();
	this._vCopy      = new bongiovi.ViewCopy();
	this._vRender    = new ViewRender();
	this._vSim       = new ViewSimulation();
	this._vSky       = new ViewSky();
	this._vTerrain   = new ViewTerrain();
	this._vVBlur     = new ViewBlur(true);
	this._vHBlur     = new ViewBlur(false);
	this._vPost      = new ViewPost();
	this._vNoise     = new ViewNoise(params.noise);
	this._vNormal    = new ViewNormal(params.terrainNoiseHeight/300*3.0);


	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._fboCurrent.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	this._vSave.render();
	this._fboCurrent.unbind();

	this._fboExtras.bind();
	GL.setViewport(0, 0, this._fboExtras.width, this._fboExtras.height);
	this._vSaveExtra.render();
	this._fboExtras.unbind();

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


p.updateFbo = function() {
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._fboTarget.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	GL.clear(0, 0, 0, 0);
	this._vSim.render(this._fboCurrent.getTexture(), this._fboExtras.getTexture());
	this._fboTarget.unbind();


	var tmp = this._fboTarget;
	this._fboTarget = this._fboCurrent;
	this._fboCurrent = tmp;


	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);		
	GL.setViewport(0, 0, GL.width, GL.height);
};


p.render = function() {
	if(params.cameraAutoRotate) this.camera._ry.value += .01;
	var skipCount = Math.floor(params.skipCount);
	if(this.count % skipCount === 0) {
		this.updateFbo();
		this._vRender.tick();
		this.count = 0;
	}
	var percent = this.count / skipCount;

	this.count ++;
	GL.setViewport(0, 0, GL.width, GL.height);
	
	if(params.enablePostEffect) {
		this._fboRender.bind();		
	}
	
	GL.clear(0, 0, 0, 0);
	// this._vAxis.render();
	this._vSky.render(this._textureSky, this.camera);
	this._vRender.render(this._fboTarget.getTexture(), this._fboCurrent.getTexture(), percent, this._fboExtras.getTexture(), this.camera, this._textureFlower);
	var numTiles = 2;
	var size = 300;
	for(var j=0; j<numTiles; j++) {
		for(var i=0; i<numTiles; i++) {
			var uvOffset = [i/numTiles, j/numTiles];
			this._vTerrain.render(this._fboNoise.getTexture(), numTiles, size, uvOffset, this._fboNormal.getTexture(), this._textureNoise, this.camera);
		}
	}

	if(params.enablePostEffect) {
		this._fboRender.unbind();

		GL.setMatrices(this.cameraOtho);
		GL.rotate(this.rotationFront);

		this._vVBlur.blur = this._vHBlur.blur = params.blur;
		this._fboVBlur.bind();
		GL.setViewport(0, 0, this._fboVBlur.width, this._fboVBlur.height);
		GL.clear();
		this._vVBlur.render(this._fboRender.getTexture());
		this._fboVBlur.unbind();

		this._fboFinalBlur.bind();
		GL.setViewport(0, 0, this._fboFinalBlur.width, this._fboFinalBlur.height);
		GL.clear();
		this._vHBlur.render(this._fboVBlur.getTexture());
		this._fboFinalBlur.unbind();
		
		var subscreenSize = window.innerHeight/3;
		GL.setViewport(0, 0, subscreenSize*GL.aspectRatio, subscreenSize);
		this._vCopy.render(this._fboRender.getTexture());

		GL.setViewport(0, subscreenSize, subscreenSize*GL.aspectRatio, subscreenSize);
		this._vCopy.render(this._fboFinalBlur.getTexture());

		GL.setViewport(0, subscreenSize*2, subscreenSize*GL.aspectRatio, subscreenSize);
		this._vCopy.render(this._fboRender.getDepthTexture());

		GL.setViewport(0, 0, GL.width, GL.height);
		this._vPost.render(this._fboRender.getTexture(), this._fboFinalBlur.getTexture(), this._fboRender.getDepthTexture(), this.camera);
	}

	/*
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	var subscreenSize = window.innerHeight/3;
	GL.setViewport(0, 0, subscreenSize*GL.aspectRatio, subscreenSize);
	this._vCopy.render(this._fboNoise.getTexture());

	GL.setViewport(0, subscreenSize, subscreenSize*GL.aspectRatio, subscreenSize);
	this._vCopy.render(this._fboNormal.getTexture());
	*/
};


p.resize = function() {
	var scale = 1.0;
	GL.setSize(window.innerWidth*scale, window.innerHeight*scale);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;



// <iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/188056255&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>