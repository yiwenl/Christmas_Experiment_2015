// ViewSaveExtra.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");
var random = function(min, max) { return min + Math.random() * (max - min);	};

function ViewSaveExtra() {
	bongiovi.View.call(this, glslify("../shaders/save.vert"), glslify("../shaders/save.frag"));
}

var p = ViewSaveExtra.prototype = new bongiovi.View();
p.constructor = ViewSaveExtra;


p._init = function() {
	gl = GL.gl;

	var positions = [];
	var coords = [];
	var indices = []; 
	var count = 0;

	var numParticles = params.numParticles;
	var totalParticles = numParticles * numParticles;
	console.log('Total Particles : ', totalParticles);
	var ux, uy;
	var range = 100.0;

	function getUVoffset() {
		var r = Math.random();
		if(r < .25) {
			return [0, 0, 0];
		} else if(r < .5) {
			return [.5, 0, 0];
		} else if(r < .75) {
			return [0, .5, 0];
		} else {
			return [.5, .5, 0];
		}
	}


	for(var j=0; j<numParticles; j++) {
		for(var i=0; i<numParticles; i++) {

			ux = i/numParticles-1.0 + .5/numParticles;
			uy = j/numParticles-1.0 + .5/numParticles;

			//	ROTATION
			// var rotation = [1, 0, 0];
			var rotation = [random(-1, 1), random(-1, 1), random(-1, 1)];
			positions.push(rotation);
			coords.push([ux, uy]);
			indices.push(count);
			count ++;

			//	UV OFFSET
			positions.push(getUVoffset());
			coords.push([ux+1.0, uy]);
			indices.push(count);
			count ++;

			//	RANDOMS
			positions.push([Math.random(), Math.random(), Math.random()]);
			coords.push([ux, uy+1.0]);
			indices.push(count);
			count ++;

		}
	}


	// this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.POINTS);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function() {
	this.shader.bind();
	GL.draw(this.mesh);
};

module.exports = ViewSaveExtra;