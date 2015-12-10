// bg.frag
#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform sampler2D textureNext;
uniform float bgOffset;

void main(void) {
    vec4 bg0 = texture2D(texture, vTextureCoord);
    vec4 bg1 = texture2D(textureNext, vTextureCoord);

    gl_FragColor = mix(bg0, bg1, bgOffset);
}