// SceneApp.js

var GL = bongiovi.GL, gl;
var DeviceOrientation = require("./DeviceOrientation");
var ViewPlane = require("./ViewPlane");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);

	this.camera.lockRotation(false);
	this.sceneRotation.lock(true);
	this.camera.setPerspective(50 * Math.PI/180, GL.aspectRatio, 5, 4000);
	this.camera.radius.value = 200;

	this._deviceOrientation = new DeviceOrientation();
	this._deviceOrientation.addEventListener('onOrientation', this._onOrientation.bind(this));

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
	this._texture = new bongiovi.GLTexture(images.stained);
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vPlane    = new ViewPlane();
};

p.render = function() {
	this._vAxis.render();
	// this._vDotPlane.render();

	for(var i=0; i<5; i++) {
		var r = Math.PI * 2 * i / 5;
		this._vPlane.render(this._texture, r);	
	}
};


p._onOrientation = function(e) {
	this.camera._ry.value = e.detail.yaw + Math.PI*2;
	this.camera._rx.value = -e.detail.pitch;
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;