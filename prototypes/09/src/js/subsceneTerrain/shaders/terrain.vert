#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec2 uvOffset;
uniform float numTiles;
uniform float size;
uniform float height;
uniform float near;
uniform float far;
uniform sampler2D texture;

varying float vDepth;
varying vec2 vTextureCoord;
varying vec3 vEye;
varying vec3 vVertex;
varying vec3 vPosition;

float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}


vec3 getPosition(vec2 uv) {
	vec3 pos = vec3(0.0, 0.0, 0.0);
	pos.x = -size/2.0 + uv.x * size;
	pos.z = size/2.0 - uv.y * size;

	float h = texture2D(texture, uv).r * height;
	pos.y += h;

	return pos;
}


float map(float value, float sx, float sy, float tx, float ty) {
	float p = (value - sx) / ( sy - sx);
	p = clamp(p, 0.0, 1.0);
	return tx + p * ( ty-tx );
}


void main(void) {
	vec2 uv       = aTextureCoord / numTiles + uvOffset;
	vec3 pos      = getPosition(uv);
	pos.y 		  += aVertexPosition.y;

	vec4 mvPosition = uMVMatrix * vec4(pos, 1.0);
	vec4 V        = uPMatrix * mvPosition;
	gl_Position   = V;
	

	float d       = getDepth(V.z/V.w, near, far);
	vDepth        = d;
	vTextureCoord = uv;
	vEye 		  = normalize(mvPosition.xyz);
	vVertex 	  = pos;
	vPosition 	  = pos;
}