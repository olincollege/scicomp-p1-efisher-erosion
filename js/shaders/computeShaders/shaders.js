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

function buildComputeShaders(particleSize, mapSize, renderer) {
  shaders.dir = new DirectionShader(particleSize, renderer);
  shaders.pos = new PositionShader(particleSize, renderer);
  shaders.hDiff = new HeightDifferenceShader(particleSize, renderer);

  shaders.dep = new DepositionShader(particleSize, renderer);
  shaders.hMap = new HeightMapShader(mapSize, renderer);

  shaders.water = new WaterShader(particleSize, renderer);
  shaders.vel = new VelocityShader(particleSize, renderer);

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
