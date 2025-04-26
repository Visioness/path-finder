import continueSvg from "../styles/images/resume.svg";
import pauseSvg from "../styles/images/pause.svg";

export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.startRow = 2;
    this.startColumn = 2;
    this.endRow = 3;
    this.endColumn = 10;
    this.paused = false;
    this.finished = false;
    this.started = false;
    this.setup();
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setup() {
    this.view.setup();
    this.createBoard();
    this.handleClicks();

    this.started = false;
    this.view.updateUIState(this.started, this.paused, this.finished);
  }

  resetAll() {
    delete this.algorithm;
    this.started = false;
    this.paused = false;
    this.finished = false;
    this.view.resetBoard();
  }

  createBoard() {
    const rowSize = this.view.rowSize;
    const columnSize = this.view.columnSize;
    this.board = [];
    
    for (let row = 0; row < rowSize; row++) {
      const newRow = [];      
      for (let column = 0; column < columnSize; column++) {
        newRow.push("shadow");
      }
      this.board.push(newRow);
    }

    this.board[this.startRow][this.startColumn] = "seeker";
    this.board[this.endRow][this.endColumn] = "hotl";
    
    this.view.drawBoard(this.board);
  }

  createPathFinder() {
    const pathFinder = this.model.dfs({
      board: this.board,
      start: { row: this.startRow, column: this.startColumn },
      end: { row: this.endRow, column: this.endColumn },
      onStep: (state) => this.view.updateCell(state.row, state.column, "glimmer"),
      onSolution: (state) => this.view.updateCell(state.row, state.column, "glight")
    });
    
    return pathFinder;
  }

  handleClicks() {
    this.view.handleHelperButtons(
      () => this.start(),
      () => this.stepForward(),
      () => this.pause(),
      () => this.resume(),
      () => this.stop()
    );
  }

  runAlgorithm() {
    const data = this.algorithm.step();
    // Render step
    this.board[data.currentState.row][data.currentState.column] = "glimmer";
    this.view.updateCell(data.currentState.row, data.currentState.column, "glimmer");
    this.finished = !!data.solution;
    
    if (!this.finished) {
      if (!this.paused) setTimeout(() => this.runAlgorithm(), 50);
    } else {
      console.log("The seeker has found the Heart of the Light");
      
      // IIFE async function to use sleep
      (async () => {
        for(const state of data.solution.states) {
          this.board[state.row][state.column] = "glight";
          this.view.updateCell(state.row, state.column, "glight");
          await this.sleep(30);
        }

        await this.sleep(2000);
        this.stop();
      })();
    }
  }
  
  start() {
    this.started = true;
    this.paused = false;
    this.finished = false;
    this.view.updateUIState(this.started, this.paused, this.finished);
    this.algorithm = this.createPathFinder();
    this.algorithm.initialize();
    this.runAlgorithm();
  }
  
  stepForward() {
    if (typeof this.algorithm === "undefined") {
      this.started = true;
      this.paused = true;
      this.finished = false;
      this.view.updateUIState(this.started, this.paused, this.finished);
      this.algorithm = this.createPathFinder();
      this.algorithm.initialize();
    }

    if (!this.finished) {
      this.runAlgorithm();
    }
  }

  pause() {
    this.paused = true;
    this.view.updateUIState(this.started, this.paused, this.finished);
  }
  
  resume() {
    if (this.paused && !this.finished) {
      this.paused = false;
      this.view.updateUIState(this.started, this.paused, this.finished);
      this.runAlgorithm();
    }
  }

  stop() {
    this.finished = true;
    this.view.updateUIState(this.started, this.paused, this.finished);

    console.log("Resetting the board...");
    this.resetAll();
    this.setup();
  }
}