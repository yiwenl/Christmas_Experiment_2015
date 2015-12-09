// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewPlane = require("./ViewPlane");
var ViewBlur = require("./ViewBlur");
var ViewGodRay = require("./ViewGodRay");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this._texture = new bongiovi.GLTexture(images.stained);
	this._fboRender = new bongiovi.FrameBuffer(GL.width, GL.height);
	var blurSize = 512;
	this._fboBlur0 = new bongiovi.FrameBuffer(blurSize, blurSize);
	this._fboBlur1 = new bongiovi.FrameBuffer(blurSize, blurSize);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis     = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	
	this._vPlane    = new ViewPlane();
	this._vCopy     = new bongiovi.ViewCopy();
	this._vGodRay 	= new ViewGodRay();
	this._vBlur 	= new ViewBlur();
};

p.render = function() {
	gl.enable(gl.DEPTH_TEST);
	GL.enableAlphaBlending();

	this._fboRender.bind();
	GL.clear(0, 0, 0, 0);
	// this._vAxis.render();
	// this._vDotPlane.render();
	this._vPlane.render(this._texture);

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

	var tmp = this._fboBlur1;
	this._fboBlur1 = this._fboBlur0;
	this._fboBlur0 = tmp;

	GL.setViewport(0, 0, GL.width, GL.height);
	gl.disable(gl.DEPTH_TEST);
	GL.enableAdditiveBlending();
	this._vCopy.render(this._fboRender.getTexture());
	this._vGodRay.render(this._fboBlur1.getTexture());
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);

	this._fboRender = new bongiovi.FrameBuffer(GL.width, GL.height);

	var blurSize = 512;
	this._fboBlur0 = new bongiovi.FrameBuffer(blurSize, blurSize);
	this._fboBlur1 = new bongiovi.FrameBuffer(blurSize, blurSize);
};

module.exports = SceneApp;