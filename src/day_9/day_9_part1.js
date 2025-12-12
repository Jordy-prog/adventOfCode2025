const fs = require("fs");

function part1(input) {
  const tiles = parseInput(input);
  const rectangleAreas = calculateRectangles(tiles);
  rectangleAreas.sort((a, b) => a-b).reverse();
  return rectangleAreas[0];
}

function parseInput(input) {
  return input.map((tile) => tile.split(",").map(Number));
}

function calculateRectangles(tiles) {
  const result = [];
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    const otherTiles = tiles.slice(i + 1);
    result.push(...otherTiles.map((otherTile) => calculateRectangleArea(tile, otherTile)));
  }
  return result;
}

function calculateRectangleArea(tileA, tileB) {
  const [xA, yA] = tileA;
  const [xB, yB] = tileB;
  const distX = Math.abs(xA - xB) + 1;
  const distY = Math.abs(yA - yB) + 1;
  
  return distX * distY;
}

const input = fs.readFileSync("input_day_9.txt", "utf-8").trim().split('\n');
console.log("Part 1:", part1(input));