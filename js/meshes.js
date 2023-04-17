import * as THREE from "three";

import { basicVertexShader } from "./vertex_shaders";
import { basicFragmentShader } from "./fragment_shaders";

export default function initMeshes(scene) {
  const plane = buildFlatSurface(scene, 100, 100, 256);
  return { plane: plane };
}

function buildFlatSurface(scene, width, height, resolution) {
  const geometry = new THREE.PlaneGeometry(
    width,
    height,
    resolution,
    resolution
  );
  const material = new THREE.ShaderMaterial({
    vertexShader: basicVertexShader,
    fragmentShader: basicFragmentShader,
  });
  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);
  return plane;
}
