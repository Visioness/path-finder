import pauseSvg from "../styles/images/pause.svg";
import continueSvg from "../styles/images/resume.svg";

export default class Board {
  constructor() {
    this.boardContainer = document.querySelector(".container-board");
    this.boardElement = this.boardContainer.querySelector(".board");
    this.cellSize = 36;
    this.containerPaddingVertical = 20;
    this.containerPaddingHorizontal = 10;
    this.boardBorderWidth = 2;
    this.getContainerSize();
    this.calculateBoardSize();
    this.cells = {};
  }
  
  getContainerSize() {
    this.containerWidth = window.getComputedStyle(this.boardContainer).width;
    this.containerHeight = window.getComputedStyle(this.boardContainer).height;
    
    this.containerWidth = Number(this.containerWidth.slice(0, -2));
    this.containerHeight = Number(this.containerHeight.slice(0, -2));
  }

  calculateBoardSize() {
    this.rowSize = this.calculateRowSize();
    this.columnSize = this.calculateColumnSize();

    this.boardWidth = this.columnSize * this.cellSize
    this.boardHeight = this.rowSize * this.cellSize

    this.boardElement.style.width = this.boardWidth;
    this.boardElement.style.height = this.boardHeight;
  }

  calculateRowSize() {
    // Padding and border included
    return Math.floor((this.containerHeight - (this.containerPaddingVertical + this.boardBorderWidth) * 2) / this.cellSize);
  }
  
  calculateColumnSize() {
    // Padding and border included
    return Math.floor((this.containerWidth - (this.containerPaddingHorizontal + this.boardBorderWidth) * 2) / this.cellSize);
  }

  drawBoard(boardState) {
    this.updateGridTemplate();
    
    for (let row = 0; row < this.rowSize; row++) {
      for (let column = 0; column < this.columnSize; column++) {
        const cell = this.createCell(row, column);
        cell.classList.add(boardState[row][column]);
        this.boardElement.appendChild(cell);
        this.cells[`${row},${column}`] = cell;
      }
    }
  }
  
  updateGridTemplate() {
    this.boardElement.style.gridTemplateRows = `repeat(${this.rowSize}, minmax(${this.cellSize / 3 * 2}px, ${this.cellSize}px)`;
    this.boardElement.style.gridTemplateColumns = `repeat(${this.columnSize}, minmax(${this.cellSize / 3 * 2}px, ${this.cellSize}px)`;
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
    const cell = this.cells[`${row},${column}`];
    cell.className = `cell ${className}`;
  }

  handleHelperButtons(startFunc, stepForwardFunc, pauseFunc, continueFunc, stopFunc) {
    const helpers = document.querySelector("#group-helpers");
    const startButton = helpers.querySelector("#btn-start");
    const pauseButton = helpers.querySelector("#btn-pause");
    const stopButton = helpers.querySelector("#btn-stop");
    pauseButton.disabled = true;
    stopButton.disabled = true;
    
    helpers.addEventListener("click", (event) => {
      const button = event.target.closest(".btn");
      
      if (button) {
        if (button.id === "btn-start") {
          // Start button
          button.disabled = true;
          pauseButton.disabled = false;
          stopButton.disabled = false;
          startFunc();
        } else if (button.id === "btn-step") {
          // Step Forward
          stepForwardFunc();
        } else if (button.classList.contains("pause")) {
          // Pause button
          button.classList.remove("pause");
          button.classList.add("continue");
          button.innerHTML = `<img width="24" height="24" src="${continueSvg}" alt="Continue Button">`;
          pauseFunc();
        } else if (button.classList.contains("continue")) {
          // Continue button
          button.classList.remove("continue");
          button.classList.add("pause");
          button.innerHTML = `<img width="24" height="24" src="${pauseSvg}" alt="Pause Button">`;
          continueFunc();
        } else if (button.id === "btn-stop") {
          // Stop button
          pauseButton.disabled = true;
          stopButton.disabled = true;
          stopFunc();
        }
      }
    });
  }
}