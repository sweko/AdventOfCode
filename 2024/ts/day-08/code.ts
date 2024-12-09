// Solution for day 8 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";

interface Point {
    x: number;
    y: number;
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    return lines.map((line) => line.split(""));;
};

const pointToString = (point: Point) => `(${point.x},${point.y})`;

const partOne = (input: string[][], debug: boolean) => {
    
    const width = input[0].length;
    const height = input.length;

    const antennas: Record<string, Point[]> = {};

    for (let rindex = 0; rindex < height; rindex++) {
        for (let cindex = 0; cindex < width; cindex++) {
            const cell = input[rindex][cindex];
            if (cell === ".") {
                continue;
            }
            // we have an antenna
            if (antennas[cell] === undefined) {
                antennas[cell] = [];
            }
            antennas[cell].push({x: cindex, y: rindex});
        }
    }

    const antinodeLocations: Set<string> = new Set();

    for (const key in antennas) {
        const array = antennas[key];
        for (let findex = 0; findex < array.length; findex++) {
            const first = array[findex];
            for (let sindex = findex + 1; sindex < array.length; sindex++) {
                const second = array[sindex];
                // first antinode
                const antiOne = {
                    x: 2 * first.x - second.x,
                    y: 2 * first.y - second.y
                };
                // check if it is in the grid
                if (antiOne.x >= 0 && antiOne.x < width && antiOne.y >= 0 && antiOne.y < height) {
                    antinodeLocations.add(pointToString(antiOne));
                }

                // second antinode
                const antiTwo = {
                    x: 2 * second.x - first.x,
                    y: 2 * second.y - first.y
                };

                // check if it is in the grid
                if (antiTwo.x >= 0 && antiTwo.x < width && antiTwo.y >= 0 && antiTwo.y < height) {
                    antinodeLocations.add(pointToString(antiTwo));
                }
            }
        }
    }

    return antinodeLocations.size;
};

const makeCoprime = (point: Point) => {
    const gcd = (a: number, b: number):number => {
        if (b === 0) {
            return a;
        }
        return gcd(b, a % b);
    }
    const common = gcd(point.x, point.y);
    return {
        x: point.x / common,
        y: point.y / common
    }
}


const partTwo = (input: string[][], debug: boolean) => {
    const width = input[0].length;
    const height = input.length;

    const antennas: Record<string, Point[]> = {};

    for (let rindex = 0; rindex < height; rindex++) {
        for (let cindex = 0; cindex < width; cindex++) {
            const cell = input[rindex][cindex];
            if (cell === ".") {
                continue;
            }
            // we have an antenna
            if (antennas[cell] === undefined) {
                antennas[cell] = [];
            }
            antennas[cell].push({x: cindex, y: rindex});
        }
    }

    const antinodeLocations: Set<string> = new Set();

    for (const key in antennas) {
        const array = antennas[key];
        for (let findex = 0; findex < array.length; findex++) {
            const first = array[findex];
            for (let sindex = findex + 1; sindex < array.length; sindex++) {
                const second = array[sindex];
                const delta = makeCoprime({
                    x: second.x - first.x,
                    y: second.y - first.y
                });
                let multiplier = 0;
                let inBounds = true;
                while (inBounds) {
                    const antinode = {
                        x: first.x + delta.x * multiplier,
                        y: first.y + delta.y * multiplier
                    };
                    if (antinode.x >= 0 && antinode.x < width && antinode.y >= 0 && antinode.y < height) {
                        antinodeLocations.add(pointToString(antinode));
                    } else {
                        inBounds = false;
                    }
                    multiplier += 1;
                }

                multiplier = -1;
                inBounds = true;
                while (inBounds) {
                    const antinode = {
                        x: first.x + delta.x * multiplier,
                        y: first.y + delta.y * multiplier
                    };
                    if (antinode.x >= 0 && antinode.x < width && antinode.y >= 0 && antinode.y < height) {
                        antinodeLocations.add(pointToString(antinode));
                    } else {
                        inBounds = false;
                    }
                    multiplier -= 1;
                }
            }
        }
    }

    return antinodeLocations.size;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: string[][]) => {
    console.log(input);
};

const test = (_: string[][]) => {
    console.log(makeCoprime({x: 2, y: 4}));
    console.log(makeCoprime({x: 3, y: 3}));
    console.log(makeCoprime({x: 0, y: 6}));
    console.log(makeCoprime({x: 6, y: 0}));
    console.log(makeCoprime({x: 2, y: -4}));
    console.log(makeCoprime({x: 0, y: -6}));
    console.log(makeCoprime({x: -6, y: 0}));
    console.log(makeCoprime({x: -2, y: -4}));
};

export const solution: Puzzle<string[][], number> = {
    day: 8,
    input: () => processInput(8),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}