import {
  buildComputeShaders,
  stepComputeShaders,
  resetComputeShaders,
} from "./shaders/computeShaders/shaders";
import { updateTerrain } from "./meshes";

const status = { running: false, step: 0 };
let display;

function start() {
  buildComputeShaders();
  status.running = true;
}

function stop() {
  status.running = false;
}

function reset() {
  status.running = false;
  status.step = 0;
  updateTerrain();
  resetComputeShaders();
}

function update(settings) {
  updateTerrain(settings);
  resetComputeShaders();
}

function step() {
  if (!status.running) {
    return;
  }
  stepComputeShaders(status.step);
  status.step += 1;
}

export { status, start, stop, reset, update, step };
