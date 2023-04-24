const status = { running: false, step: 0 };

function loop() {}

function start() {
  status.running = true;
}

function stop() {
  status.running = false;
}

function reset() {
  status.running = false;
  status.step = 0;
}

function step() {
  if (!status.running) {
    return;
  }

  console.log("Stepping!");
}

export { start, stop, reset, step };
