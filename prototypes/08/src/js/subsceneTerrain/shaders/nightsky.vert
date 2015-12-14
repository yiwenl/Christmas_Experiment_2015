// nightsky.vert

#define SHADER_NAME VERTEX_NIGHTSKY

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec3 axis;
uniform float angle;
uniform float near;
uniform float far;

varying vec2 vTextureCoord;
varying float vDepth;

float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}

vec4 quat_from_axis_angle(vec3 axis, float angle) { 
	vec4 qr;
	float half_angle = (angle * 0.5) * 3.14159 / 180.0;
	qr.x = axis.x * sin(half_angle);
	qr.y = axis.y * sin(half_angle);
	qr.z = axis.z * sin(half_angle);
	qr.w = cos(half_angle);
	return qr;
}

vec3 rotate_vertex_position(vec3 position, vec3 axis, float angle) { 
	vec4 q = quat_from_axis_angle(axis, angle);
	vec3 v = position.xyz;
	return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

void main(void) {
	vec3 pos = rotate_vertex_position(aVertexPosition, axis, angle);
	vec4 V = uPMatrix * (uMVMatrix * vec4(pos, 1.0));
    gl_Position = V;
    vTextureCoord = aTextureCoord;

    float d       = getDepth(V.z/V.w, near, far);
	vDepth        = d;
}