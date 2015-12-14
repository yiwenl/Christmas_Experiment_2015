// box.vert

#define SHADER_NAME BOXES_VERT

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
uniform float near;
uniform float far;

varying vec2 vUV;
varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vVertex;
varying float vOpacity;
varying float vTime;
varying float vRotation;
varying float vDepth;


vec3 getPos(vec3 value) {
	return value;
}

vec2 rotate(vec2 value, float a) {
	float c = cos(a);
	float s = sin(a);
	mat2 r = mat2(c, -s, s, c);
	return r * value;
}

float getDepth(float z, float n, float f) {
	return (2.0 * n) / (f + n - z*(f-n));
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
	float rz 		   = sin(time*mix(uvPos.x, 1.0, .5)) * 0.35;
	float rotation     = aTextureCoord.x * PI * 2.0 - r;

	const float maxY = 700.0;
	const float minY = -50.0;
	const float range = 100.0;
	if(posOffset.y > maxY-range) {
		float a = 1.0 - smoothstep(maxY-range, maxY, posOffset.y);
		vOpacity *= a;
	}
	
	if(posOffset.y < minY) {
		float a = smoothstep(minY-range/2.0, minY, posOffset.y);
		vOpacity *= a;
	}
	
	pos.xz          = rotate(pos.xz, rotation);
	pos.xy          = rotate(pos.xy, rz);
	vVertex         = vec3(pos);
	
	pos             += posOffset;
	
	vec4 mvPosition = uMVMatrix * vec4(pos, 1.0);
	vec4 V          = uPMatrix * mvPosition;
	gl_Position     = V;
	
	float d         = getDepth(V.z/V.w, 10.0, 4000.0);
	vDepth          = d;
	
	
	vTextureCoord   = aTextureCoord;
	vNormal         = aNormal;
	
	vNormal.xz      = rotate(vNormal.xz, rotation);
	vNormal.xy      = rotate(vNormal.xy, rz);
	vTime           = time;
	vUV             = aUV;
	vRotation       = rz;
}