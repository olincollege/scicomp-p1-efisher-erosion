import GUI from "lil-gui";

import { updateTerrain } from "./meshes";
import { status, reset, start, stop } from "./sim";

const folders = [];

function buildTerrain(gui) {
  const terrainSettings = {
    Seed: 42,
    Size: 100,
    Frequency: 0.01,
    Amplitude: 8,
  };

  const terrainFolder = gui.addFolder("Terrain");
  terrainFolder.add(terrainSettings, "Seed", 1, 100, 1);
  terrainFolder.add(terrainSettings, "Frequency", 0.001, 0.1, 0.001);
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
    droplets: 16,
    mapSize: 512,
    inertia: 0.1,
    capacity: 8,
    deposition: 0.1,
    erosion: 0.1,
    evaporation: 0.1,
    radius: 4,
    minSlope: 0.05,
    blur: 0.1,
    gravity: 10,
    steps: 64,
  };

  const paramsFolder = gui.addFolder("Parameters");
  paramsFolder.add(parameters, "droplets", 1, 50).name("Number of Droplets");
  paramsFolder.add(parameters, "inertia", 0, 1).name("Inertia");
  paramsFolder.add(parameters, "capacity", 1, 50).name("Carry Capacity");
  paramsFolder.add(parameters, "deposition", 0, 1).name("Deposition Speed");
  paramsFolder.add(parameters, "erosion", 0, 1).name("Erosion Speed");
  paramsFolder.add(parameters, "radius", 1, 10).name("Erosion Radius");
  paramsFolder.add(parameters, "evaporation", 0, 0.5).name("Evaporation Speed");
  paramsFolder.add(parameters, "minSlope", 0.0001, 0.1).name("Min Slope");
  paramsFolder.add(parameters, "blur", 0, 1).name("Blur");
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
    startStop: () => {},
    Reset: () => {
      reset();
      toggle(true);
    },
  };
  const controlsFolder = gui.addFolder("Controls");
  const startStop = controlsFolder.add(controls, "startStop").name("Start");
  controlsFolder.add(controls, "Reset");

  controls.startStop = () => {
    if (!status.running) {
      toggle(false);
      start();
      startStop.name("Stop");
    } else {
      stop();
      startStop.name("Start");
    }
  };
}

function buildDisplay() {
  let display = new GUI({ autoPlace: false, title: "Display" });

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
