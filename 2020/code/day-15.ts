import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    return input.map(line => line);
};

const partOne = (input: string[], debug: boolean) => {
    return 0;
};

const partTwo = (input: string[], debug: boolean) => {
    return 0;
};

const result = (_: any, result: number) => {
    return `The sum of all addresses is ${result}`;
};

const showInput = (input: string[]) => {
    console.log(input);
};

const test = (_: string[]) => {
    console.log("----Test-----");
};

export const solutionFifteen: Puzzle<string[], number> = {
    day: 15,
    input: processInput,
    partOne,
    partTwo: partTwo,
    resultOne: result,
    resultTwo: result,
    showInput,
    test,
}
