import * as THREE from "three";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";

import { heightMap } from "../../meshes";
import { DirectionShader } from "./dirShader";
import { DepositionShader } from "./depShader";
import { HeightDifferenceShader } from "./hDiffShader";
import { HeightMapShader } from "./hMapShader";
import { PositionShader } from "./posShader";
import { VelocityShader } from "./velShader";
import { WaterShader } from "./waterShader";
import { SedimentShader } from "./sedShader";

const shaders = {};
let meshes, maxSteps;

function buildComputeShaders(renderer, params, meshes_) {
  const n = params.droplets;
  const size = params.mapSize;
  meshes = meshes_;
  maxSteps = params.steps;

  const data = new Float32Array(n * 4);
  params.emptyTexture = new THREE.DataTexture(
    data,
    n,
    1,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  params.heightMap = heightMap;

  shaders.dir = new DirectionShader(n, 1, renderer, params, shaders);
  shaders.pos = new PositionShader(n, 1, renderer, params, shaders);
  shaders.hDiff = new HeightDifferenceShader(n, 1, renderer, params, shaders);

  shaders.sed = new SedimentShader(n, 1, renderer, params, shaders);
  shaders.hMap = new HeightMapShader(size, size, renderer, params, shaders);

  shaders.water = new WaterShader(n, 1, renderer, params, shaders);
  shaders.vel = new VelocityShader(n, 1, renderer, params, shaders);

  Object.values(shaders).forEach((shader) => {
    shader.init();
  });

  return shaders;
}

function stepComputeShaders(step) {
  if (step % maxSteps == 0) {
    resetComputeShaders();
  }

  shaders.dir.render();
  shaders.pos.render();
  shaders.hDiff.render();

  shaders.sed.render();
  shaders.hMap.render();

  shaders.water.render();
  shaders.vel.render();

  meshes.plane.material.uniforms.hMap.value = shaders.hMap.newFrame();
}

function resetComputeShaders() {
  Object.entries(shaders).forEach(([name, shader]) => {
    if (name == "hMap") {
      return;
    }
    shader.reset();
  });
}

export { buildComputeShaders, stepComputeShaders, resetComputeShaders };
