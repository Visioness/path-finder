export default class Algorithm {
  constructor(config) {
    this.onStep = config.onStep || null;
    this.board = config.board;
  }

  initialize() {
    // Basic setup for each algorithm
  }
  
  step() {
    // Main step for each algorithm
    // Returns a solution when found, null otherwise
  }
}