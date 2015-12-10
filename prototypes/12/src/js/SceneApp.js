// SceneApp.js

var GL = bongiovi.GL, gl;
var SubsceneLantern = require("./subsceneLantern/SubsceneLantern");
var SubsceneTerrain = require("./subsceneTerrain/SubsceneTerrain");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));

	this.camera.setPerspective(90 * Math.PI/180, GL.aspectRatio, 5, 4000);
	this.camera.lockRotation(false);
	this.sceneRotation.lock(true);

	this.camera._rx.value =  .1;
	this.camera._ry.value = -.1;
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();

	this._subsceneLantern = new SubsceneLantern(this);
	this._subsceneTerrain = new SubsceneTerrain(this);
};

p._update = function() {
	this._subsceneLantern.update();
};

p.render = function() {
	this._update();

	GL.clear(0, 0, 0, 0);
	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);
	GL.setViewport(0, 0, GL.width, GL.height);

	// this._vAxis.render();
	// this._vDotPlane.render();

	this._subsceneLantern.render();
	this._subsceneTerrain.render();
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;