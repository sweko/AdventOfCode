import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    return input;
};

const partOne = (input: string[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    return 0;
};

const resultOne = (_: string[], result: number) => {
    return `Result part one is ${result}`;
};


const showInput = (input: string[]) => {
    console.log(input);
};

const test = (_: string[]) => {
    console.log("----Test-----");
};

export const solutionTwentyFive: Puzzle<string[], number> = {
    day: 25,
    input: processInput,
    partOne,
    resultOne,
    showInput,
    test,
}
