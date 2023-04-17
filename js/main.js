import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { initMeshes } from "./meshes";
import initGui from "./gui";

function initScene() {
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

function initListerners(scene, camera, renderer) {
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
  const { scene, camera, renderer, controls } = initScene();
  const settings = initGui();

  const meshes = initMeshes(scene, settings);
  initListerners(scene, camera, renderer);

  return {
    scene: scene,
    camera: camera,
    renderer: renderer,
    controls: controls,
    meshes: meshes,
    settings: settings,
  };
}

function animate(c) {
  requestAnimationFrame(() => {
    animate(c);
  });
  c.renderer.render(c.scene, c.camera);
}

function main() {
  const config = init();
  animate(config);
}

main();
