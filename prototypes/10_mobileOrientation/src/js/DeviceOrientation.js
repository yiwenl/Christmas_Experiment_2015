// DeviceOrientation.js

function DeviceOrientation() {
	this.degRad = Math.PI / 180;
	this._orientationBind = this._onOrientation.bind(this);
	window.addEventListener('deviceorientation', this._orientationBind);
}


var p = DeviceOrientation.prototype = new bongiovi.EventDispatcher();

p._onOrientation = function(e) {
	// console.log(e.alpha, this.degRad);
	var orientation = this.rotateEuler({
		yaw: e.alpha * this.degRad,
		pitch: e.beta * this.degRad,
		roll: e.gamma * this.degRad
	});
	console.log('On Orientation', orientation);	

	this.dispatchCustomEvent('onOrientation', orientation);
};

p.rotateEuler = function(euler) {
	var heading;
	var bank;
	var attitude;
	var ch = Math.cos(euler.yaw);
	var sh = Math.sin(euler.yaw);
	var ca = Math.cos(euler.pitch);
	var sa = Math.sin(euler.pitch);
	var cb = Math.cos(euler.roll);
	var sb = Math.sin(euler.roll);

	var matrix = [
	  sh * sb - ch * sa * cb, -ch * ca, ch * sa * sb + sh * cb,
	  ca * cb, -sa, -ca * sb,
	  sh * sa * cb + ch * sb, sh * ca,   -sh * sa * sb + ch * cb
	]; // Note: Includes 90 degree rotation around z axis

	/* [m00 m01 m02] 0 1 2
	 * [m10 m11 m12] 3 4 5
	 * [m20 m21 m22] 6 7 8 */

	if (matrix[3] > 0.9999) {
	  // Deal with singularity at north pole
	  heading = Math.atan2(matrix[2], matrix[8]);
	  attitude = Math.PI / 2;
	  bank = 0;
	} else if (matrix[3] < -0.9999) {
	  // Deal with singularity at south pole
	  heading = Math.atan2(matrix[2], matrix[8]);
	  attitude = -Math.PI / 2;
	  bank = 0;
	} else {
	  heading = Math.atan2(-matrix[6], matrix[0]);
	  bank = Math.atan2(-matrix[5], matrix[4]);
	  attitude = Math.asin(matrix[3]);
	}

	return {yaw: heading, pitch: attitude, roll: bank};
};

module.exports = DeviceOrientation;