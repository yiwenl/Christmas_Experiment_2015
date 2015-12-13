// terrain.frag

precision highp float;

uniform sampler2D textureNormal;
uniform sampler2D textureNoise;
uniform sampler2D textureEnv;
uniform vec3 lightColor;
uniform vec3 lightDir;
uniform float bumpOffset;
uniform float albedo;
uniform float roughness;
uniform float ambient;
uniform float shininess;
uniform float gamma;
uniform mat3 normalMatrix;
uniform vec3 cameraPos;

varying vec2 vTextureCoord;
varying float vDepth;
varying vec3 vEye;
varying vec3 vVertex;

const vec3 FOG_COLOR = vec3(243.0, 230.0, 214.0)/255.0;


const float PI = 3.151592657;
const float TwoPI = PI * 2.0;

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

vec2 envMapEquirect(vec3 wcNormal, float flipEnvMap) {
  //I assume envMap texture has been flipped the WebGL way (pixel 0,0 is a the bottom)
  //therefore we flip wcNorma.y as acos(1) = 0
  float phi = acos(-wcNormal.y);
  float theta = atan(flipEnvMap * wcNormal.x, wcNormal.z) + PI;
  return vec2(theta / TwoPI, phi / PI);
}

vec2 envMapEquirect(vec3 wcNormal) {
    //-1.0 for left handed coordinate system oriented texture (usual case)
    return envMapEquirect(wcNormal, -1.0);
}



void main(void) {
	// gl_FragColor = vec4(FLOOR_COLOR, 1.0);

	//	GET NORMAL
	vec3 N       = texture2D(textureNormal, vTextureCoord).rgb;
	N            += (texture2D(textureNoise, vTextureCoord*25.0).rgb - vec3(.5))* bumpOffset;
	N            = normalize(N);

	//	GET LIGHT
	vec3 L = normalize(lightDir);


	//	DIFFUSE
	float diffuse = orenNayarDiffuse(L, vEye, N, roughness, albedo);

	//	SPECULAR
	float specular = gaussianSpecular(L, vEye, N, shininess) * .25;

	//	ENV LIGHT
	vec2 uvEnv = envMapEquirect(N);
	vec3 colorEnv = texture2D(textureEnv, uvEnv).rgb;


	gl_FragColor = vec4(ambient + lightColor/255.0 * (diffuse + specular), 1.0);
	gl_FragColor.rgb += colorEnv*.5;
	gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0 / gamma));
	float d = pow(vDepth+.15, 4.0);
	gl_FragColor.rgb = mix(gl_FragColor.rgb, FOG_COLOR, d);

	float r = length(vVertex);
	r = 1.0-smoothstep(1400.0, 1500.0, r);
	gl_FragColor.a *= r;
	// gl_FragColor.rgb = vec3();
}