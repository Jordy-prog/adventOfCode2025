const fs = require('fs');

function parseInput(filename) {
  const rawInput = fs.readFileSync(filename, 'utf-8');
  const ranges = rawInput.split(',');
  return ranges.map((range) => range.split('-').map((num) => Number.parseInt(num)));
}

function generateIncrement(lengthOfNumber) {
  if (!isEven(lengthOfNumber)) {
    lengthOfNumber++;
  }

  const numZeroesPerSide = (lengthOfNumber / 2) - 1;
  const numberString = '1' + '0'.repeat(numZeroesPerSide);
  return Number.parseInt(numberString + numberString);
}

function getMirrorValue(number, index) {
  const mirrorIndex = index + (number.length / 2);
  return Number.parseInt(number[mirrorIndex]);
}

function isEven(number) {
  return number % 2 === 0;
}

function checkEqualParts(numberString, partSize) {
  const strings = [];
  for (let i = 0; i < numberString.length / partSize; i++) {
    const start = i * partSize;
    strings.push(numberString.slice(start, start + partSize));
  }

  return strings.every((string, i, all) => {
    const nextIndex = i + 1;
    if (nextIndex >= all.length) {
      return true;
    } else {
      return string == all[nextIndex];
    }
  })
}

function isInvalidId(value) {
  const numberString = value.toString();
  
  for (let i = 1; i <= (numberString.length / 2); i++) {
    if(checkEqualParts(numberString, i)) {
      return true;
    }
  }
  return false;
}

function calculateTotalForRange(startValue, endValue) {
  let total = 0;
  let currentValue = startValue;
  while (currentValue <= endValue) {
    if (isInvalidId(currentValue)) {
      total += currentValue;
    }

    currentValue++;
  }

  return total;
}

function calculateInvalidIds(ranges) {
  let result = 0;

  for (const [startValue, endValue] of ranges) {
    result += calculateTotalForRange(startValue, endValue);
  }

  return result;
}

if (require.main === module) {
  const ranges = parseInput('input_day_2.txt');
  console.log("Result:", calculateInvalidIds(ranges));
}



module.exports = { generateIncrement };