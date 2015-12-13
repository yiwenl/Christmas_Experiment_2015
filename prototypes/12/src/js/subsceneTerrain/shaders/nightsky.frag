// nightsky.frag

precision mediump float;

uniform sampler2D texture;
varying vec2 vTextureCoord;
varying float vDepth;

const vec3 FOG_COLOR = vec3(243.0, 230.0, 214.0)/255.0;

void main(void) {
	vec4 color = texture2D(texture, vTextureCoord);

    gl_FragColor = color;
    // float d = pow(vDepth+.15, 4.0);
    // gl_FragColor.rgb = mix(gl_FragColor.rgb, FOG_COLOR, d);
}