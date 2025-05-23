import Algorithm from './model.js';
import { Node, Queue } from './util.js';

export default class BreadthFirstSearch extends Algorithm {
  constructor(config) {
    super(config);
    const { start, end } = config;

    this.startNode = new Node(start, null, null);
    this.endState = end;
  }

  initialize() {
    this.data = {
      currentState: null,
      solution: null,
    };

    this.explored = new Set();
    this.frontier = new Queue();
    this.frontier.enqueue(this.startNode);
  }

  step() {
    if (this.frontier.isEmpty()) {
      this.data.currentState = null;
      return this.data;
    }

    let node = this.frontier.dequeue();
    this.data.currentState = { row: node.state.row, column: node.state.column };

    if (node.state.row === this.endState.row && node.state.column === this.endState.column) {
      this.data.solution = this.getSolution(node);
      return this.data;
    }

    this.explored.add(this.getExploredKey(node.state));
    this.addNeighborsToFrontier(node);

    return this.data;
  }

  getSolution(node) {
    const actions = [];
    const states = [];

    while (node.parent !== null) {
      actions.push(node.action);
      states.push(node.state);
      node = node.parent;
    }
    actions.push(node.action);
    states.push(node.state);

    actions.reverse();
    states.reverse();
    const solution = { actions, states };

    return solution;
  }

  addNeighborsToFrontier(node) {
    const neighbors = this.getNeighbors(node);

    for (const [action, state] of Object.entries(neighbors)) {
      if (!this.frontier.containsState(state) && !this.explored.has(this.getExploredKey(state))) {
        const childNode = new Node(state, node, action);
        this.frontier.enqueue(childNode);
      }
    }
  }

  getExploredKey(state) {
    return `${state.row},${state.column}`;
  }

  getNeighbors(node) {
    const neighbors = {
      top: null,
      right: null,
      bottom: null,
      left: null,
    };

    const { row, column } = node.state;

    if (row > 0 && this.board[row - 1][column] !== 'wall') {
      neighbors.top = { row: row - 1, column: column };
    }
    if (row < this.board.length - 1 && this.board[row + 1][column] !== 'wall') {
      neighbors.bottom = { row: row + 1, column: column };
    }
    if (column > 0 && this.board[row][column - 1] !== 'wall') {
      neighbors.left = { row: row, column: column - 1 };
    }
    if (column < this.board[row].length - 1 && this.board[row][column + 1] !== 'wall') {
      neighbors.right = { row: row, column: column + 1 };
    }

    return Object.fromEntries(
      Object.entries(neighbors).filter(([action, state]) => state !== null)
    );
  }
}
