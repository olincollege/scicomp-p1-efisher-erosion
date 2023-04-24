import ComputeShader from "./shader";

const shader = "";

class DepositionShader extends ComputeShader {
  render(velShader, waterShader, hDiffShader) {
    // Replace the render target with the 3D Webgl target
    // Create intial conditions with 3D DataTexture
    // Fill new render targets w/ passthru vertex and fragment shaders

    this.uniforms()["vel"] = velShader.newFrame();
    this.uniforms()["water"] = waterShader.newFrame();
    this.uniforms()["hDiff"] = hDiffShader.newFrame();
    this.compute();
  }

  shader() {
    return shader;
  }

  // static fill(texture) {}
}

export { DepositionShader };
