// Solution for day 4 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type Letter = 'X' | 'M' | 'A' | 'S';

const processInput = (day: number) => {
    const lines = readInputLines(day);
    return lines.map(line => line.split("") as Letter[]);
};

const partOne = (input: Letter[][], debug: boolean) => {
    const width = input[0].length;
    const height = input.length;
    let xmasCounter = 0;
    for (let rindex = 0; rindex < input.length; rindex++) {
        for (let cindex = 0; cindex < input[rindex].length; cindex++) {
            const letter = input[rindex][cindex];
            if (letter !== 'X') {
                continue;
            }
            // east
            if (cindex < width - 3) {
                if (input[rindex][cindex + 1] === 'M' && input[rindex][cindex + 2] === 'A' && input[rindex][cindex + 3] === 'S') {
                    xmasCounter++;
                }
            }
            // south
            if (rindex < height - 3) {
                if (input[rindex + 1][cindex] === 'M' && input[rindex + 2][cindex] === 'A' && input[rindex + 3][cindex] === 'S') {
                    xmasCounter++;
                }
            }
            // south-east
            if (rindex < height - 3 && cindex < width - 3) {
                if (input[rindex + 1][cindex + 1] === 'M' && input[rindex + 2][cindex + 2] === 'A' && input[rindex + 3][cindex + 3] === 'S') {
                    xmasCounter++;
                }
            }
            // south-west
            if (rindex < height - 3 && cindex > 2) {
                if (input[rindex + 1][cindex - 1] === 'M' && input[rindex + 2][cindex - 2] === 'A' && input[rindex + 3][cindex - 3] === 'S') {
                    xmasCounter++;
                }
            }
            // west
            if (cindex > 2) {
                if (input[rindex][cindex - 1] === 'M' && input[rindex][cindex - 2] === 'A' && input[rindex][cindex - 3] === 'S') {
                    xmasCounter++;
                }
            }
            // north-west
            if (rindex > 2 && cindex > 2) {
                if (input[rindex - 1][cindex - 1] === 'M' && input[rindex - 2][cindex - 2] === 'A' && input[rindex - 3][cindex - 3] === 'S') {
                    xmasCounter++;
                }
            }
            // north
            if (rindex > 2) {
                if (input[rindex - 1][cindex] === 'M' && input[rindex - 2][cindex] === 'A' && input[rindex - 3][cindex] === 'S') {
                    xmasCounter++;
                }
            }
            // north-east
            if (rindex > 2 && cindex < width - 3) {
                if (input[rindex - 1][cindex + 1] === 'M' && input[rindex - 2][cindex + 2] === 'A' && input[rindex - 3][cindex + 3] === 'S') {
                    xmasCounter++;
                }
            }
        }
    }
    return xmasCounter;
};

const partTwo = (input: Letter[][], debug: boolean) => {
    const width = input[0].length;
    const height = input.length;
    let xmasCounter = 0;
    const goodLetters = ['M', 'S'];
    for (let rindex = 0; rindex < input.length; rindex++) {
        for (let cindex = 0; cindex < input[rindex].length; cindex++) {
            const letter = input[rindex][cindex];
            if (letter !== 'A') {
                continue;
            }
            // skip the border items
            if (rindex === 0 || rindex === height - 1 || cindex === 0 || cindex === width - 1) {
                continue;
            }

            const corners = [
                input[rindex - 1][cindex - 1],
                input[rindex - 1][cindex + 1],
                input[rindex + 1][cindex + 1],
                input[rindex + 1][cindex - 1],
            ];

            if (corners.includes('X')) {
                continue;
            }

            if (corners.includes('A')) {
                continue;
            }

            if (corners[0] === corners [2]) {
                continue;
            }

            if (corners[1] === corners [3]) {
                continue;
            }

            xmasCounter++;
        }
    }
    return xmasCounter;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Letter[][]) => {
    console.log(input);
};

const test = (_: Letter[][]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Letter[][], number> = {
    day: 4,
    input: () => processInput(4),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}