// fxaa.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;

varying vec2 vTextureCoord;
varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

uniform sampler2D texture;
uniform vec2 resolution;


float FXAA_SUBPIX_SHIFT = 1.0/4.0;
#define FXAA_REDUCE_MIN   (1.0/ 128.0)
#define FXAA_REDUCE_MUL   (1.0 / 8.0)
#define FXAA_SPAN_MAX     8.0



vec4 applyFXAA(vec2 fragCoord, sampler2D tex) {
    float rtWidth = resolution.x;
    float rtHeight = resolution.y;
    vec4 color;
    vec2 inverseVP = vec2(1.0 / rtWidth, 1.0 / rtHeight);
    vec3 rgbNW = texture2D(tex, (fragCoord + vec2(-1.0, -1.0)) * inverseVP).xyz;
    vec3 rgbNE = texture2D(tex, (fragCoord + vec2(1.0, -1.0)) * inverseVP).xyz;
    vec3 rgbSW = texture2D(tex, (fragCoord + vec2(-1.0, 1.0)) * inverseVP).xyz;
    vec3 rgbSE = texture2D(tex, (fragCoord + vec2(1.0, 1.0)) * inverseVP).xyz;
    vec4 colorPixel  = texture2D(tex, fragCoord  * inverseVP);
    vec3 rgbM  = colorPixel.xyz;
    vec3 luma = vec3(0.299, 0.587, 0.114);
    float lumaNW = dot(rgbNW, luma);
    float lumaNE = dot(rgbNE, luma);
    float lumaSW = dot(rgbSW, luma);
    float lumaSE = dot(rgbSE, luma);
    float lumaM  = dot(rgbM,  luma);
    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

    //return texture2D(tex, fragCoord);
    // return vec4(fragCoord, 0.0, 1.0);
    // return vec4(rgbM, 1.0);

    vec2 dir;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));

    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *
                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);

    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),
              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
              dir * rcpDirMin)) * inverseVP;

    // vec3 rgbA = 0.5 * (
    //     texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +
    //     texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);
    // vec3 rgbB = rgbA * 0.5 + 0.25 * (
    //     texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +
    //     texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);

    vec4 rgbaA = 0.5 * (
        texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)) +
        texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)));

    vec4 rgbaB = rgbaA * 0.5 + 0.25 * (
        texture2D(tex, fragCoord * inverseVP + dir * -0.5) +
        texture2D(tex, fragCoord * inverseVP + dir * 0.5));

    float lumaB = dot(rgbaB.xyz, luma);
    if ((lumaB < lumaMin) || (lumaB > lumaMax))
        color = rgbaA;
    else
        color = rgbaB;

    return color;
}




void main(void) {
    vec2 fragCoord = vTextureCoord * resolution; 

    gl_FragColor = applyFXAA(fragCoord, texture);
}