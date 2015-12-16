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

vec4 permute(vec4 x) { return mod(((x*34.00)+1.00)*x, 289.00); }
vec4 taylorInvSqrt(vec4 r) { return 1.79 - 0.85 * r; }

float snoise(vec3 v){
	const vec2 C = vec2(1.00/6.00, 1.00/3.00) ;
	const vec4 D = vec4(0.00, 0.50, 1.00, 2.00);
	
	vec3 i = floor(v + dot(v, C.yyy) );
	vec3 x0 = v - i + dot(i, C.xxx) ;
	
	vec3 g = step(x0.yzx, x0.xyz);
	vec3 l = 1.00 - g;
	vec3 i1 = min( g.xyz, l.zxy );
	vec3 i2 = max( g.xyz, l.zxy );
	
	vec3 x1 = x0 - i1 + 1.00 * C.xxx;
	vec3 x2 = x0 - i2 + 2.00 * C.xxx;
	vec3 x3 = x0 - 1. + 3.00 * C.xxx;
	
	i = mod(i, 289.00 );
	vec4 p = permute( permute( permute( i.z + vec4(0.00, i1.z, i2.z, 1.00 )) + i.y + vec4(0.00, i1.y, i2.y, 1.00 )) + i.x + vec4(0.00, i1.x, i2.x, 1.00 ));
	
	float n_ = 1.00/7.00;
	vec3 ns = n_ * D.wyz - D.xzx;
	
	vec4 j = p - 49.00 * floor(p * ns.z *ns.z);
	
	vec4 x_ = floor(j * ns.z);
	vec4 y_ = floor(j - 7.00 * x_ );
	
	vec4 x = x_ *ns.x + ns.yyyy;
	vec4 y = y_ *ns.x + ns.yyyy;
	vec4 h = 1.00 - abs(x) - abs(y);
	
	vec4 b0 = vec4( x.xy, y.xy );
	vec4 b1 = vec4( x.zw, y.zw );
	
	vec4 s0 = floor(b0)*2.00 + 1.00;
	vec4 s1 = floor(b1)*2.00 + 1.00;
	vec4 sh = -step(h, vec4(0.00));
	
	vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
	vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
	
	vec3 p0 = vec3(a0.xy,h.x);
	vec3 p1 = vec3(a0.zw,h.y);
	vec3 p2 = vec3(a1.xy,h.z);
	vec3 p3 = vec3(a1.zw,h.w);
	
	vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
	p0 *= norm.x;
	p1 *= norm.y;
	p2 *= norm.z;
	p3 *= norm.w;
	
	vec4 m = max(0.60 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.00);
	m = m * m;
	return 42.00 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

float snoise(float x, float y, float z){
	return snoise(vec3(x, y, z));
}

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


float saturate(float value) {
	return clamp(value, 0.0, 1.0);
}

float sparkle(vec3 viewVec, vec3 normal, vec3 lightDir, vec3 pos) {
	float specBase = saturate(dot(reflect(-normalize(viewVec), normal), lightDir));
	// Perturb a grid pattern with some noise and with the view-vector
	// to let the glittering change with view.
	vec3 fp = fract(0.7 * pos + 19.0 * snoise( pos * 0.1) + 0.91 * viewVec);
	fp *= (1.0 - fp);
	float glitter = saturate(1.0 - 7.0 * (fp.x + fp.y + fp.z));
	return glitter;
}

float _diffuse(vec3 pos, vec3 normal, vec3 light, float radius) {
	vec3 L = normalize(light - pos);
	vec3 N = normalize(normal);
	float lambert = max(dot(N, L), 0.0);
	float dist = distance(pos, light);
	dist = smoothstep(0.0, radius, dist);
	return lambert * (1.0 - dist);
}

const vec3 center_light_color = vec3(199.0, 150.0, 73.0)/255.0;

void main(void) {
	// gl_FragColor = vec4(1.0);

	//	GET NORMAL
	vec3 N       = texture2D(textureNormal, vTextureCoord).rgb;
	N            += (texture2D(textureNoise, vTextureCoord*25.0).rgb - vec3(.5))* bumpOffset;
	N            = normalize(N);

	//	GET LIGHT
	vec3 L = normalize(lightDir);


	//	DIFFUSE
	float diffuse = orenNayarDiffuse(L, vEye, N, roughness, albedo);
	// float diffuse = _diffuse(vVertex, N, lightDir, 10000.0);
	// float diffuseCenter = _diffuse(vVertex, N, vec3(0.0, 200.0, 0.0), 1000.0);

	//	SPECULAR
	float specular = gaussianSpecular(L, vEye, N, shininess);

	//	ENV LIGHT
	vec2 uvEnv = envMapEquirect(N);
	vec3 colorEnv = texture2D(textureEnv, uvEnv).rgb;


	gl_FragColor = vec4(ambient + lightColor/255.0 * (diffuse + specular), 1.0);
	gl_FragColor.rgb += colorEnv;
	gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0 / gamma));
	float d = pow(vDepth+.15, 4.0);
	gl_FragColor.rgb = mix(gl_FragColor.rgb, FOG_COLOR, d);
	float _sparkle = sparkle(vEye, N, normalize(lightDir), vVertex);
	gl_FragColor.rgb += _sparkle;

	float r = length(vVertex);
	float ar = 1.0-smoothstep(1400.0, 1500.0, r);
	gl_FragColor.a *= ar;
	// gl_FragColor.rgb = N * .5 + .5;
}