// HBlur.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float blur;

varying vec2 vTextureCoord;
varying vec2 v_blurTexCoords[14];

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;

    v_blurTexCoords[ 0] = vTextureCoord + vec2(-0.028, 0.0) * blur;
    v_blurTexCoords[ 1] = vTextureCoord + vec2(-0.024, 0.0) * blur;
    v_blurTexCoords[ 2] = vTextureCoord + vec2(-0.020, 0.0) * blur;
    v_blurTexCoords[ 3] = vTextureCoord + vec2(-0.016, 0.0) * blur;
    v_blurTexCoords[ 4] = vTextureCoord + vec2(-0.012, 0.0) * blur;
    v_blurTexCoords[ 5] = vTextureCoord + vec2(-0.008, 0.0) * blur;
    v_blurTexCoords[ 6] = vTextureCoord + vec2(-0.004, 0.0) * blur;
    v_blurTexCoords[ 7] = vTextureCoord + vec2( 0.004, 0.0) * blur;
    v_blurTexCoords[ 8] = vTextureCoord + vec2( 0.008, 0.0) * blur;
    v_blurTexCoords[ 9] = vTextureCoord + vec2( 0.012, 0.0) * blur;
    v_blurTexCoords[10] = vTextureCoord + vec2( 0.016, 0.0) * blur;
    v_blurTexCoords[11] = vTextureCoord + vec2( 0.020, 0.0) * blur;
    v_blurTexCoords[12] = vTextureCoord + vec2( 0.024, 0.0) * blur;
    v_blurTexCoords[13] = vTextureCoord + vec2( 0.028, 0.0) * blur;
}