// ViewSky.js

var GL = bongiovi.GL;
var gl;
var glslify = require("glslify");

function ViewSky() {
	bongiovi.View.call(this, glslify("../shaders/sky.vert"), glslify("../shaders/sky.frag"));
}

var p = ViewSky.prototype = new bongiovi.View();
p.constructor = ViewSky;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 
	var radius = 100;
	var num = 48;
	var count = 0;
	var rx, ry, r, uvGap = 1/num;

	function getPosition(i, j) {
		var pos = [0, 0, 0];
		var range = .5;
		rx = j/num * Math.PI*range*2.0 - Math.PI*range;
		ry = i/num * Math.PI * 2.0;

		pos[1] = Math.sin(rx) * radius;
		r = Math.cos(rx) * radius;
		pos[0] = Math.cos(ry) * r;
		pos[2] = Math.sin(ry) * r;

		return pos;
	}

	for(var j=0; j<num; j++) {
		for(var i=0; i<num; i++) {
			positions.push(getPosition(i, j));
			positions.push(getPosition(i+1, j));
			positions.push(getPosition(i+1, j+1));
			positions.push(getPosition(i, j+1));

			coords.push([i/num, j/num]);
			coords.push([i/num+uvGap, j/num]);
			coords.push([i/num+uvGap, j/num+uvGap]);
			coords.push([i/num, j/num+uvGap]);

			indices.push(count * 4 + 0);
			indices.push(count * 4 + 1);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 0);
			indices.push(count * 4 + 2);
			indices.push(count * 4 + 3);

			count ++;
		}
	}


	this.mesh = new bongiovi.Mesh(positions.length, indices.length, params.debugLines ? GL.gl.LINES : GL.gl.TRIANGLES);
	// this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.LINES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);

	// this.mesh = bongiovi.MeshUtils.createSphere(100, 48);
};

p.render = function(texture, camera) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("near", "uniform1f", camera.near);
	this.shader.uniform("far", "uniform1f", camera.far);
	this.shader.uniform("cameraPos", "uniform3fv", camera.position);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewSky;