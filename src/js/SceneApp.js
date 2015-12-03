// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewPlane = require("./ViewPlane");
var ViewGodRay = require("./ViewGodRay");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this._texture = new bongiovi.GLTexture(images.forestSpirit);
	this._fboRender = new bongiovi.FrameBuffer(GL.width, GL.height);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis     = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	
	this._vPlane    = new ViewPlane();
	this._vCopy     = new bongiovi.ViewCopy();
	this._vGodRay 	= new ViewGodRay();
};

p.render = function() {

	this._fboRender.bind();
	GL.clear(0, 0, 0, 0);
	// this._vAxis.render();
	this._vDotPlane.render();
	this._vPlane.render(this._texture);

	this._fboRender.unbind();


	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);
	this._vGodRay.render(this._fboRender.getTexture());
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;