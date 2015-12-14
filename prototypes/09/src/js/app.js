// app.js
window.bongiovi = require("./libs/bongiovi-post.js");
window.Sono     = require("./libs/sono.min.js");
var dat         = require("dat-gui");

window.params = {
	numParticles:64,
	skipCount:15,
	gamma:2.2,
	density:.10,
	weight:.1,
	decay:.85,

	terrain: {
		noise:.3,
		terrainNoiseHeight:235.0,
		detailMapScale:3.4,
		detailMapHeight:.25,
		noiseScale:.25,
		lightPos:[500.0, 20.0, 500.0],
		lightColor:[255.0, 255.0, 255.0],
		baseColor:[255.0, 255.0, 255.0],
		bump:.3,
		roughness:.5,
		metallic:.0,
		specular:1.0,
		gamma:2.2,
		exposure:1.5
	},


	post : {
		enablePostEffect:true,
		bloomThreshold:.75
	}

	
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
		// this.gui.add(params,'gamma', 1, 5);
		// this.gui.add(params, 'density', 0.0, 1.0);
		// this.gui.add(params, 'weight', 0.0, 1.0);
		// this.gui.add(params, 'decay', 0.0, 1.0);

		var fTerrain = this.gui.addFolder('terrain');
		fTerrain.open();
		fTerrain.add(params.terrain, 'roughness', 0.0, 1.0);
		fTerrain.add(params.terrain, 'metallic', 0.0, 1.0).listen();
		fTerrain.add(params.terrain, 'specular', 0.0, 1.0);
		fTerrain.add(params.terrain, 'exposure', 0.0, 2.0);
		fTerrain.add(params.terrain, 'gamma', 0.0, 5.0);
		fTerrain.addColor(params.terrain, 'baseColor');

		var fPost = this.gui.addFolder('post effect');
		fPost.open();
		fPost.add(params.post, 'enablePostEffect');
		fPost.add(params.post, 'bloomThreshold', 0.0, 1.0);
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();