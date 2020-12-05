import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    return input;
};

// the reduce is perverse. It uses that both R and B have a 0 for a third bit, and L and F have a 1.
const toNumber = (pass:string) => pass.split("").map(c => c.charCodeAt(0)).reduce((acc, c) => (acc << 1) + +!(c & 4),  0);

const partOne = (input: string[], debug: boolean) => {
    const passes = input.map(toNumber).sort((f, s) => s-f);
    return passes[0];
};

const partTwo = (input: string[], debug: boolean) => {
    const passes = input.map(toNumber).sort((f, s) => s-f);
    let index = 0;
    // this is dirty, dirty code, but it works :)
    while (passes[index] - passes[++index] === 1);
    return passes[index]+1;
};

const resultOne = (_: any, result: number) => {
    return `Biggest board pass number is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The missing board pass is ${result}`;
};

const showInput = (input: string[]) => {
    console.log(input);
};

const test = (_: string[]) => {
    console.log("----Test-----");
};

export const solutionFive: Puzzle<string[], number> = {
    day: 5,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
