// Vec3.js

function Vec3(x, y, z, easing) {
	x = x === undefined ? 0 : x;
	y = y === undefined ? 0 : y;
	z = z === undefined ? 0 : z;
	easing = easing || .1;

	this.x = new bongiovi.EaseNumber(x, easing);
	this.y = new bongiovi.EaseNumber(y, easing);
	this.z = new bongiovi.EaseNumber(z, easing);
}


var p = Vec3.prototype;

p.set = function(x, y, z) {
	this.x.value = x;
	this.y.value = y;
	this.z.value = z;
}

p.setTo = function(x, y, z) {
	this.x.setTo(x);
	this.y.setTo(y);
	this.z.setTo(z);
};

p.getValue = function() {
	return [ this.x.value, this.y.value, this.z.value ];
};


module.exports = Vec3;