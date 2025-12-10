// Solution for day 8 of advent of code 2025

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type Point = {
    x: number,
    y: number,
    z: number
}

type Distance = {
    first: string,
    second: string,
    distance: number
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const points = lines.map(line => {
        const [x, y, z] = line.split(",");
        return { x: Number(x), y: Number(y), z: Number(z) } as Point;
    });
    return points;
};

const toKey = (point: Point): string => `${point.x},${point.y},${point.z}`;

function getDistances(input: Point[]) {
    const distances: Distance[] = [];

    for (let findex = 0; findex < input.length; findex++) {
        const first = input[findex];
        for (let sindex = findex + 1; sindex < input.length; sindex++) {
            const second = input[sindex];
            const dx = first.x - second.x;
            const dy = first.y - second.y;
            const dz = first.z - second.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            distances.push({
                first: toKey(first),
                second: toKey(second),
                distance: distance
            });
        }
    }

    distances.sort((a, b) => a.distance - b.distance);
    return distances;
}

const partOne = (input: Point[], debug: boolean) => {

    const topJunctionCount = 1000;

    const distances = getDistances(input);

    const junctions = distances.slice(0, topJunctionCount);
    if (debug) {
        console.log("Closest junctions:");
        for (const j of junctions) {
            console.log(`From ${j.first} to ${j.second} = ${j.distance.toFixed(2)}`);
        };
    }

    const circuits: Set<string>[] = [];

    for (const {first, second} of junctions) {
        // is the first in any circuit?
        let firstCircuit = circuits.find(c => c.has(first));
        let secondCircuit = circuits.find(c => c.has(second));

        if (firstCircuit && secondCircuit) {
            if (firstCircuit !== secondCircuit) {
                // merge circuits
                const joinedCircuit = new Set([...firstCircuit, ...secondCircuit]);
                circuits.splice(circuits.indexOf(secondCircuit), 1);
                circuits[circuits.indexOf(firstCircuit)] = joinedCircuit;
            }
        } else if (firstCircuit) {
            firstCircuit.add(second);
        } else if (secondCircuit) {
            secondCircuit.add(first);
        } else {
            // create new circuit
            circuits.push(new Set([first, second]));
        }
    }
    // sort the circuits by size
    circuits.sort((a, b) => b.size - a.size);

    if (debug) {
        console.log("Circuits found:");
        circuits.forEach((circuit, index) => {
            console.log(`Circuit ${index + 1} of size ${circuit.size}: ${Array.from(circuit).join(" | ")}`);
        });
    }

    const [topOne, topTwo, topThree] = circuits;
    const result = topOne.size * (topTwo ? topTwo.size : 1) * (topThree ? topThree.size : 1);
    return result;
};

const partTwo = (input: Point[], debug: boolean) => {
    const distances = getDistances(input);

    const circuits: Set<string>[] = input.map(p => new Set([toKey(p)]));

    let currentSize = circuits.length;

    for (const {first, second} of distances) {
        // is the first in any circuit?
        let firstCircuit = circuits.find(c => c.has(first))!;
        let secondCircuit = circuits.find(c => c.has(second))!;

        if (firstCircuit !== secondCircuit) {
            // merge circuits
            const joinedCircuit = new Set([...firstCircuit, ...secondCircuit]);
            circuits.splice(circuits.indexOf(secondCircuit), 1);
            circuits[circuits.indexOf(firstCircuit)] = joinedCircuit;
        }

        if (debug) {
            if (circuits.length < currentSize) {
                console.log(`Dropped to ${circuits.length} circuits`);
                currentSize = circuits.length;
            }
        }

        if (circuits.length == 1) {
            if (debug) {
                console.log(`We connected ${first} and ${second} to make a single circuit!`);
            }
            const fx = first.split(",").map(Number)[0];
            const sx = second.split(",").map(Number)[0];
            return fx * sx;
        }
    }
    throw new Error("Could not connect all circuits");
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Point[]) => {
    console.log(input);
};

const test = (_: Point[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Point[], number> = {
    day: 8,
    input: () => processInput(8),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}

