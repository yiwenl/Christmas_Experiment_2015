precision mediump float;

varying vec3 vColor;
varying vec3 vNormal;

const float ambient_color = .65; 
const vec3 ambient = vec3(ambient_color);
const float lightWeight = .35;


varying float vOpacity;
varying float vDepth;
varying vec2 vTextureCoord;
varying vec2 vUVOffset;

uniform vec3 lightColor;
uniform vec3 lightDir;
uniform sampler2D textureFlower;

const vec3 FOG_COLOR = vec3(243.0, 230.0, 214.0)/255.0;


void main(void) {
    gl_FragColor = texture2D(textureFlower, vTextureCoord * .5 + vUVOffset);
    gl_FragColor.a *= vOpacity;
    if(gl_FragColor.a < .1) discard;

    float lambert = max(dot(vNormal, normalize(lightDir)), 0.0);

    gl_FragColor.rgb *= ambient + lightColor/255.0 * lambert * lightWeight;
    gl_FragColor.rgb = mix(gl_FragColor.rgb, FOG_COLOR, pow(vDepth, 2.0));
}