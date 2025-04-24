class Node {
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
    const newNode = new Node(value);
    
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
    return this.frontier.some(value => value.row === state.row && value.column === state.column);
  }

  isEmpty() {return this.frontier.length === 0;}

  size() {return this.frontier.length;}
}


class Queue {
  constructor() {
    this.frontier = new LinkedList();
  }

  enqueue(item) {this.frontier.add(item);}

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


export { Stack }; 