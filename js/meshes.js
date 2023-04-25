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

  const arr = heightMap.image.data;
  const noiseFunc = createNoise3D(alea(42));
  for (let k = 0; k < arr.length; k += 4) {
    const idx = k / 4;
    const x = idx % SIZE;
    const y = Math.floor(idx / SIZE);
    const height =
      noiseFunc(
        x * settings["Frequency"],
        y * settings["Frequency"],
        settings["Seed"] / 50 + 0.5
      ) * settings["Amplitude"];

    arr[k + 0] = height;
    arr[k + 1] = 0;
    arr[k + 2] = 0;
    arr[k + 3] = 0;
  }
  heightMap.needsUpdate = true;

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
  heightMap.magFilter = THREE.LinearFilter;
  heightMap.minFilter = THREE.LinearFilter;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      hMap: { value: heightMap },
      amplitude: { value: settings["Amplitude"] },
    },
    vertexShader,
    fragmentShader,
  });
  // const material = new THREE.MeshBasicMaterial({
  //   color: 0xffff00,
  //   side: THREE.DoubleSide,
  // });
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

export { buildMeshes, updateTerrain };
