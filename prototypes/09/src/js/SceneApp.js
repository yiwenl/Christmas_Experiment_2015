// SceneApp.js

var GL = bongiovi.GL, gl;

var ViewSphere = require("./ViewSphere");
var ViewBlur = require("./ViewBlur");
var ViewBloom = require("./ViewBloom");
var ViewFXAA = require("./ViewFXAA");
var SubsceneTerrain = require("./subsceneTerrain/SubsceneTerrain");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));

	this.camera.setPerspective(70 * Math.PI/180, GL.aspectRatio, 5, 4000);
	this.camera.lockRotation(false);
	this.sceneRotation.lock(true);

	this.camera._rx.value =  .1;
	// this.camera._rx.limit(.1, .2);
	this.camera._ry.value = -.1;
	this.count = 0;
	this.percent = 0;

	this.resize();
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');

	var renderSize = 1024;
	this._fboRender = new bongiovi.FrameBuffer(renderSize, renderSize);

	var blurSize = 512;
	this._fboBlur0 = new bongiovi.FrameBuffer(blurSize, blurSize);
	this._fboBlur1 = new bongiovi.FrameBuffer(blurSize, blurSize);
};

p._initViews = function() {
	console.log('Init Views');

	this._vCopy = new bongiovi.ViewCopy();
	this._vSphere = new ViewSphere();
	this._vBlur = new ViewBlur();
	this._vBloom = new ViewBloom();
	this._vFxaa = new ViewFXAA();
	this._subsceneTerrain = new SubsceneTerrain(this);
};

p._update = function() {
};


p.render = function() {
	this._update();
	
	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);
	GL.setViewport(0, 0, this._fboRender.width, this._fboRender.height);

	this._fboRender.bind();
	GL.clear(0, 0, 0, 0);
	this._vSphere.render(params.terrain.lightPos);
	this._subsceneTerrain.render();
	this._fboRender.unbind();

	
	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);

	GL.setViewport(0, 0, this._fboBlur0.width, this._fboBlur0.height);
	this._fboBlur0.bind();
	GL.clear(0, 0, 0, 0);
	this._vBlur.render(this._fboRender.getTexture(), true);
	this._fboBlur0.unbind();

	this._fboBlur1.bind();
	GL.clear(0, 0, 0, 0);
	this._vBlur.render(this._fboBlur0.getTexture(), false);
	this._fboBlur1.unbind();

	GL.setViewport(0, 0, GL.width, GL.height);
	if(params.post.enablePostEffect) {
		// this._vBloom.render(this._fboRender.getTexture(), this._fboBlur1.getTexture(), params.post.bloomThreshold);
		this._vFxaa.render(this._fboRender.getTexture(), this._fboBlur1.getTexture(), params.post.bloomThreshold);
	} else {
		this._vCopy.render(this._fboRender.getTexture());	
	}
	
	
};

p.resize = function() {
};

module.exports = SceneApp;