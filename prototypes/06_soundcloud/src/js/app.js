// app.js
window.bongiovi = require("./libs/bongiovi.js");
var dat = require("dat-gui");

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {
		if(document.body) this._init();
		else {
			window.addEventListener("load", this._init.bind(this));
		}
	}

	var p = App.prototype;

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
		  , song: 'https://soundcloud.com/rsheehan/rhian-sheehan-la-bo-te-musique'
		  , dark: false
		  , getFonts: true
		}, function(err, src, data, div) {
		  if (err) throw err

		  // Play the song on
		  // a modern browser
		  var audio = new Audio
		  audio.src = src
		  audio.play()

		  // Metadata related to the song
		  // retrieved by the API.
		  console.log(data)
		});
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();