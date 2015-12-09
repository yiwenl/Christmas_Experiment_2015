// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewPlane = require("./ViewPlane");
var ViewBlur = require("./ViewBlur");
var ViewGodRay = require("./ViewGodRay");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);
	this.camera.lockRotation(false);
	this.sceneRotation.lock(true);
	this.camera.setPerspective(50 * Math.PI/180, GL.aspectRatio, 5, 4000);
	this.camera.radius.value = 200;
	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this._texture = new bongiovi.GLTexture(images.stained);
	this._textureBlur = new bongiovi.GLTexture(images.stainedBlur);
	this._fboRender = new bongiovi.FrameBuffer(GL.width, GL.height);

	var postSize = 512;
	this._fboPost = new bongiovi.FrameBuffer(postSize, postSize);
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
	for(var i=0; i<5; i++ ) {
		var r = Math.PI * 2 * i / 5;
		this._vPlane.render(this._textureBlur, r);	
	}
	this._fboRender.unbind();

	gl.disable(gl.DEPTH_TEST);
	GL.enableAdditiveBlending();

	for(var i=0; i<5; i++) {
		var r = Math.PI * 2 * i / 5;
		this._vPlane.render(this._texture, r);	
	}
	


	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);

	GL.setViewport(0, 0, this._fboPost.width, this._fboPost.height);
	this._fboPost.bind();
	GL.clear(0, 0, 0, 0);
	this._vGodRay.render(this._fboRender.getTexture());
	this._fboPost.unbind();


	GL.setViewport(0, 0, GL.width, GL.height);
	
	this._vCopy.render(this._fboPost.getTexture());
	
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);

	this._fboRender = new bongiovi.FrameBuffer(GL.width, GL.height);

};

module.exports = SceneApp;