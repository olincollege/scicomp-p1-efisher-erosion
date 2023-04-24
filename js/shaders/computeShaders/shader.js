import * as THREE from "three";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";

export default class ComputeShader {
  constructor(size, renderer, params) {
    this.c = new GPUComputationRenderer(size, size, renderer);
    this.params = params;
    this.shaders = params.shaders;
  }

  init() {
    const texture = this.c.createTexture();
    this.fill(texture);

    const variable = this.c.addVariable("lastFrame", this.shader(), texture);
    this.c.setVariableDependencies(variable, [variable]);

    this.initUniforms(variable.material.uniforms, this.params, this.shaders);

    const error = this.c.init();
    if (error !== null) {
      throw new Error(error);
    }

    this.v = variable;

    return this;
  }

  fill(texture) {
    const arr = texture.image.data;
    for (let k = 0; k < arr.length; k += 4) {
      const x = Math.random();
      const y = Math.random();
      arr[k + 0] = x;
      arr[k + 1] = y;
      arr[k + 2] = 0;
      arr[k + 3] = 0;
    }
  }

  render() {
    this.setUniforms(this.v.material.uniforms, this.params, this.shaders);
    this.c.compute();
  }

  initUniforms() {
    throw new Error("Not implemented!");
  }

  setUniforms() {
    throw new Error("Not implemented!");
  }

  shader() {
    throw new Error("Not implemented!");
  }

  newFrame() {
    // Most recently written frame of the two buffers
    return this.c.getAlternateRenderTarget(this.v).texture;
  }

  oldFrame() {
    // Frame to be overwritten of the two buffers. Not the most recent.
    return this.c.getCurrentRenderTarget(this.v).texture;
  }
}
