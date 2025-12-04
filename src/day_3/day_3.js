const fs = require("fs");

function getJoltage(banks, getJoltageFunction) {
  let totalJoltage = 0;
  
  for (const bank of banks) {
    totalJoltage += getJoltageFunction(bank);
  }
  
  return totalJoltage;
}

function getHighestJoltagePart1(bank) {
  const firstPart = bank.slice(0, -1);
  const firstNumber = Math.max(...Array.from(firstPart).map(Number));
  const firstIndex = bank.indexOf(firstNumber);
  
  const secondPart = bank.slice(firstIndex + 1);
  const secondNumber = Math.max(...Array.from(secondPart).map(Number));
  
  return Number.parseInt(String(firstNumber) + String(secondNumber));
}

function getHighestJoltagePart2(bank) {
  let sequence = bank;
  let result = "";
  
  for (let i = 11; i >= 0; i--) {
    const subset = i > 0 ? sequence.slice(0, -i) : sequence;
    const number = Math.max(...Array.from(subset).map(Number));
    result += String(number);
    
    const index = sequence.indexOf(number);
    sequence = sequence.slice(index + 1);
  }
  
  return Number.parseInt(result);
}

const input = fs.readFileSync("input_day_3.txt", "utf-8").trim().split("\n");
console.log('Part 1:', getJoltage(input, getHighestJoltagePart1));
console.log('Part 2:', getJoltage(input, getHighestJoltagePart2));

module.exports = { getHighestJoltagePart2 };