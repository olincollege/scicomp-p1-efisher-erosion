import ComputeShader from "./shader";

const shader = "";

class WaterShader extends ComputeShader {
  render() {
    this.compute();
  }

  get shader() {
    return shader;
  }

  // static fill(texture) {}
}

export { WaterShader };
