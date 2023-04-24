import ComputeShader from "./shader";

const shader = "";

class DirectionShader extends ComputeShader {
  render(hMapShader) {
    this.uniforms()["hMap"] = hMapShader.newFrame();
    this.compute();
  }

  shader() {
    return shader;
  }

  // static fill(texture) {}
}

export { DirectionShader };
