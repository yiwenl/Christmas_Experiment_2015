// bloom.frag
#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform sampler2D textureBlur;
uniform float threshold;

void main(void) {
	vec4 color       = texture2D(texture, vTextureCoord);
	vec4 colorBlur   = texture2D(textureBlur, vTextureCoord);
	
	float brightness = length(color.rgb) / length(vec3(1.0));
	float offset     = smoothstep(threshold, 1.0, brightness);
	gl_FragColor     = color;
	gl_FragColor.rgb += colorBlur.rgb * offset;
}