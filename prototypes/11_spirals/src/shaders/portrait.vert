// portrait.vert
#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec3 position;
uniform float rotation;

varying vec2 vTextureCoord;


vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, s, -s, c);
	return m * v;
}

void main(void) {
	vec3 pos = aVertexPosition;
	pos += position;
	pos.xz = rotate(pos.xz, rotation);
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
}