const fs = require("fs");

function part2(input) {
  const matrix = createMatrix(input);
  const start = determineStart(matrix);
  let nodeMap = new Map([[toKey(start), 1]]);

  for (let i = 1; i < matrix.length; i++) {
    const newMap = new Map();
    for (const [key, amount] of nodeMap.entries()) {
      const node = fromKey(key);
      const children = getChildren(node, matrix);
      
      for (const child of children) {
        const currentValue = newMap.get(toKey(child)) ?? 0;
        newMap.set(toKey(child), currentValue + amount);
      }
    }

    nodeMap = new Map(newMap);
  }

  return calculateTotal(nodeMap);
}

function createMatrix(input) {
  return input.map((line) => Array.from(line));
}

function determineStart(matrix) {
  const startRow = 0;
  const firstLine = matrix[startRow];
  const startColumn = firstLine.indexOf('S');
  return [startRow, startColumn];
}

function getChildren(node, matrix) {
  const [row, col] = node;
  if (!isValidNode([row+1, col], matrix)) {
    return [];
  }

  const nextNode = matrix[row+1][col];

  const result = [];
  if (nextNode == '.') {
    result.push([row+1, col]);
  } else {
    const nextLeft = [row+1, col-1];
    const nextRight = [row+1, col+1];

    if (isValidNode(nextLeft, matrix)) result.push(nextLeft);
    if (isValidNode(nextRight, matrix)) result.push(nextRight);
  }

  return result;
}

function isValidNode(node, matrix) {
  const [row, col] = node;
  const rowMax = matrix.length - 1;
  const colMax = matrix[0].length - 1;

  if (row < 0 || col < 0) return false;
  return row <= rowMax && col <= colMax;
}

function toKey(coords) {
  const [row, col] = coords;
  return `${row},${col}`;
}

function fromKey(key) {
  return key.split(',').map(Number);
}

function calculateTotal(nodeMap) {
  let total = 0;
  for (const value of nodeMap.values()) {
    total += value;
  }
  return total;
}

const input = fs.readFileSync("input_day_7.txt", "utf-8").trim().split("\n");
console.log("Part 2:", part2(input));