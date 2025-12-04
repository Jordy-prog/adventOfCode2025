const fs = require('fs');

const input = fs.readFileSync('./input_1.txt', 'utf-8');
const lines = input.split(/\n/);

let current_value = 50;
let counter = 0;
for (const line of lines) {
  const direction = line.slice(0, 1);
  const initial_value = Number.parseInt(line.slice(1));
  const value = initial_value % 100 ;
  let encountered_zero = Math.floor(initial_value / 100);
  
  if (direction == 'L') {
    if (value !== 0 && current_value !== 0) {
      encountered_zero += (current_value - value) <= 0 ? 1 : 0;
    }
    current_value = ((current_value - value) + 100) % 100;
  } else {
    encountered_zero += Math.floor((current_value + value) / 100);
    current_value = (current_value + value) % 100;
  }

  counter += encountered_zero;
}

console.log(counter);
