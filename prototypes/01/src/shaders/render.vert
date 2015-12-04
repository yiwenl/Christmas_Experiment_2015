// line.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec3 aExtra;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float time;
uniform float percent;
uniform sampler2D texture;
uniform sampler2D textureNext;
varying vec2 vTextureCoord;
varying float vOpacity;

vec3 getPos(vec3 value) {
	vec3 pos;

	pos.y = value.y;
	pos.x = cos(value.z) * value.x;
	pos.z = sin(value.z) * value.x;
	return pos;
}

void main(void) {
	float toDiscard = 1.0;
	vec3 pos = getPos(aVertexPosition);
	vec2 uv = aTextureCoord * .5;
	pos = texture2D(texture, uv).rgb;
	pos = getPos(pos);
	vec3 posNext = texture2D(textureNext, uv).rgb;
	posNext = getPos(posNext);
	if(posNext.y < 0.0 && pos.y > 0.0) {
		toDiscard = 0.0;
	}

	pos = mix(pos, posNext, percent);

	pos.y += 25.0;
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
    vTextureCoord = aExtra.xy;

    gl_PointSize = aExtra.z;

    float c = sin(time * mix(aExtra.x, 1.0, .5));
    vOpacity = smoothstep(.5, 1.0, c) * toDiscard;
}