import GUI from "lil-gui";

import { updateTerrain } from "./meshes";

function buildTerrain(gui) {
  // Show visualizaton options
  const terrainSettings = {
    Seed: 42,
    Size: 100,
    Frequency: 0.03,
    Amplitude: 8,
  };
  const terrainSettingsFolder = gui.addFolder("Terrain");
  terrainSettingsFolder.add(terrainSettings, "Seed", 1, 100, 1);
  terrainSettingsFolder.add(terrainSettings, "Size", 64, 1024, 1);
  terrainSettingsFolder.add(terrainSettings, "Frequency", 0.01, 0.1, 0.001);
  terrainSettingsFolder.add(terrainSettings, "Amplitude", 1, 20, 1);
  terrainSettingsFolder.open();
  terrainSettingsFolder.onChange((event) => {
    updateTerrain(event.object);
  });
  return terrainSettings;
}

function buildGui() {
  let gui = new GUI();
  let settings = {};
  settings.terrain = buildTerrain(gui);
  return settings;
}

export { buildGui };
