const fs = require("fs");

function part1(input) {
  const arrays = parseInputPart1(input);
  const length = arrays[0].length;
  
  let total = 0;
  for (let i = 0; i < length; i++) {
    total += calculateResult(i, arrays);
  }

  return total;
}

function part2(input) {
  const arrays = parseInputPart2(input);
  const chunks = chunkify(arrays);

  let total = 0;
  for (const chunk of chunks) {
    total += calculateChunkResult(chunk);
  }

  return total;
}

function chunkify(arrays) {
  const length = arrays[0].length;

  const chunks = [];
  let chunkStart = 0;
  let chunkEnd = 0;
  for (let i = 0; i < length; i++) {
    chunkEnd = i;
    if (isBoundary(i, arrays)) {
      const chunk = createChunk(arrays, chunkStart, chunkEnd);
      chunks.push(chunk);
      chunkStart = i + 1;
    }
  }

  chunks.push(createChunk(arrays, chunkStart, chunkEnd + 1));

  return chunks
}

function isBoundary(index, arrays) {
  return arrays.every((array) => array[index] === ' ');
}

function createChunk(arrays, startIndex, endIndex) {
  return arrays.map((array) => array.slice(startIndex, endIndex));
}

function calculateChunkResult(chunk) {
  const operator = getOperator(chunk[chunk.length - 1]);
  const numbers = getNumbers(chunk.slice(0, -1));

  if (operator == '*') {
    return multiplyNumbers(numbers);
  } else { // operator === '+'
    return addNumbers(numbers);
  }
}

function getOperator(array) {
  return array.filter((string) => string !== ' ')[0];
}

function getNumbers(arrays) {
  const length = arrays[0].length;

  const result = [];
  for (let i = 0; i < length; i++) {
    const number = getNumber(i, arrays);
    result.push(number);
  }
  
  return result;
}

function getNumber(index, arrays) {
  const strings = arrays.map((array) => array[index]);
  const numberString = strings.join('');
  const number = Number.parseInt(numberString.trim());
  return number;
}

function calculateResult(index, arrays) {
  const operator = arrays[arrays.length - 1][index];
  const numbers = arrays.slice(0, -1).map((array) => array[index]);

  if (operator == '*') {
    return multiplyNumbers(numbers);
  } else { // operator === '+'
    return addNumbers(numbers);
  }
}

function multiplyNumbers(numbers) {
  return numbers.reduce((acc, currentNumber) => currentNumber * acc, 1);
}

function addNumbers(numbers) {
  return numbers.reduce((acc, currentNumber) => currentNumber + acc, 0);
}

function parseInputPart1(input) {
  const arrays = input.map((line) => {
    return line.split(/\s+/);
  });
  const operators = arrays.pop();
  const arraysOfNumbers = arrays.map((array) => array.map(Number));
  return [...arraysOfNumbers, operators];
}

function parseInputPart2(input) {
  const arrays = input.map((line) => Array.from(line));
  return arrays;
}

const input = fs.readFileSync("input_day_6.txt", "utf-8").trim().split("\n");
console.log("Part 1:", part1(input));
console.log("Part 2:", part2(input));