// line.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec2 aUVOffset;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D texture;
uniform sampler2D textureNext;
uniform sampler2D textureExtra;
uniform float percent;
uniform float time;
uniform float near;
uniform float far;
uniform float maxRadius;


varying vec2 vTextureCoord;
varying vec2 vUVOffset;
varying vec3 vColor;
varying vec3 vNormal;
varying float vOpacity;
varying float vDepth;

const vec3 AXIS_X = vec3(1.0, 0.0, 0.0);
const vec3 AXIS_Y = vec3(0.0, 1.0, 0.0);
const vec3 AXIS_Z = vec3(0.0, 0.0, 1.0);


vec4 quat_from_axis_angle(vec3 axis, float angle) { 
	vec4 qr;
	float half_angle = (angle * 0.5);
	qr.x = axis.x * sin(half_angle);
	qr.y = axis.y * sin(half_angle);
	qr.z = axis.z * sin(half_angle);
	qr.w = cos(half_angle);
	return qr;
}

vec3 rotate_vertex_position(vec3 pos, vec3 axis, float angle) { 
	vec4 q = quat_from_axis_angle(axis, angle);
	vec3 v = pos.xyz;
	return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
}

void main(void) {
	vec3 pos = aVertexPosition;
	vec2 uv = aUVOffset * .5;
	vec2 uvUVOffset = uv + vec2(.5, .0);
	vec2 uvExtra = uv + vec2(.0, .5);
	vec3 rotation = normalize(texture2D(textureExtra, uv).rgb);
	vUVOffset = texture2D(textureExtra, uvUVOffset).rg;
	vec3 extras = texture2D(textureExtra, uvExtra).rgb;
	pos *= extras.z * 7.0 + 5.0;

	float theta = time * mix(extras.g, 1.0, .5);
	vec4 temp = vec4(1.0);
	temp.rgb = rotate_vertex_position(pos, rotation, theta );

	vec3 posCurrent = texture2D(texture, uv).rgb;
	vec3 posNext = texture2D(textureNext, uv).rgb;
	if(length(posNext) - length(posCurrent) < -(maxRadius*.5)) posNext = normalize(posCurrent) * maxRadius;

	temp.xyz += mix(posCurrent, posNext, percent);
	vec3 finalPos = temp.xyz;
	temp.xyz *= .1;

	vOpacity = 1.0;
	float fadeOutRange = 100.0 + extras.z * 100.0;
	const vec3 emitCenter = vec3(0.0, 300.0, 0.0);
	// float distanceToEdge = min(distance(finalPos, emitCenter), maxRadius);
	float distanceToEdge = min(length(finalPos), maxRadius);
	if(distanceToEdge > maxRadius - fadeOutRange) {
		vOpacity = (maxRadius - distanceToEdge) / fadeOutRange;
	}

	// fadeOutRange = 150.0;
	// if(distanceToEdge<fadeOutRange) {
	// 	vOpacity = distanceToEdge / fadeOutRange;
	// }


	vec4 V = uPMatrix * (uMVMatrix * temp);;
    gl_Position = V;
    vDepth = getDepth(V.z / V.w, near, far);
    vTextureCoord = aTextureCoord;

    gl_PointSize = 1.0;
    vColor = vec3(1.0);

    vNormal = rotate_vertex_position(aNormal, rotation, theta );
}