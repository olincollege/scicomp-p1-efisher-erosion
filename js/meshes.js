import * as THREE from "three";
import { createNoise3D } from "simplex-noise";
import alea from "alea";

import { fragmentShader } from "./shaders/fragmentShaders";
import { vertexShader } from "./shaders/vertexShaders";

const SIZE = 512;

let scene;
let heightMap;
let meshes = {};
let terrainSettings;
let initialized = false;

function updateTerrain(settings) {
  if (!initialized) {
    return;
  }

  if (settings === undefined) {
    settings = terrainSettings;
  }

  const arr = heightMap.image.data;
  const noiseFunc = createNoise3D(alea(42));
  for (let k = 0; k < arr.length; k += 4) {
    const idx = k / 4;
    const x = (idx % SIZE) + 1e-3;
    const y = Math.floor(idx / SIZE) + 1e-3;
    let amp = settings["Amplitude"];
    let height = 0;
    for (let i = 0; i <= 3; i += 1) {
      let factor = 2 ** i;
      height +=
        noiseFunc(
          x * (settings["Frequency"] * factor),
          y * (settings["Frequency"] * factor),
          settings["Seed"] / 50 + 0.5
        ) *
        (amp / 4 ** i);
    }

    arr[k + 0] = Math.max(height, settings["Min"]);
    arr[k + 1] = 0;
    arr[k + 2] = 0;
    arr[k + 3] = 0;
  }
  heightMap.needsUpdate = true;
  meshes.plane.material.uniforms.hMap.value = heightMap;
  meshes.plane.material.uniforms.amplitude.value = settings["Amplitude"];
  meshes.plane.material.uniforms.floor.value = settings["Min"];

  terrainSettings = { ...settings };
}

function buildTerrain(settings) {
  const geometry = new THREE.PlaneGeometry(1, 1, SIZE, SIZE);
  console.log(geometry);
  const data = new Float32Array(SIZE * SIZE * 4);
  heightMap = new THREE.DataTexture(
    data,
    SIZE,
    SIZE,
    THREE.RGBAFormat,
    THREE.FloatType
  );

  const material = new THREE.ShaderMaterial({
    uniforms: {
      hMap: { value: heightMap },
      amplitude: { value: settings["Amplitude"] },
      floor: { value: settings["Min"] },
    },
    vertexShader,
    fragmentShader,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.scale.set(settings["Size"], settings["Size"]);

  scene.add(plane);
  meshes.plane = plane;

  initialized = true;
  updateTerrain(settings);
}

function buildMeshes(s, settings) {
  scene = s;
  buildTerrain(settings.terrain);
  return meshes;
}

export { buildMeshes, updateTerrain, heightMap };
