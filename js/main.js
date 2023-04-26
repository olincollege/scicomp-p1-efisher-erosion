import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { buildGui } from "./gui";
import { buildMeshes } from "./meshes";
import { initComputeShaders } from "./shaders/computeShaders/shaders";
import { step } from "./sim";

function buildScene() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 300;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  return { scene, camera, renderer, controls };
}

function buildListerners(scene, camera, renderer) {
  window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  });
}

function init() {
  const { scene, camera, renderer, controls } = buildScene();
  const settings = buildGui();

  const meshes = buildMeshes(scene, settings);
  settings.params.meshes = meshes;
  const shaders = initComputeShaders(renderer, settings.params, meshes);

  buildListerners(scene, camera, renderer);

  return {
    scene: scene,
    camera: camera,
    renderer: renderer,
    controls: controls,
    meshes: meshes,
    settings: settings,
    shaders: shaders,
  };
}

function animate(c) {
  requestAnimationFrame(() => {
    animate(c);
  });
  step();
  c.renderer.render(c.scene, c.camera);
}

function main() {
  const config = init();
  animate(config);
}

main();
