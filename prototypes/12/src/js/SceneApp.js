// SceneApp.js

var GL = bongiovi.GL, gl;
var SubsceneLantern = require("./subsceneLantern/SubsceneLantern");
var SubsceneTerrain = require("./subsceneTerrain/SubsceneTerrain");
	
var Vec3 = require("./Vec3");
//	post effects
var ViewFXAA = require("./ViewFXAA");
var ViewBlur = require("./ViewBlur");
var ViewPost = require("./ViewPost");
var ViewBg = require("./ViewBg");

function SceneApp() {
	this.count = 0;
	gl = GL.gl;
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));

	this.camera.setPerspective(90 * Math.PI/180, GL.aspectRatio, 5, 4000);
	this.camera.lockRotation(false);
	this.camera.radius.setTo(1200);
	var easing = .015;
	this.camera.radius.setEasing(easing);
	this.sceneRotation.lock(true);
	this.cameraTarget = new Vec3(300, 0, 1000, easing);
	this.camera._rx.setTo(.1);
	this.camera._rx.limit(0, .1);
	this.cameraOffset = new Vec3(0, 0, 0, easing);
}


var p = SceneApp.prototype = new bongiovi.Scene();



p.setState = function(index) {
	console.log('setState', index);

	if(index == 0) {
		this.cameraTarget.set(300, 0, 1000);
		this.camera.radius.value = 1200;
		this.cameraOffset.set(0, 0, 0);
	} else if(index == 1) {
		this.cameraTarget.set(0, -100, 0);
		this.camera.radius.value = 600;
		this.cameraOffset.set(0, -50, 0);
	}
};

p._initTextures = function() {
	console.log('Init Textures');

	this._textureBg = new bongiovi.GLTexture(images.bg);
	this._textureBg1 = new bongiovi.GLTexture(images.bg1);
	this._textureBg2 = new bongiovi.GLTexture(images.bg3);
	var renderSize = 1024;
	// this._fboRender = new bongiovi.FrameBuffer(renderSize, renderSize);
	this._fboRender = new bongiovi.FrameBuffer(GL.width, GL.height);
	this._fboBg = new bongiovi.FrameBuffer(renderSize, renderSize/2);
};

p._initViews = function() {
	console.log('Init Views');
	this._vCopy = new  bongiovi.ViewCopy();
	this._vBg = new ViewBg();
	this._subsceneLantern = new SubsceneLantern(this);
	this._subsceneTerrain = new SubsceneTerrain(this);

	var fboBlurSize = 512;
	var vBlur = new ViewBlur(true);
	var hBlur = new ViewBlur(false);
	var passVBlur = new bongiovi.post.Pass(vBlur, fboBlurSize, fboBlurSize);
	var passHBlur = new bongiovi.post.Pass(hBlur, fboBlurSize, fboBlurSize);

	var fboSize = 1024;
	this._vPost = new ViewPost();
	var passPost = new bongiovi.post.Pass(this._vPost, fboSize, fboSize);
	this._vFxaa = new ViewFXAA();
	var passFxaa = new bongiovi.post.Pass(this._vFxaa, fboSize, fboSize);


	this._composerPost = new bongiovi.post.EffectComposer();
	this._composerPost.addPass(passPost);
	// this._composerPost.addPass(passFxaa, fboSize, fboSize);

	
	this._composerBlur = new bongiovi.post.EffectComposer();
	this._composerBlur.addPass(passVBlur);
	// this._composerBlur.addPass(passVBlur);
	// this._composerBlur.addPass(passHBlur);
	this._composerBlur.addPass(passHBlur);
};

p._update = function() {
	this._subsceneLantern.update();
};

p.render = function() {
	//	CAMERA 
	this.camera.center = this.cameraTarget.getValue();
	this.camera.positionOffset = this.cameraOffset.getValue();


	this.count += .01;
	params.post.bgOffset = Math.sin(this.count) * .5 + .5;
	this._update();


//*/
	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);

	GL.setViewport(0, 0, this._fboBg.width, this._fboBg.height);
	this._fboBg.bind();
	GL.clear(0, 0, 0, 0);
	this._vBg.render(this._textureBg1, this._textureBg2);
	this._fboBg.unbind();

	GL.setViewport(0, 0, GL.width, GL.height);

	gl.disable(gl.DEPTH_TEST);
	this._vCopy.render(this._fboBg.getTexture());

	gl.enable(gl.DEPTH_TEST);
	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);
	
	this._subsceneTerrain.render(this._fboBg.getTexture());
	this._subsceneLantern.render(this._fboBg.getTexture());
	
	return;

	//*/


	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);

	GL.setViewport(0, 0, this._fboBg.width, this._fboBg.height);
	this._fboBg.bind();
	GL.clear(0, 0, 0, 0);
	this._vBg.render(this._textureBg1, this._textureBg2);
	this._fboBg.unbind();


	GL.setViewport(0, 0, this._fboRender.width, this._fboRender.height);

	this._fboRender.bind();
	GL.clear(0, 0, 0, 1);
	gl.disable(gl.DEPTH_TEST);
	this._vCopy.render(this._fboBg.getTexture());

	gl.enable(gl.DEPTH_TEST);
	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);
	this._subsceneLantern.render(this._fboBg.getTexture());
	this._subsceneTerrain.render(this._fboBg.getTexture());
	this._fboRender.unbind();

	GL.setViewport(0, 0, GL.width, GL.height);
	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);

	this._composerBlur.render(this._fboRender.getTexture());
	this._vPost.textureBlur = this._composerBlur.getTexture();

	GL.enableAdditiveBlending();
	this._composerPost.render(this._fboRender.getTexture());
	this._vCopy.render(this._fboRender.getTexture());
	this._vFxaa.render(this._composerPost.getTexture());
	GL.enableAlphaBlending();
};

p.resize = function() {
	console.log('Resize');
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);

	this._fboRender = new bongiovi.FrameBuffer(GL.width, GL.height);
};

module.exports = SceneApp;