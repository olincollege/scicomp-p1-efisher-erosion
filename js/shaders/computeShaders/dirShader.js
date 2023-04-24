import ComputeShader from "./shader";

const shader = "";

class DirectionShader extends ComputeShader {
  render(hMapShader) {
    this.uniforms["hMap"] = hMapShader.newFrame;
    this.compute();
  }

  get shader() {
    return shader;
  }

  // static fill(texture) {}
}

export { DirectionShader };
