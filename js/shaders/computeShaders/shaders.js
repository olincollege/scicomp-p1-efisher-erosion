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
  shaders.dir = new DirectionShader(params.droplets, renderer, params);
  shaders.pos = new PositionShader(params.droplets, renderer, params);
  shaders.hDiff = new HeightDifferenceShader(params.droplets, renderer, params);

  shaders.dep = new DepositionShader(params.droplets, renderer, params);
  shaders.hMap = new HeightMapShader(params.mapSize, renderer, params);

  shaders.water = new WaterShader(params.droplets, renderer, params);
  shaders.vel = new VelocityShader(params.droplets, renderer, params);

  return shaders;
}

function renderComputeShaders() {
  shaders.dir.render(shaders.hMap);
  shaders.pos.render(shaders.dir);
  shaders.hDiff.render(shaders.pos);

  shaders.dep.render(shaders.vel, shaders.water, shaders.hDiff);
  shaders.hMap.render(shaders.dep);

  shaders.water.render();
  shaders.vel.render(shaders.hDiff);
}

export { buildComputeShaders, renderComputeShaders };
