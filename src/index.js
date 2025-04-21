import "./styles/style.css";
import Board from "./scripts/view.js";
import Controller from "./scripts/controller.js";

// Algorithms
import DepthFirstSearch from "./scripts/dfs.js";

const board = new Board();
const algorithms = {
  dfs: () => {
    return new DepthFirstSearch();
  }
}

const controller = new Controller(algorithms, board);