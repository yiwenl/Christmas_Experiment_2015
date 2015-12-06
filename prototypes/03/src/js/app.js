// app.js
window.bongiovi = require("./libs/bongiovi.js");
window.Sono     = require("./libs/sono.min.js");
var dat = require("dat-gui");
var Stats = require("stats-js");

window.params = {
	skipCount:5,
	numParticles:150,
	windSpeed:1.5,
	noiseOffset:.0175,
	noiseDifference:.3,
	maxRadius:1000,
	focusLength:.975,
	depthContrast:1.0,
	blur:1.0,
	terrainNoiseHeight:35.0,
	lightPos:[1.0, 1.0, 1.0],
	lightColor:[255.0, 255.0, 255.0],
	noise:.3,
	noiseScale:.25,
	detailMapScale:3.4,
	detailMapHeight:.05,
	bump:.3,
	enablePostEffect:false,
	showStats:false,
	cameraAutoRotate:false

};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {

		var loader = new bongiovi.SimpleImageLoader();
		var assets = [
			"assets/detailHeight.png",
			"assets/noise.png",
			"assets/flower.png",
			"assets/bg.jpg"
		];

		loader.load(assets, this, this._onImageLoaded, this._onImageProgress)
	}

	var p = App.prototype;

	p._onImageProgress = function(p) {
		console.log("Loading : ", p);
	};

	p._onImageLoaded = function(imgs) {
		window.images = imgs;

		if(document.body) this._init();
		else {
			window.addEventListener("load", this._init.bind(this));
		}
	};

	p._init = function() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.className = "Main-Canvas";
		document.body.appendChild(this.canvas);
		bongiovi.GL.init(this.canvas);

		this._scene = new SceneApp();
		bongiovi.Scheduler.addEF(this, this._loop);

		this.gui = new dat.GUI({width:300});
		this.gui.add(params, "skipCount", 1, 100);
		this.gui.add(params, "windSpeed", 0, 5);
		this.gui.add(params, "noiseOffset", 0.01, 0.05);
		this.gui.add(params, "noiseDifference", 0, 1);
		this.gui.add(params, "maxRadius", 500.0, 1500.0);
		this.gui.add(params, "focusLength", 0.9, 1.0);
		this.gui.add(params, "depthContrast", 1.0, 5.0);
		this.gui.add(params, "blur", 0.0, 5.0);
		this.gui.add(params, "terrainNoiseHeight", 0.0, 100.0);
		this.gui.addColor(params, "lightColor");
		this.gui.add(params, "enablePostEffect");
		this.gui.add(params, "cameraAutoRotate");
		this.gui.add(params, "showStats").onFinishChange(this._onStats.bind(this));

		this.stats = new Stats();
		document.body.appendChild(this.stats.domElement);
		this.stats.domElement.classList.toggle('is-hidden', !params.showStats)
	};

	p._onStats = function() {
		this.stats.domElement.classList.toggle('is-hidden', !params.showStats)
		console.log(this.stats.domElement);
	};

	p._loop = function() {
		this._scene.loop();
		this.stats.update();
	};

})();


new App();