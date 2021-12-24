import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    return [];
};

const partOne = (input: number[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    return 0;
};

const partTwo = (input: number[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    return 0;
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

export const solutionTwentyFour: Puzzle<number[], number> = {
    day: 24,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
