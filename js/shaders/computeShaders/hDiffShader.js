import ComputeShader from "./shader";

const shader = "";

class HeightDifferenceShader extends ComputeShader {
  render(posShader) {
    this.uniforms["oldPos"] = posShader.oldFrame;
    this.uniforms["newPos"] = posShader.newFrame;
    this.compute();
  }

  get shader() {
    return shader;
  }

  // static fill(texture) {}
}

export { HeightDifferenceShader };
