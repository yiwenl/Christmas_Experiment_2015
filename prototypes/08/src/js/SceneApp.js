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
	// this.camera.lockRotation(false);
	this.camera.radius.setTo(1200);
	var easing = .0015;
	this.camera.radius.setEasing(easing);
	this.sceneRotation.lock(true);
	this.cameraTarget = new Vec3(300, 0, 1000, easing);
	this.camera._rx.setTo(.1);
	this.camera._rx.limit(0, .1);
	this.cameraOffset = new Vec3(0, -30, 0, easing);
}


var p = SceneApp.prototype = new bongiovi.Scene();



p.setState = function(index) {
	console.log('setState', index);
	var that = this;

	if(index == 0) {
		this.cameraTarget.set(300, 0, 1000);
		this.camera.radius.value = 1200;
		this.cameraOffset.set(0, -30, 0);
		params.speed = 0;
		params.lanternOpacity.value = 1;
	} else if(index == 1) {
		this.cameraTarget.set(0, -200, 0);
		this.camera.radius.value = 600;
		this.cameraOffset.set(0, -50, 0);
		params.speed = 1;

		window.setTimeout(function() {
			params.lanternOpacity.value = 0;	
			that.camera.lockRotation(false);
		}, 3000);
		
	}
};

p._initTextures = function() {
	console.log('Init Textures');

	this._textureBg1 = new bongiovi.GLTexture(images.bg1);
	this._textureBg2 = new bongiovi.GLTexture(images.bg2);
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
};

p._update = function() {
	this._subsceneLantern.update();
};

p.render = function() {
	//	CAMERA 
	this.camera.center = this.cameraTarget.getValue();
	this.camera.positionOffset = this.cameraOffset.getValue();


	this.count += .01;
	var a = this.camera._ry.value;
	while(a < 0) {
		a += Math.PI * 2.0;
	}
	// a /= Math.PI * 2.0;
	a = Math.sin(a) * .5 + .5;
	params.post.bgOffset = a;
	this._update();

	gl.enable(gl.DEPTH_TEST);

	//	UPDATE BACKGROUND
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
};

p.resize = function() {
	console.log('Resize');
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);

	this._fboRender = new bongiovi.FrameBuffer(GL.width, GL.height);
};

module.exports = SceneApp;