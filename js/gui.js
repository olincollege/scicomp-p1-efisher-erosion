import GUI from "lil-gui";

import { updateTerrain } from "./meshes";
import { start, stop, reset } from "./sim";

let terrainFolder;

function buildTerrain(gui) {
  // Show visualizaton options
  const terrainSettings = {
    Seed: 42,
    Size: 100,
    Frequency: 0.03,
    Amplitude: 8,
  };
  terrainFolder = gui.addFolder("Terrain");
  terrainFolder.add(terrainSettings, "Seed", 1, 100, 1);
  terrainFolder.add(terrainSettings, "Size", 64, 1024, 1);
  terrainFolder.add(terrainSettings, "Frequency", 0.01, 0.1, 0.001);
  terrainFolder.add(terrainSettings, "Amplitude", 1, 20, 1);
  terrainFolder.open();
  terrainFolder.onChange((event) => {
    updateTerrain(event.object);
  });
  return terrainSettings;
}

function buildControls(gui) {
  const disable = () => {
    terrainFolder.controllers.forEach((c) => {
      c.disable();
    });
  };
  const enable = () => {
    terrainFolder.controllers.forEach((c) => {
      c.enable();
    });
  };

  const controls = {
    Start: () => {
      disable();
      start();
    },
    Stop: () => {
      stop();
      enable();
    },
    Reset: () => {
      reset();
      enable();
    },
  };
  const controlsFolder = gui.addFolder("Controls");
  controlsFolder.add(controls, "Start");
  controlsFolder.add(controls, "Stop");
  controlsFolder.add(controls, "Reset");
}

function buildGui() {
  let gui = new GUI();
  let settings = {};

  settings.terrain = buildTerrain(gui);
  buildControls(gui);

  return settings;
}

export { buildGui };
