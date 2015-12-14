// sim1.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform float time;
uniform float speed;
uniform float skipCount;

const float PI = 3.141592657;

vec4 permute(vec4 x) { return mod(((x*34.00)+1.00)*x, 289.00); }
vec4 taylorInvSqrt(vec4 r) { return 1.79 - 0.85 * r; }

float snoise(vec3 v){
	const vec2 C = vec2(1.00/6.00, 1.00/3.00) ;
	const vec4 D = vec4(0.00, 0.50, 1.00, 2.00);
	
	vec3 i = floor(v + dot(v, C.yyy) );
	vec3 x0 = v - i + dot(i, C.xxx) ;
	
	vec3 g = step(x0.yzx, x0.xyz);
	vec3 l = 1.00 - g;
	vec3 i1 = min( g.xyz, l.zxy );
	vec3 i2 = max( g.xyz, l.zxy );
	
	vec3 x1 = x0 - i1 + 1.00 * C.xxx;
	vec3 x2 = x0 - i2 + 2.00 * C.xxx;
	vec3 x3 = x0 - 1. + 3.00 * C.xxx;
	
	i = mod(i, 289.00 );
	vec4 p = permute( permute( permute( i.z + vec4(0.00, i1.z, i2.z, 1.00 )) + i.y + vec4(0.00, i1.y, i2.y, 1.00 )) + i.x + vec4(0.00, i1.x, i2.x, 1.00 ));
	
	float n_ = 1.00/7.00;
	vec3 ns = n_ * D.wyz - D.xzx;
	
	vec4 j = p - 49.00 * floor(p * ns.z *ns.z);
	
	vec4 x_ = floor(j * ns.z);
	vec4 y_ = floor(j - 7.00 * x_ );
	
	vec4 x = x_ *ns.x + ns.yyyy;
	vec4 y = y_ *ns.x + ns.yyyy;
	vec4 h = 1.00 - abs(x) - abs(y);
	
	vec4 b0 = vec4( x.xy, y.xy );
	vec4 b1 = vec4( x.zw, y.zw );
	
	vec4 s0 = floor(b0)*2.00 + 1.00;
	vec4 s1 = floor(b1)*2.00 + 1.00;
	vec4 sh = -step(h, vec4(0.00));
	
	vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
	vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
	
	vec3 p0 = vec3(a0.xy,h.x);
	vec3 p1 = vec3(a0.zw,h.y);
	vec3 p2 = vec3(a1.xy,h.z);
	vec3 p3 = vec3(a1.zw,h.w);
	
	vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
	p0 *= norm.x;
	p1 *= norm.y;
	p2 *= norm.z;
	p3 *= norm.w;
	
	vec4 m = max(0.60 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.00);
	m = m * m;
	return 42.00 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

float snoise(float x, float y, float z){
	return snoise(vec3(x, y, z));
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}


const float maxHeight = 1000.0;

void main(void) {
	if(vTextureCoord.y < .5) {
		if(vTextureCoord.x < .5) {
			vec2 uvVel = vTextureCoord + vec2(.5, .0);
			vec3 pos = texture2D(texture, vTextureCoord).xyz;
			vec3 vel = texture2D(texture, uvVel).xyz;
			pos += vel;
			if(pos.y > maxHeight) {
				// pos.y = -rand(vec2(time,vTextureCoord.x+vTextureCoord.y)) * 100.0;
				pos.y = -100.0;
				// const float radius = 400.0;

				float radius = 200.0 * rand(vTextureCoord*time);
				float theta = rand(vTextureCoord.yx*time) * PI * 2.0;

				pos.x = cos(theta) * radius;
				pos.z = sin(theta) * radius;
			}
			gl_FragColor = vec4(pos, 1.0);
		} else {
			vec2 uvPos   = vTextureCoord + vec2(-.5, .0);
			vec2 uvExtra = vTextureCoord + vec2(0.0, 0.5);
			vec3 pos     = texture2D(texture, uvPos).xyz;
			vec3 vel     = texture2D(texture, vTextureCoord).xyz;
			vec3 extra   = texture2D(texture, uvExtra).xyz;

			float posOffset = .002 + mix(extra.x, 1.0, .75) * .002;
			float decreaseRate = .95;
			float speed = .1;

			float ax = snoise(pos.xyz * posOffset + time) * speed;
			float ay = (snoise(pos.yzx * posOffset + time)*.5+.5) * speed;
			float az = snoise(pos.zxy * posOffset + time) * speed;

			vel += vec3(ax, ay, az) * skipCount;
			vel *= decreaseRate;

			gl_FragColor = vec4(vel, 1.0);
		}
	} else {
		gl_FragColor = texture2D(texture, vTextureCoord);
	}
    // gl_FragColor = texture2D(texture, vTextureCoord);
}