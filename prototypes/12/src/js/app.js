// app.js
window.bongiovi = require("./libs/bongiovi-post.min.js");
// var dat = require("dat-gui");

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
		lightPos:[500.0, 500.0, 500.0],
		lightColor:[255.0, 255.0, 255.0],
		bump:.53,
		shininess:.55,
		roughness:1.0,
		albedo:.5,
		ambient:.28
	},


	post: {
		bloom:.25,
		gamma:1.2,
		bgOffset:0
	}
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {
		var l = new bongiovi.SimpleImageLoader();
		var a = [
			'assets/gold.jpg', 
			'assets/bg1.jpg',
			'assets/bg2.jpg',
			'assets/starsmap.jpg',
			'assets/paperNormal.jpg',
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
		var options = {
		    alpha: false,
		    premultipliedAlpha: true
		}
		document.body.appendChild(this.canvas, null, null, options);
		bongiovi.GL.init(this.canvas);

		this._scene = new SceneApp();
		bongiovi.Scheduler.addEF(this, this._loop);
/*
		this.gui = new dat.GUI({width:300});
		var fTerrain = this.gui.addFolder('terrain');
		fTerrain.open();
		fTerrain.add(params.terrain, 'bump', 0, 1);
		fTerrain.add(params.terrain, 'shininess', 0, 1);
		fTerrain.add(params.terrain, 'roughness', 0, 1);
		fTerrain.add(params.terrain, 'albedo', 0, 1);

		var fPost = this.gui.addFolder('post');
		fPost.open();
		fPost.add(params.post, 'bgOffset', 0, 1.0).listen();
		fPost.add(params.post, 'bloom', 0, 1.0);
		fPost.add(params.post, 'gamma', 0, 3.0);
*/


//*/
		require('soundcloud-badge')({
		    client_id: 'e8b7a335a5321247b38da4ccc07b07a2'
		  , song: 'https://soundcloud.com/rsheehan/rhian-sheehan-la-bo-te-musique'
		  // , song: 'https://soundcloud.com/dee-san/oscillate-01'
		  , dark: false
		  , getFonts: true
		}, function(err, src, data, div) {
		  if (err) throw err;
		  var audio = new Audio
		  audio.src = src
		  audio.play()
		  audio.loop = true;
		  audio.volume = .25;
		});
//*/		

		window.addEventListener('keydown', this._onKeyDown.bind(this));
		this._scene.setState(1);
	};


	p._onKeyDown = function(e) {
		console.log(e.keyCode, e);
		if(e.keyCode == 48) {	//	state 0
			this._scene.setState(0);
		} else if(e.keyCode == 49) {	//	state 1
			this._scene.setState(1);
		}
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();