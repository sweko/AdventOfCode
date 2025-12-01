// Solution for day 1 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type Instruction = {
    direction: "R" | "L";
    steps: number;
};

const processInput = (day: number):Instruction[] => {
    const lines = readInputLines(day);
    const instructions = lines.map(line => {
        const direction = line.charAt(0) as "R" | "L";
        const steps = parseInt(line.slice(1), 10);
        return { direction, steps };
    });
    return instructions;
};

const toLock = (n: number) => (n % 100 + 100) % 100;

const partOne = (input: Instruction[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let position = 50;
    let result = 0;
    for (const instruction of input) {
        if (instruction.direction === "R") {
            position += instruction.steps;
        } else {
            position -= instruction.steps;
        }
        position = toLock(position);
        if (position === 0) {
            result += 1;
        }
    }
    return result;
};

const partTwo = (input: Instruction[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    let position = 50;
    let result = 0;
    for (const instruction of input) {
        if (instruction.direction === "R") {
            let clicks = instruction.steps;
            while (clicks > 0) {
                position += 1;
                position = toLock(position);
                if (position === 0) {
                    result += 1;
                }
                clicks -= 1;
            }
        } else {
            let clicks = instruction.steps;
            while (clicks > 0) {
                position -= 1;
                position = toLock(position);
                if (position === 0) {
                    result += 1;
                }
                clicks -= 1;
            }
        }
    }
    return result;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Instruction[]) => {
    console.log(input);
};

const test = (input: Instruction[]) => {
    console.log("----Test-----");
    console.log(input.max(instruction => instruction.steps));
};

export const solution: Puzzle<Instruction[], number> = {
    day: 1,
    input: () => processInput(1),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}