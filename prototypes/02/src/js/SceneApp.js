// SceneApp.js

var GL = bongiovi.GL, gl;
var SoundCloudLoader = require("./SoundCloudLoader");
var ViewSave = require("./ViewSave");
var ViewRender = require("./ViewRender");
var ViewSimulation = require("./ViewSimulation");
var ViewBoxes = require("./ViewBoxes");
var ViewBlur = require("./ViewBlur");
var ViewGodRay = require("./ViewGodRay");

function SceneApp() {
	gl = GL.gl;
	// GL.enableAdditiveBlending();
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));

	this.camera.setPerspective(90 * Math.PI/180, GL.aspectRatio, 5, 4000);
	this.camera.lockRotation(false);
	this.sceneRotation.lock(true);

	this.camera._rx.value =  .1;
	this.camera._ry.value = -.1;
	this.count = 0;
	this.percent = 0;

	this.resize();
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this._texture = new bongiovi.GLTexture(images.gold);
	if(!gl) gl = GL.gl;

	var num = params.numParticles;
	var o = {
		minFilter:gl.NEAREST,
		magFilter:gl.NEAREST
	}
	this._fboCurrent 	= new bongiovi.FrameBuffer(num*2, num*2, o);
	this._fboTarget 	= new bongiovi.FrameBuffer(num*2, num*2, o);


	// this._fboRender = new bongiovi.FrameBuffer(GL.width, GL.height);
	this._fboRender = new bongiovi.FrameBuffer(1024/4, 1024/4);
	var sizeBlur = 64;
	this._fboBlur0  = new bongiovi.FrameBuffer(sizeBlur, sizeBlur);
	this._fboBlur1  = new bongiovi.FrameBuffer(sizeBlur, sizeBlur);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis     = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vSave     = new ViewSave();
	this._vCopy 	= new bongiovi.ViewCopy();
	this._vRender 	= new ViewRender();
	this._vSim 		= new ViewSimulation();
	this._vBoxes	= new ViewBoxes();
	this._vGodRay 	= new ViewGodRay();
	this._vBlur 	= new ViewBlur();


	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._fboCurrent.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	this._vSave.render();
	this._fboCurrent.unbind();
};


p.updateFbo = function() {
	this._fboTarget.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	GL.clear(0, 0, 0, 0);
	this._vSim.render(this._fboCurrent.getTexture() );
	this._fboTarget.unbind();


	var tmp = this._fboTarget;
	this._fboTarget = this._fboCurrent;
	this._fboCurrent = tmp;
};


p.render = function() {
	GL.setViewport(0, 0, this._fboRender.width, this._fboRender.height);
	this._fboRender.bind();
	GL.clear(0, 0, 0, 0);	
	this._vBoxes.render(this._fboTarget.getTexture(), this._fboCurrent.getTexture(), this._texture, this.percent);
	this._fboRender.unbind();


	GL.setMatrices(this.cameraOtho);
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


	gl.disable(gl.DEPTH_TEST);
	GL.enableAdditiveBlending();
	this._vCopy.render(this._fboRender.getTexture());
	this._vCopy.render(this._fboBlur1.getTexture());
	// this._vGodRay.render(this._fboBlur1.getTexture());
	gl.enable(gl.DEPTH_TEST);
	GL.enableAlphaBlending();


	if(this.count % params.skipCount == 0) {
		this.updateFbo();	
		this.count = 0;
	}
	

	this.count++;
	this.percent = this.count / params.skipCount;
};


p.resize = function() {
	var scale = 1.5;
	GL.setSize(window.innerWidth*scale, window.innerHeight*scale);
	this.camera.resize(GL.aspectRatio);

	this._fboRender = new bongiovi.FrameBuffer(GL.width, GL.height);
	// this._fboRender = new bongiovi.FrameBuffer(1024, 1024);

	var sizeBlur = 512;
	this._fboBlur0 = new bongiovi.FrameBuffer(sizeBlur, sizeBlur);
	this._fboBlur1 = new bongiovi.FrameBuffer(sizeBlur, sizeBlur);
};

module.exports = SceneApp;



// <iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/188056255&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>