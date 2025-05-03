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
    this.containerWidth = window.getComputedStyle(
      this.elements.container
    ).width;
    this.containerHeight = window.getComputedStyle(
      this.elements.container
    ).height;

    this.containerWidth = Number(this.containerWidth.slice(0, -2));
    this.containerHeight = Number(this.containerHeight.slice(0, -2));
  }

  calculateBoardSize() {
    this.rowSize = this.calculateRowSize();
    this.columnSize = this.calculateColumnSize();

    this.boardWidth = this.columnSize * this.cellSize;
    this.boardHeight = this.rowSize * this.cellSize;

    this.elements.board.style.width = this.boardWidth;
    this.elements.board.style.height = this.boardHeight;
  }

  calculateRowSize() {
    // Padding and border included
    return Math.floor(
      (this.containerHeight - (this.padY + this.borderWidth) * 2) /
        this.cellSize
    );
  }

  calculateColumnSize() {
    // Padding and border included
    return Math.floor(
      (this.containerWidth - (this.padX + this.borderWidth) * 2) / this.cellSize
    );
  }

  drawBoard(boardState) {
    this.updateGridTemplate();

    for (let row = 0; row < this.rowSize; row++) {
      for (let column = 0; column < this.columnSize; column++) {
        const cell = this.createCell(row, column);
        const state = boardState[row][column];

        if (state === "seeker" || state === "hotl") {
          const child = this.createElement("div", `${state} draggable`, state);
          if (state === "seeker") this.elements.start = child;
          else this.elements.end = child;
          cell.appendChild(child);
        }

        this.elements.board.appendChild(cell);
        this.elements.cells[`${row},${column}`] = cell;
      }
    }
  }

  updateGridTemplate() {
    this.elements.board.style.gridTemplateRows = `repeat(${
      this.rowSize
    }, minmax(${(this.cellSize / 3) * 2}px, ${this.cellSize}px)`;
    this.elements.board.style.gridTemplateColumns = `repeat(${
      this.columnSize
    }, minmax(${(this.cellSize / 3) * 2}px, ${this.cellSize}px)`;
  }

  createCell(row, column) {
    const cell = this.createElement(
      "div",
      "cell shadow",
      `cell|${row}-${column}`
    );
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

  handleHelperButtons(
    startFunc,
    stepForwardFunc,
    pauseFunc,
    continueFunc,
    stopFunc
  ) {
    // Remove previous event listeners if they exist
    if (this.clickHandler) {
      this.elements.helpers.removeEventListener("click", this.clickHandler);
    }

    this.elements.helpers = document.querySelector("#group-helpers");
    this.elements.helpers.start =
      this.elements.helpers.querySelector("#btn-start");
    this.elements.helpers.step =
      this.elements.helpers.querySelector("#btn-step");
    this.elements.helpers.pause =
      this.elements.helpers.querySelector("#btn-pause");
    this.elements.helpers.stop =
      this.elements.helpers.querySelector("#btn-stop");

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

  handleDrag(updatePositionCallback) {
    // Clean up any previous listeners to prevent duplicates
    if (this.dragHandlers) {
      document.removeEventListener(
        "mouseup",
        this.dragHandlers.documentMouseUp
      );
      document.removeEventListener(
        "mousemove",
        this.dragHandlers.documentMouseMove
      );
      this.elements.board.removeEventListener(
        "mousedown",
        this.dragHandlers.boardMouseDown
      );
    }

    // Store handlers for later cleanup
    this.dragHandlers = {
      boardMouseDown: (e) => {
        const target = e.target;
        if (target.classList.contains("draggable")) {
          this.isDragging = true;
          this.elements.dragged = target;
          this.elements.dragged.classList.add("dragging");
          this.elements.lastDragSpot = target.parentNode;

          // Prevent text selection during drag
          e.preventDefault();
        }
      },

      documentMouseMove: (e) => {
        if (!this.isDragging) return;

        // Find the cell under the mouse pointer
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const cellsUnderMouse = document
          .elementsFromPoint(mouseX, mouseY)
          .filter((el) => el.classList && el.classList.contains("cell"));

        if (cellsUnderMouse.length > 0) {
          const cellUnderMouse = cellsUnderMouse[0];

          // Only move if we're over a new cell
          if (cellUnderMouse !== this.elements.lastDragSpot) {
            // Remove wall if present
            if (cellUnderMouse.classList.contains("wall")) {
              cellUnderMouse.classList.remove("wall");
            }

            // Move dragged element to new cell
            cellUnderMouse.appendChild(this.elements.dragged);
            this.elements.lastDragSpot = cellUnderMouse;
          }
        }
      },

      documentMouseUp: (e) => {
        if (this.isDragging) {
          this.elements.dragged.classList.remove("dragging");

          // Mark the new position of the element on the board
          const newCell = this.elements.dragged.parentNode;
          const newRow = parseInt(newCell.dataset.row);
          const newColumn = parseInt(newCell.dataset.column);

          const elementType = this.elements.dragged.classList.contains("seeker")
            ? "seeker"
            : "hotl";

          updatePositionCallback(elementType, newRow, newColumn);

          this.isDragging = false;
          this.elements.dragged = null;
        }
      },
    };

    // Add event listeners
    this.elements.board.addEventListener(
      "mousedown",
      this.dragHandlers.boardMouseDown
    );
    document.addEventListener("mousemove", this.dragHandlers.documentMouseMove);
    document.addEventListener("mouseup", this.dragHandlers.documentMouseUp);
  }
}
