// box.vert

#define SHADER_NAME BASIC_VERTEX

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec2 aUV;
attribute vec3 aNormal;

uniform sampler2D texture;
uniform sampler2D textureNext;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float percent;
uniform float time;

varying vec2 vUV;
varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vVertex;
varying float vOpacity;
varying float vTime;


vec3 getPos(vec3 value) {
	vec3 pos;

	pos.y = value.y;
	pos.x = cos(value.z) * value.x;
	pos.z = sin(value.z) * value.x;
	return pos;
}

vec2 rotate(vec2 value, float a) {
	float c = cos(a);
	float s = sin(a);
	mat2 r = mat2(c, -s, s, c);
	return r * value;
}


const float PI = 3.141592657;

void main(void) {
	vOpacity = 1.0;
	vec3 pos           = aVertexPosition;
	vec2 uvPos         = aTextureCoord * .5;
	vec3 posOffset     =  texture2D(texture, uvPos).rgb;
	posOffset          = getPos(posOffset);
	
	vec3 posOffsetNext =  texture2D(textureNext, uvPos).rgb;
	posOffsetNext      = getPos(posOffsetNext);
	if(posOffsetNext.y < posOffset.y) vOpacity = 0.0;


	posOffset          = mix(posOffset, posOffsetNext, percent);
	float r            = atan(posOffset.z, posOffset.x);
	float rz 		   = sin(time*uvPos.x) * 0.15;
	float rotation     = aTextureCoord.x * PI * 2.0 - r;
	
	pos.xz             = rotate(pos.xz, rotation);
	pos.xy             = rotate(pos.xy, rz);
	vVertex            = vec3(pos);
	
	pos.y 			   += 250.0;
	pos                += posOffset;
	gl_Position        = uPMatrix * uMVMatrix * vec4(pos, 1.0);
	
	vTextureCoord      = aTextureCoord;
	vNormal            = aNormal;
	
	vNormal.xz         = rotate(vNormal.xz, rotation);
	vNormal.xy         = rotate(vNormal.xy, rz);
	vTime 			   = time;
	vUV 			   = aUV;
}