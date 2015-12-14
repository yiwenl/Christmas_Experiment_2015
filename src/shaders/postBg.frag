// postBg.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;

void main(void) {
    gl_FragColor = texture2D(texture, vTextureCoord);
    // gl_FragColor.rgb *= .75;
    gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.25));
}