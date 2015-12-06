// sky.frag

precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D texture;
varying float vDepth;

const vec3 FOG_COLOR = vec3(243.0, 230.0, 214.0)/255.0;

void main(void) {
	vec4 color = texture2D(texture, vTextureCoord);
	color.rgb = mix(color.rgb, FOG_COLOR, vDepth);
	gl_FragColor = color;
}