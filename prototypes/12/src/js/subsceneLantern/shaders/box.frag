// box.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vVertex;
varying float vOpacity;
varying float vTime;
varying vec2 vUV;

uniform float gamma;
uniform sampler2D textureMap;
uniform sampler2D textureNormal;
uniform sampler2D textureEnv;
// const float gamma = 2.2;
const float PI = 3.141592657;
const float TwoPI = PI * 2.0;

float diffuse(vec3 lightPos, vec3 normal) {
	float d = max(dot(normal, normalize(lightPos)), 0.0);
	return d;
}


vec3 diffuse(vec3 lightPos, vec3 lightColor, vec3 normal) {
	return diffuse(lightPos, normal) * lightColor;
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

const vec3 LIGHT = vec3(1.0, 10.0, 10.0);

void main(void) {
	if(vOpacity < .01) discard;
	vec3 light = vec3(0.0, -10.0+vTextureCoord.y * 5.0, 0);
	vec3 normalOffset = texture2D(textureNormal, vUV).rgb * 2.0 - 1.0;
	vec3 N = normalize(vNormal + normalOffset * .5);

	float diff = diffuse(light - vVertex, -N);

	float g = distance(vVertex, light);
	float radius = 10.0 + 10.0 * vTextureCoord.x;

	
	g /= radius;
	g = smoothstep(0.0, 1.0, 1.0-g);
	float t = sin(vTime*mix(vTextureCoord.y, 1.0, .5)) * .5 + .5;
	float t1 = cos(vTime*.5*mix(vTextureCoord.x, 1.0, .5)) * .5 + .5;
	t *= t1;
	t = mix(1.0, t, .8) ;

	vec2 uv = vTextureCoord;
	uv.x = mod(uv.x + vTime*.25*vTextureCoord.y, 1.0);

	vec3 color = texture2D(textureMap, uv).rgb;
	color *= g*t+diff;
	color *= 1.5;
	color *= color;

	vec2 uvEnv = envMapEquirect(N);
	vec3 colorEnv = texture2D(textureEnv, uvEnv).rgb;
	color = pow(color, vec3(1.0 / gamma));
	color += colorEnv * .5;
    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(colorEnv, 1.0);
    // gl_FragColor = vec4(N * .5 + .5, 1.0);
    // gl_FragColor = texture2D(textureNormal, vUV);
}