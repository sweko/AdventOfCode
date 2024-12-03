// Solution for day 3 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

const processInput = (day: number) => {
    const lines = readInputLines(day);
    return lines;
};

const partOne = (input: string[], debug: boolean) => {
    let result = 0;
    const matchRegex = /mul\((\d{1,3}),(\d{1,3})\)/g;
    for (const line of input) {
        let match = matchRegex.exec(line);
        while (match !== null) {
            //console.log(match[0]);
            const first = parseInt(match[1], 10);
            const second = parseInt(match[2], 10);
            result += first * second;
            match = matchRegex.exec(line);
        }
    }
    return result;
};

const partTwo = (input: string[], debug: boolean) => {
    let result = 0;
    let enabled = true;
    const matchRegex = /(mul)\((\d{1,3}),(\d{1,3})\)|(do)\(\)|(don't)\(\)/g;
    for (const line of input) {
        let match = matchRegex.exec(line);
        while (match !== null) {
            if (match[4] === "do") {
                enabled = true;
            } else if (match[5] === "don't") {
                enabled = false;
            } else {
                if (enabled) {
                    const first = parseInt(match[2], 10);
                    const second = parseInt(match[3], 10);
                    result += first * second;
                }
            }
            match = matchRegex.exec(line);
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

const showInput = (input: string[]) => {
    console.log(input);
};

const test = (_: string[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<string[], number> = {
    day: 3,
    input: () => processInput(3),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}