import "./styles/style.css";
import Board from "./scripts/view.js";
import Controller from "./scripts/controller.js";

// Algorithms
import DepthFirstSearch from "./scripts/dfs.js";
import BreadthFirstSearch from "./scripts/bfs.js";

const board = new Board();
const algorithms = {
  dfs: (config) => {
    return new DepthFirstSearch(config);
  },
  bfs: (config) => {
    return new BreadthFirstSearch(config);
  },
};

const controller = new Controller(algorithms, board);
window.addEventListener("load", () => {
  controller.setup();
});
