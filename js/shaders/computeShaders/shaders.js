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

const shaders = {};

function buildComputeShaders(renderer, params) {
  params.heightMap = heightMap;
  const n = params.droplets;
  const size = params.mapSize;
  const data = new Float32Array(n * 4);
  params.emptyTexture = new THREE.DataTexture(
    data,
    n,
    1,
    THREE.RGBAFormat,
    THREE.FloatType
  );

  shaders.dir = new DirectionShader(size, size, renderer, params, shaders);
  shaders.pos = new PositionShader(size, size, renderer, params, shaders);
  shaders.hDiff = new HeightDifferenceShader(
    size,
    size,
    renderer,
    params,
    shaders
  );

  // shaders.dep = new DepositionShader(droplets, renderer, params);
  shaders.hMap = new HeightMapShader(size, size, renderer, params, shaders);

  shaders.water = new WaterShader(size, size, renderer, params, shaders);
  shaders.vel = new VelocityShader(size, size, renderer, params, shaders);

  Object.values(shaders).forEach((shader) => {
    shader.init();
  });

  return shaders;
}

function stepComputeShaders() {
  shaders.dir.render(shaders.hMap);
  shaders.pos.render(shaders.dir);
  shaders.hDiff.render(shaders.pos);

  // shaders.dep.render(shaders.vel, shaders.water, shaders.hDiff);
  // shaders.hMap.render(shaders.dep);

  shaders.water.render();
  shaders.vel.render(shaders.hDiff);
}

function resetComputeShaders() {
  Object.values(shaders).forEach((shader) => {
    shader.reset();
  });
}

export { buildComputeShaders, stepComputeShaders, resetComputeShaders };
