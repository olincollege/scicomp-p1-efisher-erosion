const fragmentShader = `
in float d;

uniform float amplitude;

vec3 colorA = vec3(0.149,0.141,0.912);
vec3 colorB = vec3(1.000,0.833,0.224);

void main() {
  float perc = (d + amplitude) / (amplitude * 2.0);
  vec3 color = mix(colorA, colorB, perc);
  gl_FragColor = vec4(color, 1.0);
}
`;

export { fragmentShader };
