import ComputeShader from "./shader";

const shader = `
uniform sampler2D dir;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec2 direction = texture2D(dir, uv).xy;
  vec2 oldPos = texture2D(lastFrame, uv).xy;
  vec2 newPos = oldPos + direction;

  gl_FragColor = vec4(newPos, 0.0, 1.0);
}
`;

class PositionShader extends ComputeShader {
  initUniforms(uniforms, params, shaders) {
    uniforms["dir"] = { value: shaders.dir.newFrame() };
  }

  setUniforms(uniforms, params, shaders) {
    uniforms.dir.value = shaders.dir.newFrame();
  }

  shader() {
    return shader;
  }

  fill(texture, params) {
    const arr = texture.image.data;
    for (let k = 0; k < arr.length; k += 4) {
      const x = Math.random() * params.mapSize;
      const y = Math.random() * params.mapSize;
      arr[k + 0] = x;
      arr[k + 1] = y;
      arr[k + 2] = 0.0;
      arr[k + 3] = 1.0;
      // const idx = k / 4;
      // const x = idx % params.mapSize;
      // const y = Math.floor(idx / params.mapSize);
      // arr[k + 0] = x;
      // arr[k + 1] = y;
      // arr[k + 2] = 0.0;
      // arr[k + 3] = 1.0;
    }
  }
}

export { PositionShader };
