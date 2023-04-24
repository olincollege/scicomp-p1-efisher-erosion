import ComputeShader from "./shader";

const shader = "";

class HeightMapShader extends ComputeShader {
  render(depShader) {
    this.uniforms()["dep"] = depShader.newFrame();
    this.compute();
  }

  shader() {
    return shader;
  }

  // static fill(texture) {}
}

export { HeightMapShader };
