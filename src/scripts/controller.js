export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.startRow = 2;
    this.startColumn = 2;
    this.endRow = 5;
    this.endColumn = 10;
    this.paused = false;
    this.finished = false;
    this.started = false;
    this.delay = 40;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  setup() {
    this.view.setup();
    this.createBoard();

    this.handleClicks();
    this.view.handleDrag((elementType, newRow, newColumn) => {
      this.updateElementPosition(elementType, newRow, newColumn);
    });
    this.view.elements.delay.addEventListener('change', () => {
      this.updateDelay();
    });

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
        newRow.push('shadow');
      }
      this.board.push(newRow);
    }

    this.board[this.startRow][this.startColumn] = 'seeker';
    this.board[this.endRow][this.endColumn] = 'hotl';

    this.view.drawBoard(this.board);
  }

  updateDelay() {
    this.delay = this.view.getDelay();
  }

  createPathFinder() {
    const algorithm = this.view.getAlgorithm();
    this.updateDelay();

    const pathFinder = this.model[algorithm]({
      board: this.board,
      start: { row: this.startRow, column: this.startColumn },
      end: { row: this.endRow, column: this.endColumn },
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
    this.board[data.currentState.row][data.currentState.column] = 'glimmer';
    this.view.updateCell(data.currentState.row, data.currentState.column, 'glimmer');
    this.finished = !!data.solution;

    if (!this.finished) {
      if (!this.paused) setTimeout(() => this.runAlgorithm(), this.delay);
    } else {
      console.log('The seeker has found the Heart of the Light');

      // IIFE async function to use sleep
      (async () => {
        // Wait for the exploration animation to finish
        await this.sleep(1000);

        for (const state of data.solution.states) {
          this.board[state.row][state.column] = 'glight';
          this.view.updateCell(state.row, state.column, 'glight');
          await this.sleep(this.delay);
        }

        // Wait for user to see the solution
        await this.sleep(5000);
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
    this.applyWalls();
    this.runAlgorithm();
  }

  stepForward() {
    if (typeof this.algorithm === 'undefined') {
      this.started = true;
      this.paused = true;
      this.finished = false;
      this.view.updateUIState(this.started, this.paused, this.finished);
      this.algorithm = this.createPathFinder();
      this.algorithm.initialize();
      this.applyWalls();
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
      this.updateDelay();
    }
  }

  stop() {
    // FIXME: Stop immediately while algorithm runs
    if (!this.paused) {
      this.pause();
    }
    this.view.updateUIState(this.started, this.paused, this.finished);

    console.log('Resetting the board...');
    this.resetAll();
    this.setup();
  }

  updateElementPosition(elementType, newRow, newColumn) {
    if (elementType === 'seeker') {
      this.board[this.startRow][this.startColumn] = 'shadow';
      this.startRow = newRow;
      this.startColumn = newColumn;
      this.board[this.startRow][this.startColumn] = 'seeker';
    } else {
      this.board[this.endRow][this.endColumn] = 'shadow';
      this.endRow = newRow;
      this.endColumn = newColumn;
      this.board[this.endRow][this.endColumn] = 'hotl';
    }
  }

  applyWalls() {
    const wallPositions = this.view.getWallPositions();
    for (const [row, column] of wallPositions) {
      this.board[row][column] = 'wall';
    }
  }
}
