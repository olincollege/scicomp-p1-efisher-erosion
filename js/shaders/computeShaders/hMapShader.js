import ComputeShader from "./shader";

const shader = `
uniform sampler2D dir;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec2 direction = texture2D(dir, uv).xy;
  vec2 oldPos = texture2D(lastFrmae, uv).xy;
  vec2 newPos = oldPos + direction;

  gl_FragColor = vec4(newPos, 0.0, 1.0);
}
`;

class HeightMapShader extends ComputeShader {
  initUniforms(uniforms, params, shaders) {}

  setUniforms(uniforms, params, shaders) {
    // this.params.meshes.plane.material.uniforms.hMap.value = this.newFrame();
    // this.params.meshes.plane.material.uniforms.hMap.needsUpdate = true;
  }

  shader() {
    return shader;
  }

  fill(texture, params) {
    const arr = texture.image.data;
    const map = params.heightMap.image.data;
    for (let k = 0; k < arr.length; k += 4) {
      arr[k + 0] = map[k + 0];
      arr[k + 1] = map[k + 1];
      arr[k + 2] = map[k + 2];
      arr[k + 3] = map[k + 3];
    }
  }
}

export { HeightMapShader };
