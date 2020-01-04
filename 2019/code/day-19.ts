import { readInputLines, readInput, loopMatrix, debugLog } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { IntcodeSimulator } from "../extra/intcode-simulator";
import { printMatrix } from "../extra/terminal-helper";

const processInput = async (day: number) => {
    const input = await readInput(day);
    return input.split(",").map(c => Number(c));
};

const partOne = (instructions: number[], debug: boolean) => {
    const width = 50;
    let result = 0;
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < width; y++) {
            const input: number[] = [x, y];
            const simulator = new IntcodeSimulator(instructions.slice(), input, false);
            simulator.output = value => result += value;
            simulator.run();
        }
    }

    return result;
};

const partTwo = (instructions: number[], debug: boolean) => {
    const width = 1300; // empirically determined, no runtime calculations
    const target = 100;
    const output = Array(width).fill(null).map(_ => Array(width).fill(0));
    for (let x = 0; x < width; x++) {
        debugLog(false, "Row", x, "\u001b[1A");
        // assume only one beam, with no holes
        let hasOne = false;
        let hasZero = false;
        // starting point empirically determined, we could use prev lines starting point as well
        for (let y = x; y < width; y++) {
            if (hasZero) {
                // we've moved past the beam, next row
                break;
            }
            const input: number[] = [x, y];
            const simulator = new IntcodeSimulator(instructions.slice(), input, false);
            simulator.output = value => {
                output[x][y] = value;
                if (value) {
                    hasOne = true;
                } else if (hasOne) {
                    hasZero = true;
                }
            }
            simulator.run();
        }
    };
    debugLog(debug, "Finished generating grid");

    for (let x = 0; x < output.length; x++) {
        const row = output[x];
        let start = 0;
        while (row[start] === 0) start += 1;
        let end = start;
        while (row[end] === 1) end += 1;

        debugLog(false, { x, start, end });
        if (output[x + target - 1][end - target] === 1) {
            return x*10000 + (end - target);
        }
    };
    return -1;
};

const resultOne = (_: any, result: number) => {
    return `Total affected points: ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Corner of Santa's ship should be at ${result}`;
};

const showInput = (input: number[]) => {
    console.log(input);
};

const test = (_: number[]) => {
    console.log("----Test-----");
};

export const solution19: Puzzle<number[], number> = {
    day: 19,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
