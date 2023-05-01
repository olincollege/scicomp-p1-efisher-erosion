const fragmentShader = `
in vec4 bump;
in vec3 pos;

uniform float amplitude;
uniform float floor;

const vec3 lightDirection = vec3(-0.5, -0.5, 1.0);

const vec3 mountainColor = vec3(0.35, 0.22, 0.22);
const vec3 grassColor = vec3(0.3, 0.65, 0.0);

float random(vec2 st) {
    return fract(
      sin(
        dot(
          st.xy,
          vec2(12.9898,78.233)
        )
      ) * 43758.5453123
    );
}

void main() {
  float trueMin = max(floor, -amplitude);
  float perc = (bump.a - trueMin) / (amplitude - trueMin);

  vec3 up = vec3(0.0, 0.0, 1.0);
  float slope = abs(dot(up, bump.xyz));

  vec3 color;
  if (slope > 0.8) {
    color = grassColor;
  } else if (slope > 0.75) {
    float perc = (slope - 0.75) / 0.05;
    color = mix(mountainColor, grassColor, min(perc, 1.0));
  } else {
    color = mountainColor;
  }

  float diffusion = dot(bump.xyz, lightDirection);
  color *= max(diffusion, 0.0);

  gl_FragColor = vec4(color, 1.0);
}
`;

export { fragmentShader };
