// SceneApp.js

var GL = bongiovi.GL, gl;

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
	this.count = 0;
	this.percent = 0;

	this.resize();
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');
};

p._initViews = function() {
	console.log('Init Views');

	this._vCopy = new bongiovi.ViewCopy();

	this._subsceneTerrain = new SubsceneTerrain(this);
};

p._update = function() {
};


p.render = function() {
	this._update();
	GL.clear(0, 0, 0, 0);
	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);
	GL.setViewport(0, 0, GL.width, GL.height);
	this._subsceneTerrain.render();
};

p.resize = function() {
};

module.exports = SceneApp;