import Algorithm from "./model.js";
import { Stack } from "./util.js";


class Node {
  constructor(state, parent, action) {
    this.state = state;
    this.parent = parent;
    this.action = action;
  }
}


export default class DepthFirstSearch extends Algorithm {
  constructor(config) {
    super(config);
    const { start, end } = config;

    this.startNode = new Node(start, null, null);
    this.endState = end;
  }
  
  initialize() {
    this.explored = new Set();
    this.frontier = new Stack();
    this.frontier.push(this.startNode);
  }

  step() {
    if (this.frontier.isEmpty()) return null;
  
    let node = this.frontier.pop();
  
    if (node.state.row === this.endState.row && node.state.column === this.endState.column) {   
      return this.getSolution(node);
    }
  
    this.explored.add(this.getExploredKey(node.state));
    this.addNeighborsToFrontier(node);

    // Render step
    this.board[node.state.row][node.state.column] = "glimmer";
    this.onStep(node.state);
  }

  getSolution(node) {
    const actions = [];
    const cells = [];

    while (node.parent !== null) {
      actions.push(node.action);
      cells.push(node.state);
      node = node.parent;
    }

    actions.reverse();
    cells.reverse();
    const solution = { actions, cells };

    // Render path
    cells.forEach(state => {
      this.board[state.row][state.column] = "glight";
      this.onSolution(state);
    });

    return solution;
  }

  addNeighborsToFrontier(node) {
    const neighbors = this.getNeighbors(node);

    for (const [action, state] of Object.entries(neighbors)) {
      if (!this.frontier.containsState(state) && !this.explored.has(this.getExploredKey(state))) {
        const childNode = new Node(state, node, action);
        this.frontier.push(childNode);
      }
    }
  }

  getExploredKey(state) {
    return `${state.row},${state.column}`;
  }

  getNeighbors(node) {
    const neighbors = {
      top: null,
      bottom: null,
      left: null,
      right: null
    }
    
    const { row, column } = node.state;

    if (row > 0) neighbors.top = {row: row - 1, column: column};  
    if (row < this.board.length - 1) neighbors.bottom = {row: row + 1, column: column};
    if (column > 0) neighbors.left = {row: row, column: column - 1};
    if (column < this.board[row].length - 1) neighbors.right = {row: row, column: column + 1};

    return Object.fromEntries(
      Object.entries(neighbors).filter(([action, state]) => state !== null)
    );
  }
}