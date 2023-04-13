import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function initScene() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  return { scene, camera, renderer, controls };
}

function initMesh(scene) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  return { cube: cube };
}

function init() {
  const { scene, camera, renderer, controls } = initScene();
  const meshes = initMesh(scene);
  return {
    scene: scene,
    camera: camera,
    renderer: renderer,
    controls: controls,
    meshes: meshes,
  };
}

function animate(c) {
  requestAnimationFrame(() => {
    animate(c);
  });
  c.meshes.cube.rotation.x += 0.01;
  c.meshes.cube.rotation.y += 0.01;
  c.renderer.render(c.scene, c.camera);
}

function main() {
  const config = init();
  animate(config);
}

main();
