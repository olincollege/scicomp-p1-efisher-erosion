import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import alea from "alea";

import { fragmentShader } from "./shaders/fragmentShaders";
import { vertexShader } from "./shaders/vertexShaders";

let scene;
let meshes = {};
let terrainSettings;
let initialized = false;

function genNoise(settings, pos) {
  const noiseFunc = createNoise2D(alea(settings["Seed"]));
  const noise = [];
  for (let i = 0; i < pos.length; i += 3) {
    noise.push(
      noiseFunc(
        pos[i] * settings["Size"] * settings["Frequency"],
        pos[i + 1] * settings["Size"] * settings["Frequency"]
      ) * settings["Amplitude"]
    );
  }
  return noise;
}

function updateTerrain(settings) {
  if (!initialized) {
    return;
  }

  const mesh = meshes.plane;

  mesh.scale.set(settings["Size"], settings["Size"]);

  mesh.material.uniforms.amplitude.value = settings["Amplitude"];

  const displacement = mesh.geometry.attributes.displacement.array;
  const noise = genNoise(settings, mesh.geometry.attributes.position.array);
  for (let i = 0; i < displacement.length; i++) {
    displacement[i] = noise[i];
  }
  mesh.geometry.attributes.displacement.needsUpdate = true;

  terrainSettings = { ...settings };
}

function buildTerrain(settings) {
  const geometry = new THREE.PlaneGeometry(1, 1, 512, 512);

  const noise = new Float32Array(
    genNoise(settings, geometry.attributes.position.array)
  );
  geometry.setAttribute("displacement", new THREE.BufferAttribute(noise, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      amplitude: { value: settings["Amplitude"] },
    },
    vertexShader,
    fragmentShader,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.scale.set(settings["Size"], settings["Size"]);

  scene.add(plane);
  meshes.plane = plane;
  terrainSettings = { ...settings };
}

function buildMeshes(s, settings) {
  scene = s;
  initialized = true;
  buildTerrain(settings.terrain);
  return meshes;
}

export { buildMeshes, updateTerrain };
