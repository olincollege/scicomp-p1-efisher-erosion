import ComputeShader from "./shader";

const shader = `
uniform sampler2D hDiff;
uniform float gravity;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  float oldVel = texture2D(lastFrame, uv).x;
  float diff = texture2D(hDiff, uv).x;
  float newVel = sqrt(pow(oldVel, 2.0) + diff * gravity);

  gl_FragColor = vec4(newVel, 0.0, 0.0, 0.0);
}
`;

class VelocityShader extends ComputeShader {
  initUniforms(uniforms, params, shaders) {
    uniforms["hDiff"] = { value: params.emptyTexture };
    uniforms["gravity"] = { value: params.gravity };
  }

  setUniforms(uniforms, params, shaders) {
    uniforms.hDiff.value = shaders.hDiff.newFrame();
  }

  shader() {
    return shader;
  }

  fill(texture, params) {
    const arr = texture.image.data;
    for (let k = 0; k < arr.length; k += 4) {
      arr[k + 0] = 0.0;
      arr[k + 1] = 0.0;
      arr[k + 2] = 0.0;
      arr[k + 3] = 0.0;
    }
  }
}

export { VelocityShader };
