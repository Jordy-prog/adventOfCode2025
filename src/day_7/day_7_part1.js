const fs = require("fs");

function part1(input) {
  const matrix = createMatrix(input);
  const start = determineStart(matrix);
  const queue = [start];

  let total = 0;
  while(queue.length !== 0) {
    const node = queue.shift();
    if (nextNodeIsSplitter(node, matrix)) total++;

    const newNodes = getChildren(node, matrix);

    for (const node of newNodes) {
      if (!queue.some((coords) => JSON.stringify(coords) == JSON.stringify(node))) {
        queue.push(node);
      }
    }
  }

  return total;
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

function nextNodeIsSplitter(node, matrix) {
  const [row, col] = node;
  if (!isValidNode([row+1, col], matrix)) return false;
  return matrix[row+1][col] == '^';
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

const input = fs.readFileSync("input_day_7.txt", "utf-8").trim().split("\n");
console.log("Part 1:", part1(input));