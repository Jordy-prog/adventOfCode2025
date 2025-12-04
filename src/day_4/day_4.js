const fs = require("fs");

function generateMatrix(input) {
  return input.map(line => Array.from(line));
}

function part1(matrix) {
  let total = 0;
  for (const [i, row] of matrix.entries()) {
    for (const [j, cell] of row.entries()) {
      if (isAccessible(cell, [i, j], matrix)) {
        total++;
      }
    }
  }

  return total;
}

function part2(matrix) {
  let total = 0;
  let coordsToRemove = [];

  do {
    coordsToRemove.forEach((coords) => removeRoll(coords, matrix));
    coordsToRemove = [];

    // Determine new rolls to remove
    for (const [i, row] of matrix.entries()) {
      for (const [j, cell] of row.entries()) {
        if (isAccessible(cell, [i, j], matrix)) {
          total++;
          coordsToRemove.push([i, j]);
        }
      }
    }
  } while (coordsToRemove.length !== 0);

  return total;
}

function removeRoll([row, col], matrix) {
  matrix[row][col] = '.'; 
}

function isAccessible(cell, coords, matrix) {
  if (!isPaperRoll(coords, matrix)) return false;

  let [row, col] = coords;
  const indexesToCheck = [
    [row - 1, col - 1], [row - 1, col], [row - 1, col + 1],
    [row, col - 1], [row, col + 1],
    [row + 1, col - 1], [row + 1, col], [row + 1, col + 1],
  ]

  const surroundingRolls = indexesToCheck.filter((coords) => isPaperRoll(coords, matrix)).length;
  return surroundingRolls < 4;
}

function isPaperRoll([row, col], matrix) {
  if (row < 0 || row >= matrix.length) return false;
  if (col < 0 || col >= matrix[0].length) return false;
  return matrix[row][col] === '@';
}

const input = fs.readFileSync("input_day_4.txt", "utf-8").trim().split("\n");
const matrix = generateMatrix(input);
console.log("Part 1:", part1(matrix));
console.log("Part 2:", part2(matrix));