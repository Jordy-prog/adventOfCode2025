const fs = require("fs");

function part2(input) {
  const tiles = parseInput(input);
  const boundaries = getFloorBoundary(tiles);
  const rectangles = calculateRectangles(tiles); // map of size -> cornerpoints

  let i = 0;
  for (const [rectangle, area] of rectangles.entries()) {
    if (isValidRectangle(rectangle, boundaries, tiles)) {
      return area;
    }

    console.log(`${i}/${rectangles.size}`);
    i++;
  }
}

function parseInput(input) {
  return input.map((tile) => tile.split(",").map(Number));
}

function getFloorBoundary(tiles) {
  const result = [];
  for (let i = 0; i < tiles.length - 1; i++) {
    const tile = tiles[i];
    const nextTile = tiles[i + 1];
    const boundary = getBoundaryTiles(tile, nextTile);
    result.push(boundary);
  }

  // Add boundary between last and first
  result.push(getBoundaryTiles(tiles[0], tiles[tiles.length - 1]));
  return result;
}

function getBoundaryTiles(tileA, tileB) {
  const [xA, yA] = tileA;
  const [xB, yB] = tileB;

  const sortedX = [xA,xB].toSorted((a, b) => a - b);
  const sortedY = [yA,yB].toSorted((a, b) => a - b);

  return [sortedX, sortedY];
}

// Change to add it to a map, so we know the corner points
function calculateRectangles(tiles) {
  const result = [];
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    const otherTiles = tiles.slice(i + 1);
    result.push(...otherTiles.map((otherTile) => [[tile, otherTile], calculateRectangleArea(tile, otherTile)]));
  }
  result.sort((a, b) => a[1] - b[1]).reverse();
  return new Map(result);
}

function calculateRectangleArea(tileA, tileB) {
  const [xA, yA] = tileA;
  const [xB, yB] = tileB;
  const distX = Math.abs(xA - xB) + 1;
  const distY = Math.abs(yA - yB) + 1;
  
  return distX * distY;
}

function isValidRectangle(rectangle, boundaries, cornerTiles) {
  const [cornerA, cornerB] = rectangle;
  const [xA, yA] = cornerA;
  const [xB, yB] = cornerB;

  // Heuristic: Check points around other corners within rectangle first
  const embeddedCornerPoints = getEmbeddedCornerPoints(rectangle, cornerTiles);
  if (!embeddedCornerPoints.every((tile) => withinBoundaries(tile, boundaries))) return false;

  const sideOne = Array.from(Array(Math.max(xA, xB) + 1).keys()).slice(Math.min(xA, xB)).map((x) => [x, yA]);
  const sideTwo = Array.from(Array(Math.max(xA, xB) + 1).keys()).slice(Math.min(xA, xB)).map((x) => [x, yB]);
  const sideThree = Array.from(Array(Math.max(yA, yB) + 1).keys()).slice(Math.min(yA, yB)).map((y) => [xA, y]);
  const sideFour = Array.from(Array(Math.max(yA, yB) + 1).keys()).slice(Math.min(yA, yB)).map((y) => [xB, y]);

  return sideOne.every((tile) => withinBoundaries(tile, boundaries)) &&
  sideTwo.every((tile) => withinBoundaries(tile, boundaries)) &&
  sideThree.every((tile) => withinBoundaries(tile, boundaries)) &&
  sideFour.every((tile) => withinBoundaries(tile, boundaries))
}

function withinBoundaries(tile, boundaries) {
  const [x, y] = tile;

  let left, right, up, down = false;
  for (const [[minX, maxX], [minY, maxY]] of boundaries) {
    if (minX <= x && minY <= y && y <= maxY) left = true;
    if (maxX >= x && minY <= y && y <= maxY) right = true;
    if (minY <= y && minX <= x && x <= maxX) down = true;
    if (maxY >= y && minX <= x && x <= maxX) up = true;

    if (left && right && up && down) return true;
  }

  return false;
}

// Heuristic to speed it up
function getEmbeddedCornerPoints(rectangle, cornerTiles) {
  const [cornerA, cornerB] = rectangle;
  const [xA, yA] = cornerA;
  const [xB, yB] = cornerB;
  const rangeX = [xA, xB].sort((a, b) => a - b);
  const rangeY = [yA, yB].sort((a, b) => a - b);

  const embeddedCorners = cornerTiles.filter(([cornerX, cornerY]) => rangeX[0] < cornerX && cornerX < rangeX[1] && rangeY[0] < cornerY && cornerY < rangeY[1]);
  return embeddedCorners.flatMap(([x, y]) => [
      [x - 1, y - 1],
      [x - 1, y],
      [x - 1, y + 1],
      [x, y - 1],
      [x, y],
      [x, y + 1],
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1],
    ])
}

const input = fs.readFileSync("input_day_9.txt", "utf-8").trim().split('\n');
console.log("Part 2:", part2(input));