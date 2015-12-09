// glass.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform	float rotation;
uniform float z;

varying vec2 vTextureCoord;

vec2 rotate(vec2 value, float r) {
	float s = sin(r);
	float c = cos(r);
	mat2 m = mat2(c, s, -s, c);
	return m*value;
}


void main(void) {
	vec3 pos = aVertexPosition;
	pos.z = z;
	pos.xz = rotate(pos.xz, rotation);
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
}