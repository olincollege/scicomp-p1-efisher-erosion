const fragmentShader = `
in float d;

uniform float amplitude;

vec3 colorA = vec3(0.1,0.5,0.1);
vec3 colorB = vec3(1.0, 1.0, 1.0);

void main() {
  float perc = (d + amplitude) / (amplitude * 2.0);
  vec3 color = mix(colorA, colorB, perc);
  gl_FragColor = vec4(color, 1.0);
}
`;

export { fragmentShader };
