import * as THREE from "three";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";

export default class ComputeShader {
  constructor(x, y, renderer, params, shaders) {
    this.c = new GPUComputationRenderer(x, y, renderer);
    this.params = params;
    this.shaders = shaders;
  }

  init() {
    this.texture = this.c.createTexture();
    this.fill(this.texture, this.params);

    const variable = this.c.addVariable(
      "lastFrame",
      this.shader(),
      this.texture
    );
    this.c.setVariableDependencies(variable, [variable]);

    this.initUniforms(variable.material.uniforms, this.params, this.shaders);

    const error = this.c.init();
    if (error !== null) {
      throw new Error(error);
    }

    this.v = variable;
  }

  render() {
    this.setUniforms(this.v.material.uniforms, this.params, this.shaders);
    this.c.compute();
  }

  reset() {
    this.fill(this.texture, this.params);
    this.texture.needsUpdate = true;
    this.c.renderTexture(this.texture, this.v.renderTargets[0]);
    this.c.renderTexture(this.texture, this.v.renderTargets[1]);
  }

  fill(texture, params) {
    throw new Error("Not implemented!");
  }

  initUniforms(uniforms, params, shaders) {
    throw new Error("Not implemented!");
  }

  setUniforms(uniforms, params, shaders) {
    throw new Error("Not implemented!");
  }

  shader() {
    throw new Error("Not implemented!");
  }

  newFrame() {
    // Most recently written frame of the two buffers
    return this.c.getCurrentRenderTarget(this.v).texture;
  }

  oldFrame() {
    // Frame to be overwritten of the two buffers. Not the most recent.
    return this.c.getAlternateRenderTarget(this.v).texture;
  }
}
