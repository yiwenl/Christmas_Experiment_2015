// SubsceneLantern.js

var GL = bongiovi.GL, gl;

var ViewSave = require("./ViewSave");
var ViewRender = require("./ViewRender");
var ViewSimulation = require("./ViewSimulation");
var ViewBoxes = require("./ViewBoxes");
var ViewBox = require("./ViewBox");

function SubsceneLantern(scene) {
	gl                 = GL.gl;
	this.scene         = scene;
	this.camera        = scene.camera;
	this.cameraOtho    = scene.cameraOtho;
	this.rotationFront = scene.rotationFront;
	this.count         = 0;
	this.percent       = 0;

	window.addEventListener("resize", this.resize.bind(this));

	this._initTextures();
	this._initViews();
	this.resize();
}


var p = SubsceneLantern.prototype;

p._initTextures = function() {
	this._texture = new bongiovi.GLTexture(images.gold);
	this._textureNormal = new bongiovi.GLTexture(images.paperNormal)
	if(!gl) gl = GL.gl;

	var num = params.numParticles;
	var o = {
		minFilter:gl.NEAREST,
		magFilter:gl.NEAREST
	}
	this._fboCurrent 	= new bongiovi.FrameBuffer(num*2, num*2, o);
	this._fboTarget 	= new bongiovi.FrameBuffer(num*2, num*2, o);

};

p._initViews = function() {
	this._vAxis     = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vSave     = new ViewSave();
	this._vCopy 	= new bongiovi.ViewCopy();
	this._vRender 	= new ViewRender();
	this._vSim 		= new ViewSimulation();
	this._vBoxes	= new ViewBoxes();
	this._vBox 		= new ViewBox();


	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._fboCurrent.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	this._vSave.render();
	this._fboCurrent.unbind();
};


p.updateFbo = function() {
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._fboTarget.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	GL.clear(0, 0, 0, 0);
	this._vSim.render(this._fboCurrent.getTexture() );
	this._fboTarget.unbind();


	var tmp = this._fboTarget;
	this._fboTarget = this._fboCurrent;
	this._fboCurrent = tmp;
};

p.update = function() {
	if(this.count % params.skipCount == 0 && params.speed > 0) {
		this.updateFbo();	
		this.count = 0;
	}

	this.count++;
	this.percent = this.count / params.skipCount;
};


p.render = function(textureEnv) {
	this._vBox.render(this._texture, this._textureNormal, textureEnv);
	this._vBoxes.render(this._fboTarget.getTexture(), this._fboCurrent.getTexture(), this._texture, this.percent, this._textureNormal, textureEnv);
};



p.resize = function() {
	var scale = 1.5;
	GL.setSize(window.innerWidth*scale, window.innerHeight*scale);
	this.camera.resize(GL.aspectRatio);

	this._fboRender = new bongiovi.FrameBuffer(GL.width, GL.height);
};


module.exports = SubsceneLantern;