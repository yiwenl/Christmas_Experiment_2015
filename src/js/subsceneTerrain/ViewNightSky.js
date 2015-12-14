// ViewNightSky.js
var GL = bongiovi.GL;
var gl;
var glm = bongiovi.glm;
var glslify = require("glslify");

function ViewNightSky() {
	this.angle = 0;
	this._axis = glm.vec3.clone([0.9170600771903992, 0.39874908328056335, 0]);
	bongiovi.View.call(this, glslify("./shaders/nightsky.vert"), glslify("./shaders/nightsky.frag"));
}

var p = ViewNightSky.prototype = new bongiovi.View();
p.constructor = ViewNightSky;


p._init = function() {
	gl = GL.gl;
	// this.mesh = bongiovi.MeshUtils.createSphere(1800, 24);
	var numSegments = 24;
	var size = 1800;

	var positions = [];
	var coords    = [];
	var indices   = [];
	var index     = 0;
	var gapUV     = 1/numSegments;

	var getPosition = function(i, j, isNormal) {	//	rx : -90 ~ 90 , ry : 0 ~ 360
		isNormal = isNormal === undefined ? false : isNormal;
		var rx = i/numSegments * Math.PI - Math.PI * 0.5;
		var ry = j/numSegments * Math.PI * 2;
		var r = isNormal ? 1 : size;
		var pos = [];
		pos[1] = Math.sin(rx) * r;
		var t = Math.cos(rx) * r;
		pos[0] = Math.cos(ry) * t;
		pos[2] = Math.sin(ry) * t;
		return pos;
	};

	
	for(var i=0; i<numSegments; i++) {
		for(var j=0; j<numSegments; j++) {
			positions.push(getPosition(i, j));
			positions.push(getPosition(i+1, j));
			positions.push(getPosition(i+1, j+1));
			positions.push(getPosition(i, j+1));
			var u = j/numSegments;
			var v = i/numSegments;
			
			
			coords.push([1.0 - u, v]);
			coords.push([1.0 - u, v+gapUV]);
			coords.push([1.0 - u - gapUV, v+gapUV]);
			coords.push([1.0 - u - gapUV, v]);

			indices.push(index*4 + 3);
			indices.push(index*4 + 2);
			indices.push(index*4 + 0);
			indices.push(index*4 + 2);
			indices.push(index*4 + 1);
			indices.push(index*4 + 0);

			index++;
		}
	}


	var mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoords(coords);
	mesh.bufferIndices(indices);
	this.mesh = mesh;
};

p.render = function(texture) {
	this.angle += .02;
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("axis", "uniform3fv", this._axis);
	this.shader.uniform("angle", "uniform1f", this.angle);
	this.shader.uniform("near", "uniform1f", GL.camera.near);
	this.shader.uniform("far", "uniform1f", GL.camera.far);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewNightSky;