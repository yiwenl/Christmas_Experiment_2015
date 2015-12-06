// app.js
window.bongiovi = require("./libs/bongiovi.js");
window.Sono     = require("./libs/sono.min.js");
var dat         = require("dat-gui");

window.params = {
	numParticles:64,
	skipCount:15,
	gamma:2.2,
	density:.10,
	weight:.1,
	decay:.85,
	noise:.3,
	terrainNoiseHeight:135.0,
	detailMapScale:3.4,
	detailMapHeight:.05,
	noiseScale:.25,
	lightPos:[1.0, 1.0, 1.0],
	lightColor:[255.0, 255.0, 255.0],
	bump:.3
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {

		var l = new bongiovi.SimpleImageLoader();
		var a = [
			'assets/gold.jpg', 
			'assets/blue.jpg',
			"assets/detailHeight.png",
			"assets/noise.png",
			];
		l.load(a, this, this._onImageLoader);
	}

	var p = App.prototype;

	p._onImageLoader = function(img) {
		window.images = img;
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
		this.gui.add(params,'gamma', 1, 5);
		this.gui.add(params, 'density', 0.0, 1.0);
		this.gui.add(params, 'weight', 0.0, 1.0);
		this.gui.add(params, 'decay', 0.0, 1.0);
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();