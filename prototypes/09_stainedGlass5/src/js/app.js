// app.js
window.bongiovi = require("./libs/bongiovi.js");
var dat = require("dat-gui");
window.params = {
	density:.15,
	weight:.15,
	decay:.85,
	z:137
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {

		var l = new bongiovi.SimpleImageLoader();
		var a = ["assets/stainedBlur.jpg", "assets/stained.jpg"];

		l.load(a, this, this._onImageLoaded);

		
	}

	var p = App.prototype;


	p._onImageLoaded = function(img) {
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
		this.gui.add(params, 'density', 0.0, 1.0);
		this.gui.add(params, 'weight', 0.0, 1.0);
		this.gui.add(params, 'decay', 0.0, 1.0);
		this.gui.add(params, 'z', 130.0, 150.0);
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();