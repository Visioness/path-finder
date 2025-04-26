import pauseSvg from "../styles/images/pause.svg";
import continueSvg from "../styles/images/resume.svg";

export default class Board {
  constructor() {
    this.cellSize = 36;
    this.padY = 20;
    this.padX = 10;
    this.borderWidth = 2;
    this.elements = {};
    this.elements.cells = {};
    this.elements.container = document.querySelector(".container-board");
    this.elements.board = this.elements.container.querySelector(".board");
  }
  
  setup() {
    this.getContainerSize();
    this.calculateBoardSize();
  }

  resetBoard() {
    this.elements.cells = {};
    this.clearBoard();
  }

  clearBoard() {
    this.elements.board.innerHTML = "";
  }

  getContainerSize() {
    this.containerWidth = window.getComputedStyle(this.elements.container).width;
    this.containerHeight = window.getComputedStyle(this.elements.container).height;
    
    this.containerWidth = Number(this.containerWidth.slice(0, -2));
    this.containerHeight = Number(this.containerHeight.slice(0, -2));
  }

  calculateBoardSize() {
    this.rowSize = this.calculateRowSize();
    this.columnSize = this.calculateColumnSize();

    this.boardWidth = this.columnSize * this.cellSize
    this.boardHeight = this.rowSize * this.cellSize

    this.elements.board.style.width = this.boardWidth;
    this.elements.board.style.height = this.boardHeight;
  }

  calculateRowSize() {
    // Padding and border included
    return Math.floor((this.containerHeight - (this.padY + this.borderWidth) * 2) / this.cellSize);
  }
  
  calculateColumnSize() {
    // Padding and border included
    return Math.floor((this.containerWidth - (this.padX + this.borderWidth) * 2) / this.cellSize);
  }

  drawBoard(boardState) {
    this.updateGridTemplate();
    
    for (let row = 0; row < this.rowSize; row++) {
      for (let column = 0; column < this.columnSize; column++) {
        const cell = this.createCell(row, column);
        cell.classList.add(boardState[row][column]);
        this.elements.board.appendChild(cell);
        this.elements.cells[`${row},${column}`] = cell;
      }
    }
  }

  updateGridTemplate() {
    this.elements.board.style.gridTemplateRows = `repeat(${this.rowSize}, minmax(${this.cellSize / 3 * 2}px, ${this.cellSize}px)`;
    this.elements.board.style.gridTemplateColumns = `repeat(${this.columnSize}, minmax(${this.cellSize / 3 * 2}px, ${this.cellSize}px)`;
  }

  createCell(row, column) {
    const cell = this.createElement("div", "cell", `cell|${row}-${column}`);
    cell.dataset.row = row;
    cell.dataset.column = column;

    return cell;
  }

  createElement(tagName, className = null, id = null) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (id) element.id = id;

    return element;
  }

  updateCell(row, column, className) {
    const cell = this.elements.cells[`${row},${column}`];
    cell.className = `cell ${className}`;
  }

  handleHelperButtons(startFunc, stepForwardFunc, pauseFunc, continueFunc, stopFunc) {
    // Remove previous event listeners if they exist
    if (this.clickHandler) {
      this.elements.helpers.removeEventListener("click", this.clickHandler);
    }
    
    this.elements.helpers = document.querySelector("#group-helpers");
    this.elements.helpers.start = this.elements.helpers.querySelector("#btn-start");
    this.elements.helpers.step = this.elements.helpers.querySelector("#btn-step");
    this.elements.helpers.pause = this.elements.helpers.querySelector("#btn-pause");
    this.elements.helpers.stop = this.elements.helpers.querySelector("#btn-stop");
    this.elements.helpers.pause.disabled = true;
    this.elements.helpers.stop.disabled = true;
    
    // Store the handler function so we can remove it later
    this.clickHandler = (event) => {
      const button = event.target.closest(".btn");
      
      if (button) {
        if (button.id === "btn-start") {
          startFunc();
        } else if (button.id === "btn-step") {
          stepForwardFunc();
        } else if (button.classList.contains("pause")) {
          pauseFunc();
        } else if (button.classList.contains("continue")) {
          continueFunc();
        } else if (button.id === "btn-stop") {
          stopFunc();
        }
      }
    };
    
    this.elements.helpers.addEventListener("click", this.clickHandler);
  }

  updateUIState(startedState, pausedState, finishedState) {
    const helpers = this.elements.helpers;

    let state;
    if (!startedState) {
      state = "idle";
    } else if (finishedState) {
      state = "finished";
    } else if (pausedState) {
      state = "paused";
    } else {
      state = "running";
    }

    switch (state) {
      case "idle":
        helpers.start.disabled = false;
        helpers.step.disabled = false;
        helpers.pause.disabled = true;
        helpers.stop.disabled = true;
        break;
        
      case "running":
        helpers.start.disabled = true;
        helpers.step.disabled = true;
        helpers.pause.disabled = false;
        helpers.stop.disabled = false;
        
        helpers.pause.classList.remove("continue");
        helpers.pause.classList.add("pause");
        helpers.pause.innerHTML = `<img width="24" height="24" src="${pauseSvg}" alt="Pause Button">`;
        break;
        
      case "paused":
        helpers.start.disabled = true;
        helpers.step.disabled = false;
        helpers.pause.disabled = false;
        helpers.stop.disabled = false;
        
        helpers.pause.classList.remove("pause");
        helpers.pause.classList.add("continue");
        helpers.pause.innerHTML = `<img width="24" height="24" src="${continueSvg}" alt="Continue Button">`;
        break;
        
      case "finished":
        helpers.start.disabled = true;
        helpers.step.disabled = true;
        helpers.pause.disabled = true;
        helpers.stop.disabled = false;
        break;
    }
  }
}