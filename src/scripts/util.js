class Node {
  constructor(state, parent, action) {
    this.state = state;
    this.parent = parent;
    this.action = action;
  }
}

class LinkedListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}


class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  append(value) {
    const newNode = new LinkedListNode(value);
    
    if (this.head === null) {
      this.head = newNode;
      this.tail = this.head;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.size++;
  }

  popFromTail() {
    if (this.isEmpty()) throw new Error("No items in the Linked List.");
    else {
      let current = this.head;
      while (current.next !== this.tail) current = current.next;
  
      const poppedValue = this.tail.value;
      this.tail = current;
      this.tail.next = null;
  
      return poppedValue;
    }
  }

  popFromHead() {
    if (this.isEmpty()) throw new Error("No items in the Linked List.");
    else {
      const item = this.head;
      this.head = this.head.next;
      
      return item.value;
    }
  }

  isEmpty() {return this.size === 0;}
}


class Stack {
  constructor() {
    this.frontier = [];
  }
  
  push(item) {this.frontier.push(item);}

  pop() {
    if (this.isEmpty()) throw new Error("No items in the Stack.");
    return this.frontier.pop();
  }

  peek() {
    if (this.isEmpty()) throw new Error("No items in the Stack.");
    return this.frontier[this.frontier.length - 1];
  }

  containsState(state) {
    return this.frontier.some(node => 
      node.state.row === state.row &&
      node.state.column === state.column
    );
  }

  isEmpty() {return this.frontier.length === 0;}

  size() {return this.frontier.length;}
}


class Queue {
  constructor() {
    this.frontier = [];
  }
  
  enqueue(item) {
    this.frontier.push(item);
  }

  dequeue() {
    if (this.isEmpty()) throw new Error("No items in the Queue.");
    return this.frontier.shift();
  }

  containsState(state) {
    return this.frontier.some(node => 
      node.state.row === state.row &&
      node.state.column === state.column
    );
  }

  isEmpty() {
    return this.frontier.length === 0;
  }

  size() {
    return this.frontier.length;
  }
}


class QueueOptimized {
  constructor() {
    this.frontier = new LinkedList();
  }

  enqueue(item) {this.frontier.append(item);}

  dequeue() {
    if (this.isEmpty()) throw new Error("No items in the Queue.");
    else return this.frontier.popFromHead();
  }

  back() {
    if (this.isEmpty()) throw new Error("No items in the Queue.");
    else return this.frontier.tail;
  }

  front() {
    if (this.isEmpty()) throw new Error("No items in the Queue.");
    else return this.frontier.head;
  }

  isEmpty() {return this.frontier.size === 0;}

  size() {return this.frontier.size;}
}


export { Node, Stack, Queue }; 