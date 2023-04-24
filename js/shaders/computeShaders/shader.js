import * as THREE from "three";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";

export default class ComputeShader {
  constructor(size, renderer, params) {
    this.params = params;

    const compute = new GPUComputationRenderer(size, size, renderer);

    const texture = compute.createTexture();
    this.fill(texture);

    const variable = compute.addVariable("lastFrame", this.shader(), texture);
    compute.setVariableDependencies(variable, [variable]);

    const error = compute.init();
    if (error !== null) {
      throw new Error(error);
    }

    this.c = compute;
    this.v = variable;
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
    throw new Error("Not implemented!");
  }

  shader() {
    throw new Error("Not implemented!");
  }

  uniforms() {
    return this.v.material.uniforms;
  }

  newFrame() {
    // Most recently written frame of the two buffers
    return this.c.getAlternateRenderTarget(this.v).texture;
  }

  oldFrame() {
    // Frame to be overwritten of the two buffers. Not the most recent.
    return this.c.getCurrentRenderTarget(this.v).texture;
  }

  compute() {
    this.c.compute();
  }
}
