// terrain.frag

precision highp float;

uniform sampler2D textureNormal;
uniform sampler2D textureNoise;
uniform vec3 lightColor;
uniform vec3 lightDir;
uniform float bumpOffset;
uniform float albedo;
uniform float roughness;
uniform float ambient;
uniform float shininess;
uniform mat3 normalMatrix;
uniform vec3 cameraPos;

varying vec2 vTextureCoord;
varying float vDepth;
varying vec3 vEye;
varying vec3 vVertex;

const vec3 FOG_COLOR = vec3(243.0, 230.0, 214.0)/255.0;
const vec3 FLOOR_COLOR = vec3(230.0, 227.0, 222.0)/255.0;


const float PI = 3.151592657;


float orenNayarDiffuse(vec3 lightDirection,	vec3 viewDirection,	vec3 surfaceNormal, float roughness, float albedo) {

	float LdotV = dot(lightDirection, viewDirection);
	float NdotL = dot(lightDirection, surfaceNormal);
	float NdotV = dot(surfaceNormal, viewDirection);

	float s = LdotV - NdotL * NdotV;
	float t = mix(1.0, max(NdotL, NdotV), step(0.0, s));

	float sigma2 = roughness * roughness;
	float A = 1.0 + sigma2 * (albedo / (sigma2 + 0.13) + 0.5 / (sigma2 + 0.33));
	float B = 0.45 * sigma2 / (sigma2 + 0.09);

	return albedo * max(0.0, NdotL) * (A + B * s / t) / PI;

}


float gaussianSpecular(vec3 lightDirection, vec3 viewDirection, vec3 surfaceNormal, float shininess) {

	vec3 H = normalize(lightDirection + viewDirection);
	float theta = acos(dot(H, surfaceNormal));
	float w = theta / shininess;
	return exp(-w*w);

}


void main(void) {
	gl_FragColor = vec4(FLOOR_COLOR, 1.0);

	//	GET NORMAL
	vec3 N       = texture2D(textureNormal, vTextureCoord).rgb;
	N            += (texture2D(textureNoise, vTextureCoord*5.0).rgb - vec3(.5))* bumpOffset;
	N            = normalize(N);

	//	GET LIGHT
	vec3 L = normalize(lightDir);


	//	DIFFUSE
	float diffuse = orenNayarDiffuse(L, vEye, N, roughness, albedo);

	//	SPECULAR
	float specular = gaussianSpecular(L, vEye, N, shininess) * .25;


	gl_FragColor.rgb *= ambient + lightColor/255.0 * (diffuse + specular);
	gl_FragColor.rgb = mix(gl_FragColor.rgb, FOG_COLOR, vDepth);


	float maxRange = 1100.0;
	float range = 300.0;
	float d = length(vVertex);
	float a = smoothstep(maxRange-range, maxRange, d);
	gl_FragColor *= (1.0 - a);
	// gl_FragColor.rgb = vec3(vDepth);
}