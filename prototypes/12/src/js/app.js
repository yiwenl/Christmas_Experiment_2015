// app.js
window.bongiovi = require("./libs/bongiovi.js");
var dat = require("dat-gui");

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
		bump:.3,
		shininess:.55,
		roughness:1.0,
		albedo:.5,
		ambient:.8
	}
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {
		var l = new bongiovi.SimpleImageLoader();
		var a = [
			'assets/gold.jpg', 
			'assets/blue.jpg',
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
		document.body.appendChild(this.canvas);
		bongiovi.GL.init(this.canvas);

		this._scene = new SceneApp();
		bongiovi.Scheduler.addEF(this, this._loop);

		// this.gui = new dat.GUI({width:300});

		require('soundcloud-badge')({
		    client_id: 'e8b7a335a5321247b38da4ccc07b07a2'
		  // , song: 'https://soundcloud.com/rsheehan/rhian-sheehan-la-bo-te-musique'
		  , song: 'https://soundcloud.com/dee-san/oscillate-01'
		  , dark: false
		  , getFonts: true
		}, function(err, src, data, div) {
		  if (err) throw err

		  // Play the song on
		  // a modern browser
		  var audio = new Audio
		  audio.src = src
		  audio.play()
		  audio.loop = true;
		  audio.volume = 0;

		  // Metadata related to the song
		  // retrieved by the API.
		  console.log(audio);
		  console.log(data)
		});
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();