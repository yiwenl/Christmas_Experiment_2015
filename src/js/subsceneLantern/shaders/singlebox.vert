// singlebox.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform	vec3 position;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vVertex;

vec2 rotate(vec2 value, float a) {
	float c = cos(a);
	float s = sin(a);
	mat2 r = mat2(c, -s, s, c);
	return r * value;
}

void main(void) {
	vec3 pos = aVertexPosition;
	float r = -.15;
	pos.xz = rotate(pos.xz, r);

	vVertex = vec3(pos);

	pos +=  position;
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;

    vNormal = aNormal;
    vNormal.xz = rotate(vNormal.xz, r);
}