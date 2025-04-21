export default class Algorithm {
  constructor(startPoint, endPoint) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.paused = false;
    this.finished = false;
    this.visitedNodes = [];
    this.currentPath = []; 
  }

  initialize() {
    // Basic setup for each algorithm
  }

  keepRunning() {
    if (!this.paused && !this.finished) {
      this.step();

      if (!this.finished) {
        requestAnimationFrame(this.keepRunning());
      } else {
        console.log("The seeker has found the Heart of the Light")
      }
    }
  }

  step () {
    // Main step for each algorithm
  }

  start() {
    this.finished = false;
    this.paused = false;
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
    this.finished = false;
    this.paused = false;
  }

  getPath() {
    return this.currentPath;
  }
}
