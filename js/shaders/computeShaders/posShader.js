import ComputeShader from "./shader";

const shader = "";

class PositionShader extends ComputeShader {
  render(dirShader) {
    this.uniforms["dir"] = dirShader.lastFrame;
    this.compute();
  }

  get shader() {
    return shader;
  }

  // static fill(texture) {}
}

export { PositionShader };
