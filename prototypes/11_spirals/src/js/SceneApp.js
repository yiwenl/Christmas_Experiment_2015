// SceneApp.js

var GL = bongiovi.GL, gl;
var ViewPortrait = require("./ViewPortrait");

function SceneApp() {
	gl = GL.gl;
	bongiovi.Scene.call(this);

	this.camera.lockRotation(false);
	this.sceneRotation.lock(true);
	this.camera.setPerspective(50 * Math.PI/180, GL.aspectRatio, 5, 4000);
	this.camera.radius.value = 300;

	window.addEventListener("resize", this.resize.bind(this));
}


var p = SceneApp.prototype = new bongiovi.Scene();

p._initTextures = function() {
	console.log('Init Textures');

	this._textures = [];
	for(var i=1; i<=4; i++) {
		var t = new bongiovi.GLTexture(images['0'+i]);
		this._textures.push(t);
	}
};

p._initViews = function() {
	console.log('Init Views');
	this._vAxis = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();

	this._vPortrait = new ViewPortrait();
};

p.render = function() {
	// this._vAxis.render();
	// this._vDotPlane.render();
	var angle = Math.PI*2/params.numPortraits;
	var num = 10;
	for(var i=-num; i<num; i++) {
		this._vPortrait.render(this._textures[(i+num)%4], angle*i, i*params.yDistance);	
	}
	
};

p.resize = function() {
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);
};

module.exports = SceneApp;