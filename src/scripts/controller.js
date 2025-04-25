export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.setup();
  }
  
  setup() {
    this.createBoard();
    this.handleClicks();
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

    this.board[5][2] = "seeker";
    this.board[6][16] = "hotl";

    this.view.drawBoard(this.board);
  }

  createPathFinder() {
    const pathFinder = this.model.dfs({
      board: this.board,
      start: { row: 5, column: 2 },
      end: { row: 6, column: 16 },
      onStep: (state) => this.view.updateCell(state.row, state.column, "glimmer")
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


  start() {
    this.algorithm = this.createPathFinder();
    this.algorithm.start();
  }

  stepForward() {
    if (typeof this.algorithm === "undefined") {
      this.algorithm = this.createPathFinder();
      this.algorithm.initialize();
    }

    if(!this.algorithm.finished) {
      const solution = this.algorithm.step();
      this.algorithm.finished = !!solution;
    } else {
      this.algorithm.stop();
    }
  }

  pause() {
    this.algorithm.pause();
  }

  resume() {
    this.algorithm.resume();
  }

  stop() {
    this.algorithm.stop();
  }
}
