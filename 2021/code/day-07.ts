import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const input = await readInput(day);
    return input.split(",").map(n => parseInt(n, 10));
};

const partOne = (input: number[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const min = Math.min(...input);
    const max = Math.max(...input);

    let minValue = Number.MAX_SAFE_INTEGER;

    for (let position = min; position <= max; position++) {
        const pvalue = input.map(value => Math.abs(value - position)).reduce((acc, value) => acc + value, 0);
        if (pvalue < minValue) {
            minValue = pvalue;
        }
    }
    return minValue;
};

const partTwo = (input: number[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const min = Math.min(...input);
    const max = Math.max(...input);

    let minValue = Number.MAX_SAFE_INTEGER;

    for (let position = min; position <= max; position++) {
        const pvalue = input
            .map(value => Math.abs(value - position))
            .map(value => value * (value+1) / 2)
            .reduce((acc, value) => acc + value, 0);

        if (pvalue < minValue) {
            minValue = pvalue;
        }
    }
    return minValue;
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

export const solutionSeven: Puzzle<number[], number> = {
    day: 7,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
