#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform sampler2D textureBlur;
uniform float bloom;

void main(void) {
    vec4 colorOrg = texture2D(texture, vTextureCoord);
    vec4 colorBlur = texture2D(textureBlur, vTextureCoord);
    vec4 color = colorOrg;
    color.rgb += colorBlur.rgb * bloom;
    gl_FragColor = color;
}