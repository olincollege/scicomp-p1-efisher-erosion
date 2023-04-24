import ComputeShader from "./shader";

const shader = "";

class VelocityShader extends ComputeShader {
  render(hDiffShader) {
    this.uniforms["hDiff"] = hDiffShader.newFrame;
  }

  get shader() {
    return shader;
  }

  // static fill(texture) {}
}

export { VelocityShader };
