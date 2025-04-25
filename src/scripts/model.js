export default class Algorithm {
  constructor(config) {
    this.paused = false;
    this.finished = false;
    this.onStep = config.onStep || null;
    this.board = config.board;
  }

  initialize() {
    // Basic setup for each algorithm
  }
  
  step () {
    // Main step for each algorithm
  }

  keepRunning() {
    if (!this.paused && !this.finished) {
      const solution = this.step();
      this.finished = !!solution;

      if (!this.finished) {
        setTimeout(() => this.keepRunning(), 70);
      } else {
        console.log("The seeker has found the Heart of the Light")
        this.stop();
      }
    }
  }

  start() {
    this.initialize();
    this.keepRunning();
  }

  pause() {
    this.paused = true;
  }

  resume() {
    if (this.paused && !this.finished) {
      this.paused = false;
      this.keepRunning();
    }
  }

  stop() {
    // TODO: Fix board resetting
    this.finished = true;
    this.paused = true;
  }
}
