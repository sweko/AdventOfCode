import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    return input.map(line => parseInt(line, 10));

    // return [
    //     199,
    //     200,
    //     208,
    //     210,
    //     200,
    //     207,
    //     240,
    //     269,
    //     260,
    //     263,
    // ];
};

const partOne = (input: number[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let count = 0;

    for (let i = 1; i < input.length; i++) {
        const current = input[i];
        const previous = input[i - 1];

        if (current > previous) {
            count += 1;
        }
    }

    return count;
};

const partTwo = (input: number[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    // calculate the windows
    const windows = [];
    for (let i = 2; i < input.length; i++) {
        const window = input[i] + input[i - 1] + input[i - 2];
        windows.push(window);
    }

    let count = 0;
    for (let i = 1; i < windows.length; i++) {
        const current = windows[i];
        const previous = windows[i - 1];

        if (current > previous) {
            count += 1;
        }
    }

    return count;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: number[]) => {
    console.log(input);
};

const test = (_: number[]) => {
    console.log("----Test-----");
};

export const solutionOne: Puzzle<number[], number> = {
    day: 1,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
