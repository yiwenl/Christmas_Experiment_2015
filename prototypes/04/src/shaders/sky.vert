// sky.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float near;
uniform float far;

varying float vDepth;
varying vec2 vTextureCoord;
uniform vec3 cameraPos;

float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}

void main(void) {
	vec3 pos      = aVertexPosition;
	vec4 V        = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
	gl_Position   = V;
	
	float d    	  = getDepth(V.z/V.w, near, far);
	vDepth        = d;
	vTextureCoord = aTextureCoord;
}