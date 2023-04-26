import * as THREE from "three";

import ComputeShader from "./shader";

const passThruShader = `
uniform vec3 resolution;
uniform sampler3D texture;

void main() {
  vec3 uv = gl_FragCoord.xyz / resolution;
  gl_FragColor = texture3D(texture, uv);
}
`;

const shader = `
uniform sampler2D pos;
uniform sampler2D oldSed;
uniform sampler2D newSed;

uniform float mapSize;
uniform vec3 res;

void main() {
  vec2 uv = vec2(gl_FragCoord.x / res.x, 0.5);

  float sedDelta = sampler2D(newSed, uv).x - sampler2D(oldSed, uv).x

  vec2 particlePos = sampler2D(pos, uv).xy;
  vec2 pointPos = gl_FragCoord.yz;


  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`;

class DepositionShader extends ComputeShader {
  constructor(droplets, mapSize, renderer, params, shaders) {
    super(droplets, mapSize, renderer, params, shaders);
    this.resolution = THREE.Vector3(
      this.droplets,
      this.params.mapSize,
      this.params.mapSize
    );
  }

  init() {
    // The deposition shader requires reading and writing from a 3D texture, which is not
    // supported by Three.js's GPUComputationRenderer. However, the
    // GPUComputationRenderer's convenience functions around setting up the renderer,
    // setting up a render mesh and maintaing two buffers are still very useful. So, this
    // function manually initialiazes the shader with 3D textures and 3D render targets
    // such that we can still use the GPUComputationRenderer's compute() method to
    // actually run the shader.

    // Create 3D texture
    const data = new Float32Array(
      this.resolution.x * this.resolution.y * this.resolution.z * 4
    );
    this.texture = new Data3DTexture(
      data,
      this.resolution.x,
      this.resolution.y,
      this.resolution.z,
      FloatType
    );
    this.texture.needsUpdate = true;

    const variable = this.c.addVariable("", shader, this.texture);
    this.initUniforms(variable.material.uniforms, this.params, this.shaders);

    // Create 3D render targets
    variable.renderTargets[0] = this.createRenderTarget();
    variable.renderTargets[1] = this.createRenderTarget();

    // Create pass through fragment shader to populate render targets
    this.passThruUniforms = {
      resolution: { value: this.resolution },
      texture: { value: this.texture },
    };
    this.passThruMaterial = new ShaderMaterial({
      uniforms: this.passThruUniforms,
      vertexShader: this.c.getPassThroughVertexShader(),
      fragmentShader: passThruShader,
    });

    // Populate render targets.
    this.reset();

    this.v = variable;
  }

  createRenderTarget() {
    return new WebGL3DRenderTarget(
      this.droplets,
      this.params.mapSize,
      this.params.mapSize,
      {
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: RGBAFormat,
        type: dataType,
        depthBuffer: false,
      }
    );
  }

  reset() {
    this.fill(this.texture, this.params);
    this.c.doRenderTarget(this.passThruMaterial, variable.renderTargets[0]);
    this.c.doRenderTarget(this.passThruMaterial, variable.renderTargets[1]);
  }

  initUniforms(uniforms, params, shaders) {
    uniforms["pos"] = { value: params.emptyTexture };
    uniforms["oldSed"] = { value: params.emptyTexture };
    uniforms["newSed"] = { value: params.emptyTexture };
    uniforms["mapSize"] = { value: params.mapSize };
    uniforms["res"] = { value: this.resolution };
  }

  setUniforms(uniforms, params, shaders) {
    uniforms.pos.value = shaders.pos.oldFrame();
    uniforms.oldSed.value = shaders.sed.oldFrame();
    uniforms.newSed.value = shaders.sed.newFrame();
  }

  fill(texture, params) {
    const arr = texture.image.data;
    for (let k = 0; k < arr.length; k += 4) {
      arr[k + 0] = 0.0;
      arr[k + 1] = 0.0;
      arr[k + 2] = 0.0;
      arr[k + 3] = 1.0;
    }
  }
}

export { DepositionShader };
