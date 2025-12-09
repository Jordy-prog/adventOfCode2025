const fs = require("fs");

function part1(junctionBoxes) {
  const circuitMap = createCircuitMap(junctionBoxes);
  const connections = determineConnections(junctionBoxes);
  connections.sort(smallestEuclidDistance);

  const firstThousandConnections = connections.slice(0, 1000);
  for (const connection of firstThousandConnections) {
    addConnection(connection, circuitMap);
  }

  return calculateResult(circuitMap);
}

function createCircuitMap(junctionBoxes) {
  const map = new Map();
  for (const box of junctionBoxes) {
    map.set(box, new Set([box]));
  }
  return map;
}

function determineConnections(junctionBoxes) {
  const result = [];
  for (let i = 0; i < junctionBoxes.length - 1; i++) {
    const box = junctionBoxes[i];
    const otherBoxes = junctionBoxes.slice(i + 1);
    result.push(...otherBoxes.map((otherBox) => [box, otherBox]));
  }
  return result;
}

function smallestEuclidDistance(connA, connB) {
  const distA = calculateEuclid(connA);
  const distB = calculateEuclid(connB);

  if (distA < distB) return -1;
  if (distA > distB) return 1;
  return 0;
}

function calculateEuclid(connection) {
  const [box1, box2] = connection;
  const [x1, y1, z1] = stringToCoords(box1);
  const [x2, y2, z2] = stringToCoords(box2);

  const xSquared = Math.pow((x1-x2), 2);
  const ySquared = Math.pow((y1-y2), 2);
  const zSquared = Math.pow((z1-z2), 2);

  return Math.sqrt(xSquared + ySquared + zSquared);
}

function stringToCoords(box) {
  return box.split(',').map(Number);
}

function addConnection(connection, circuitMap) {
  const [boxA, boxB] = connection;
  const circuitA = circuitMap.get(boxA);
  const circuitB = circuitMap.get(boxB);

  for (const box of circuitA) {
    const currentValue = circuitMap.get(box);
    const union = new Set([...currentValue, ...circuitB]);
    circuitMap.set(box, union);
  }

  for (const box of circuitB) {
    const currentValue = circuitMap.get(box);
    const union = new Set([...currentValue, ...circuitA]);
    circuitMap.set(box, union);
  }
}

function calculateResult(circuitMap) {
  const result = [];

  while (result.length !== 3) {
    const [key, largestCircuit] = getLargestCircuit(circuitMap);
    if (isUniqueCircuit(largestCircuit, result)) {
      result.push(largestCircuit);
    }
    circuitMap.delete(key);
  }

  return result.reduce((acc, curr) => curr.size * acc, 1);
}

function getLargestCircuit(circuitMap) {
  let largestKey = null;
  let largestCircuit = null;

  for (const [key, circuit] of circuitMap.entries()) {
    if (!largestCircuit || circuit.size > largestCircuit.size) {
      largestCircuit = circuit;
      largestKey = key;
    }
  }

  return [largestKey, largestCircuit];
}

function isUniqueCircuit(newCircuit, results) {
  for (const circuit of results) {
    if ([...newCircuit].some((box) => circuit.has(box))) return false;
  }
  return true;
}

const junctionBoxes = fs.readFileSync("input_day_8.txt", "utf-8").trim().split("\n");
console.log("Part 1:", part1(junctionBoxes));