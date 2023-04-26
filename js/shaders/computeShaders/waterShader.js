import ComputeShader from "./shader";

const shader = `
uniform float evaporation;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float oldValue = texture2D(lastFrame, uv).x;
  float newValue = oldValue * (1.0 - evaporation);
  gl_FragColor = vec4(newValue, 0.0, 0.0, 1.0);
}
`;

class WaterShader extends ComputeShader {
  initUniforms(uniforms, params, shaders) {
    uniforms["evaporation"] = { value: null };
  }

  setUniforms(uniforms, params, shaders) {}

  shader() {
    return shader;
  }

  fill(texture, params) {
    const arr = texture.image.data;
    for (let k = 0; k < arr.length; k += 4) {
      arr[k + 0] = 1.0;
      arr[k + 1] = 0.0;
      arr[k + 2] = 0.0;
      arr[k + 3] = 0.0;
    }
  }
}

export { WaterShader };
