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
    const elves: number[][] = [[]];
    let currentElf = elves[0];
    for (const line of input) {
        if (line === "") {
            currentElf = [];
            elves.push(currentElf);
        } else {
            currentElf.push(parseInt(line));
        }
    }
    const max = elves.map(elf => elf.sum()).max();
    return max;
};

const partTwo = (input: string[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    const elves: number[][] = [[]];
    let currentElf = elves[0];
    for (const line of input) {
        if (line === "") {
            currentElf = [];
            elves.push(currentElf);
        } else {
            currentElf.push(parseInt(line));
        }
    }
    const elvesTotal = elves.map(elf => elf.sum()).sort((a, b) => b - a);
    return elvesTotal[0] + elvesTotal[1] + elvesTotal[2];
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: string[]) => {
    console.log(input);
};

const test = (_: string[]) => {
    console.log("----Test-----");
};

export const solutionOne: Puzzle<string[], number> = {
    day: 1,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
