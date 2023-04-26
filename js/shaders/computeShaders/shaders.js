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

function buildComputeShaders(renderer, params) {
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
  params.heightMap = heightMap;

  shaders.dir = new DirectionShader(n, 1, renderer, params, shaders);
  shaders.pos = new PositionShader(n, 1, renderer, params, shaders);
  shaders.hDiff = new HeightDifferenceShader(n, 1, renderer, params, shaders);

  shaders.sed = new SedimentShader(n, 1, renderer, params, shaders);
  shaders.dep = new DepositionShader(n, size, renderer, params);
  shaders.hMap = new HeightMapShader(size, size, renderer, params, shaders);

  shaders.water = new WaterShader(n, 1, renderer, params, shaders);
  shaders.vel = new VelocityShader(n, 1, renderer, params, shaders);

  Object.values(shaders).forEach((shader) => {
    shader.init();
  });

  return shaders;
}

function stepComputeShaders() {
  shaders.dir.render();
  shaders.pos.render();
  shaders.hDiff.render();

  shaders.sed.render();
  shaders.dep.render();
  shaders.hMap.render();

  shaders.water.render();
  shaders.vel.render();
}

function resetComputeShaders() {
  Object.values(shaders).forEach((shader) => {
    shader.reset();
  });
}

export { buildComputeShaders, stepComputeShaders, resetComputeShaders };
