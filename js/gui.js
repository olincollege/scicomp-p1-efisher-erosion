import GUI from "lil-gui";

import { updateTerrain } from "./meshes";
import { status, reset, start, stop } from "./sim";

const folders = [];

function buildTerrain(gui) {
  const terrainSettings = {
    Seed: 42,
    Size: 100,
    Frequency: 0.03,
    Amplitude: 8,
  };

  const terrainFolder = gui.addFolder("Terrain");
  terrainFolder.add(terrainSettings, "Seed", 1, 100, 1);
  terrainFolder.add(terrainSettings, "Frequency", 0.01, 0.1, 0.001);
  terrainFolder.add(terrainSettings, "Amplitude", 1, 20, 1);
  terrainFolder.open();
  terrainFolder.onChange((event) => {
    updateTerrain(event.object);
  });
  folders.push(terrainFolder);

  return terrainSettings;
}

function buildParameters(gui) {
  const parameters = {
    Seed: 42,
  };

  const paramsFolder = gui.addFolder("Parameters");
  paramsFolder.add(parameters, "Seed", 1, 100, 1);
  paramsFolder.open();
  folders.push(paramsFolder);

  return parameters;
}

function buildControls(gui) {
  const toggle = (onOff) => {
    folders.forEach((folder) => {
      folder.controllers.forEach((c) => {
        c.enable(onOff);
      });
    });
  };

  const controls = {
    Start: () => {
      toggle(false);
      start();
    },
    Stop: () => {
      stop();
      toggle(true);
    },
    Reset: () => {
      reset();
      toggle(true);
    },
  };
  const controlsFolder = gui.addFolder("Controls");
  controlsFolder.add(controls, "Start");
  controlsFolder.add(controls, "Stop");
  controlsFolder.add(controls, "Reset");
}

function buildDisplay() {
  let display = new GUI({ autoPlace: false, title: "Metadata" });

  const element = document.createElement("div");
  element.appendChild(display.domElement);
  element.style.position = "absolute";
  element.style.top = "0";
  element.style.left = "20px";
  document.body.appendChild(element);

  const metadataFolder = display.addFolder("Metadata");
  const controller = metadataFolder.add(status, "step");
  controller.name("Step");
  controller.disable();
  controller.listen();

  return display;
}

function buildGui() {
  let gui = new GUI({ title: "Simulation" });
  let settings = {};

  settings.terrain = buildTerrain(gui);
  settings.params = buildParameters(gui);

  buildControls(gui);
  buildDisplay();

  return settings;
}

export { buildGui };
