// app.js
window.bongiovi = require("./libs/bongiovi.js");
var dat = require("dat-gui");

window.params = {
	yDistance:50,
	numPortraits:6,
	z:200
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {

		var l = new bongiovi.SimpleImageLoader();
		var a = [
					"assets/01.jpg",
					"assets/02.jpg",
					"assets/03.jpg",
					"assets/04.jpg"
				];


		l.load(a, this, this._onImageLoaded);
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

		this.gui = new dat.GUI({width:300});
		this.gui.add(params, 'z', 30.0, 350.0);
		this.gui.add(params, 'yDistance', 30.0, 350.0);
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();