// blur.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform vec2 resolution;
uniform vec2 direction;
uniform sampler2D texture;


vec4 blur13(sampler2D image, vec2 uv, vec2 res, vec2 dir) {
	vec4 color = vec4(0.0);
	vec2 off1 = vec2(1.411764705882353) * dir;
	vec2 off2 = vec2(3.2941176470588234) * dir;
	vec2 off3 = vec2(5.176470588235294) * dir;
	color += texture2D(image, uv) * 0.1964825501511404;
	color += texture2D(image, uv + (off1 / res)) * 0.2969069646728344;
	color += texture2D(image, uv - (off1 / res)) * 0.2969069646728344;
	color += texture2D(image, uv + (off2 / res)) * 0.09447039785044732;
	color += texture2D(image, uv - (off2 / res)) * 0.09447039785044732;
	color += texture2D(image, uv + (off3 / res)) * 0.010381362401148057;
	color += texture2D(image, uv - (off3 / res)) * 0.010381362401148057;
	return color;
}

void main(void) {

	vec4 texel = blur13(texture, vTextureCoord, resolution, direction);
    gl_FragColor = texel;
}