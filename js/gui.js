import GUI from "lil-gui";

import { updateTerrain } from "./meshes";
import { status, reset, start, stop, update } from "./sim";

const folders = [];

function buildTerrain(gui) {
  const terrainSettings = {
    Seed: 42,
    Size: 1,
    Frequency: 0.0025,
    Amplitude: 0.125,
    Min: -10,
  };

  const terrainFolder = gui.addFolder("Terrain");
  terrainFolder.add(terrainSettings, "Seed", 1, 100, 1);
  terrainFolder.add(terrainSettings, "Frequency", 0.001, 0.01);
  terrainFolder.add(terrainSettings, "Amplitude", 0, 0.5);
  // terrainFolder.add(terrainSettings, "Min", -0.5, 0);
  terrainFolder.open();
  terrainFolder.onChange((event) => {
    update(event.object);
  });
  folders.push(terrainFolder);

  return terrainSettings;
}

function buildParameters(gui) {
  const parameters = {
    droplets: 4096,
    mapSize: 256,
    inertia: 0.9,
    capacity: 8,
    deposition: 0.1,
    erosion: 0.3,
    evaporation: 0.1,
    radius: 3,
    minSlope: 0.05,
    blurStrength: 0.1,
    blurRadius: 5,
    gravity: 10,
    steps: 64,
  };

  const paramsFolder = gui.addFolder("Parameters");
  paramsFolder
    .add(parameters, "droplets", 1, 8192, 1)
    .name("Number of Droplets");
  paramsFolder.add(parameters, "inertia", 0.6, 1).name("Inertia");
  paramsFolder.add(parameters, "capacity", 1, 50).name("Carry Capacity");
  paramsFolder.add(parameters, "deposition", 0, 1).name("Deposition Speed");
  paramsFolder.add(parameters, "erosion", 0, 1).name("Erosion Speed");
  paramsFolder.add(parameters, "radius", 1, 10).name("Erosion Radius");
  paramsFolder.add(parameters, "evaporation", 0, 0.5).name("Evaporation Speed");
  paramsFolder.add(parameters, "minSlope", 0.0001, 0.1).name("Min Slope");
  paramsFolder.add(parameters, "blurStrength", 0, 1).name("Blur Strength");
  paramsFolder.add(parameters, "blurRadius", 0, 10, 1).name("Blur Radius");
  paramsFolder.add(parameters, "steps", 1, 256, 1).name("Max Steps");
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
    Reset: () => {},
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
  controls.Reset = () => {
    reset();
    toggle(true);
    startStop.name("Start");
  };
}

function buildDisplay() {
  let display = new GUI({ autoPlace: false, title: "Display", width: 300 });

  const element = document.createElement("div");
  element.appendChild(display.domElement);
  element.style.position = "absolute";
  element.style.top = "0";
  element.style.left = "20px";
  document.body.appendChild(element);

  const metadataFolder = display.addFolder("Metadata");
  metadataFolder.add(status, "step").name("Step");
  metadataFolder.add(status, "totalSteps").name("Total Droplet Steps");
  metadataFolder.add(status, "particles").name("Total Finished Droplets");
  metadataFolder.add(status, "dps").name("Droplets per Second");

  metadataFolder.controllers.forEach((c) => {
    c.disable();
    c.listen();
  });

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
