// box.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vVertex;
varying float vOpacity;
varying float vTime;

uniform float gamma;
uniform sampler2D textureMap;
// const float gamma = 2.2;
const float PI = 3.141592657;


float diffuse(vec3 lightPos) {
	float d = max(dot(vNormal, normalize(lightPos)), 0.0);
	// float d = dot(vNormal, normalize(lightPos)) * .5 + .5;
	return d;
}


vec3 diffuse(vec3 lightPos, vec3 lightColor) {
	return diffuse(lightPos) * lightColor;
}

const vec3 LIGHT = vec3(1.0, 10.0, 10.0);

void main(void) {
	if(vOpacity < .01) discard;
	vec3 light = vec3(0.0, -10.0+vTextureCoord.y * 5.0, 0);
	float g = distance(vVertex, light);
	float radius = 10.0 + 10.0 * vTextureCoord.x;
	// radius *= mix(vTextureCoord.x, 1.0, .5);
	g /= radius;
	g = smoothstep(0.0, 1.0, 1.0-g);
	float t = sin(vTime*mix(vTextureCoord.y, 1.0, .5)) * .5 + .5;
	float t1 = cos(vTime*.5*mix(vTextureCoord.x, 1.0, .5)) * .5 + .5;
	t *= t1;
	t = mix(1.0, t, .8) ;

	vec2 uv = vTextureCoord;
	uv.x = mod(uv.x + vTime*.25*vTextureCoord.y, 1.0);

	vec3 color = texture2D(textureMap, uv).rgb;
	color *= g*t;
	color += .05;
	color *= 1.75;
	color *= color;

	color = pow(color, vec3(1.0 / gamma));
    gl_FragColor = vec4(color, 1.0);
}