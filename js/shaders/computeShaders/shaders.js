import * as THREE from "three";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";

import { DirectionShader } from "./dirShader";
import { DepositionShader } from "./depShader";
import { HeightDifferenceShader } from "./hDiffShader";
import { HeightMapShader } from "./hMapShader";
import { PositionShader } from "./posShader";
import { VelocityShader } from "./velShader";
import { WaterShader } from "./waterShader";

const shaders = {};

function buildComputeShaders(renderer, params) {
  const size = params.droplets;
  // shaders.dir = new DirectionShader(droplets, renderer, params);
  // shaders.pos = new PositionShader(droplets, renderer, params);
  // shaders.hDiff = new HeightDifferenceShader(
  //   params.droplets,
  //   renderer,
  //   params,
  //   shaders
  // );

  // shaders.dep = new DepositionShader(droplets, renderer, params);
  // shaders.hMap = new HeightMapShader(params.mapSize, renderer, params);

  shaders.water = new WaterShader(size, renderer, params, shaders);
  // shaders.vel = new VelocityShader(droplets, renderer, params);

  Object.values(shaders).forEach((shader) => {
    shader.init();
  });

  return shaders;
}

function stepComputeShaders() {
  // shaders.dir.render(shaders.hMap);
  // shaders.pos.render(shaders.dir);
  // shaders.hDiff.render(shaders.pos);

  // shaders.dep.render(shaders.vel, shaders.water, shaders.hDiff);
  // shaders.hMap.render(shaders.dep);

  shaders.water.render();
  // shaders.vel.render(shaders.hDiff);
}

function resetComputeShaders() {
  Object.values(shaders).forEach((shader) => {
    shader.reset();
  });
}

export { buildComputeShaders, stepComputeShaders, resetComputeShaders };
