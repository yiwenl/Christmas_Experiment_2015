// app.js
window.bongiovi = require("./libs/bongiovi.js");
var dat = require("dat-gui");

window.params = {
	lightPos:[1.0, 1.0, 1.0],
	lightColor:[255.0, 255.0, 255.0],
	terrainNoiseHeight:35.0,
	bump:.3,
	noiseScale:.25,
	detailMapScale:3.4,
	detailMapHeight:.05
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

		loader.load(assets, this, this._onImageLoaded);
	}

	var p = App.prototype;

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

		// this.gui = new dat.GUI({width:300});
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();