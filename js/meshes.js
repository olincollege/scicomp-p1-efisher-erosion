import * as THREE from "three";

import { createNoise2D } from "simplex-noise";

import { vertexShader } from "./vertex_shaders";
import { fragmentShader } from "./fragment_shaders";

export default function initMeshes(scene) {
  const plane = buildTerrain(100, 100, 256);
  scene.add(plane);
  return { plane: plane };
}

function buildTerrain(width, height, resolution) {
  const geometry = new THREE.PlaneGeometry(
    width,
    height,
    resolution,
    resolution
  );

  const noiseFunc = createNoise2D();
  const pos = geometry.attributes.position.array;
  const noise = [];
  for (let i = 0; i < pos.length; i += 3) {
    noise.push(noiseFunc(pos[i] / 25, pos[i + 1] / 25) * 10);
  }
  const noiseAttr = new Float32Array(noise);
  geometry.setAttribute(
    "displacement",
    new THREE.BufferAttribute(noiseAttr, 1)
  );

  const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader });
  const plane = new THREE.Mesh(geometry, material);
  return plane;
}
