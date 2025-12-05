const fs = require("fs");

function part1(input) {
  const { ranges, ingredients } = parseInput(input);
  
  const total = ingredients.reduce((acc, curr) => {
    if (isFresh(curr, ranges)) {
      acc++;
    }
    return acc;
  }, 0)

  return total;
}

function part2(input) {
  const { ranges, ingredients } = parseInput(input);

  ranges.sort(compareRanges);
  const numAllowedFreshIds = calculateFreshIds(ranges);
  return numAllowedFreshIds;
}

function compareRanges(rangeA, rangeB) {
  const startValueA = rangeA[0];
  const startValueB = rangeB[0];

  return startValueA < startValueB ? -1 : 1;
}

function calculateFreshIds(ranges) {
  let total = 0;
  let [currentStart, currentEnd] = ranges[0];

  for (const [start, end] of ranges) {
    if (start <= currentEnd) {
      currentEnd = Math.max(currentEnd, end);
    } else {
      total += currentEnd - currentStart + 1;
      currentStart = start;
      currentEnd = end;
    }
  }

  total += currentEnd - currentStart + 1;

  return total;
}

function isFresh(number, ranges) {
  return ranges.some((range) => isInRange(number, range));
}

function isInRange(number, range) {
  const [startValue, endValue] = range;
  return (number >= startValue && number <= endValue);
}

function parseInput(input) {
  let ranges = input.filter((line) => line.includes("-"));
  ranges = ranges.map((range) => range.split('-').map(Number))
  let ingredients = input.filter((line) => !line.includes("-") && line.length > 0);
  ingredients = ingredients.map(Number);
  return { ranges, ingredients };
}

const input = fs.readFileSync("input_day_5.txt", "utf-8").trim().split("\n");
console.log("Part 1:", part1(input));
console.log("Part 2:", part2(input));

module.exports = { part1, isFresh, isInRange };