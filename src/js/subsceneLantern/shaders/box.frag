// box.frag

#define SHADER_NAME BOXES_FRAG

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vVertex;
varying float vOpacity;
varying float vDepth;
varying float vTime;
varying vec2 vUV;
varying float vRotation;

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
  float phi = acos(-wcNormal.y);
  float theta = atan(flipEnvMap * wcNormal.x, wcNormal.z) + PI;
  return vec2(theta / TwoPI, phi / PI);
}

vec2 envMapEquirect(vec3 wcNormal) {
    return envMapEquirect(wcNormal, -1.0);
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


const vec3 LIGHT = vec3(1.0, 10.0, 10.0);
const vec3 FOG_COLOR = vec3(243.0, 230.0, 214.0)/255.0;

void main(void) {
	if(vOpacity < .01) discard;
	vec3 light        = vec3(0.0, -10.0+vTextureCoord.y * 5.0, 0.0);
	light.xy          = rotate(light.xy, vRotation);
	vec3 normalOffset = texture2D(textureNormal, vUV).rgb * 2.0 - 1.0;
	vec3 N            = normalize(vNormal + normalOffset * .85);
	
	float diff        = diffuse(light - vVertex, -N);
	
	float g           = distance(vVertex, light);
	float radius      = 20.0 + 15.0 * vTextureCoord.x;
	
	
	g                 /= radius;
	g                 = smoothstep(0.0, 1.0, 1.0-g);
	float t           = sin(vTime*mix(vTextureCoord.y, 1.0, .5)) * .5 + .5;
	float t1          = cos(vTime*.5*mix(vTextureCoord.x, 1.0, .5)) * .5 + .5;
	t                 *= t1;
	t                 = mix(1.0, t, .8) ;
	
	vec2 uv           = vTextureCoord;
	uv.x              = mod(uv.x + vTime*.25*vTextureCoord.y, 1.0);
	
	vec3 color        = texture2D(textureMap, uv).rgb;
	color             *= g*t+diff;
	color             *= 1.2;
	color             *= color;
	
	vec2 uvEnv        = envMapEquirect(N);
	vec3 colorEnv     = texture2D(textureEnv, uvEnv).rgb;
	float d           = vDepth;
	d                 = clamp(pow(d+.35, 3.0), 0.0, 1.0);
	
	color             += colorEnv * .75;
	color             = pow(color, vec3(1.0 / gamma));
    gl_FragColor = vec4(color, pow(vOpacity, 2.0));

    
    // gl_FragColor.rgb = vec3(d);
}