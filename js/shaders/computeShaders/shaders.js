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
  const droplets = Math.round(Math.sqrt(params.droplets));
  params.shaders = shaders;

  // shaders.dir = new DirectionShader(droplets, renderer, params).init();
  // shaders.pos = new PositionShader(droplets, renderer, params).init();
  // shaders.hDiff = new HeightDifferenceShader(droplets, renderer, params).init();

  // shaders.dep = new DepositionShader(droplets, renderer, params).init();
  // shaders.hMap = new HeightMapShader(params.mapSize, renderer, params).init();

  shaders.water = new WaterShader(droplets, renderer, params).init();
  // shaders.vel = new VelocityShader(droplets, renderer, params).init();

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

export { buildComputeShaders, stepComputeShaders };
