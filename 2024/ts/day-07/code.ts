// Solution for day 7 of advent of code 2024

import { readInputLines, readInput, dlog } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type Equation = {
    target: number,
    values: number[]
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const equations = lines.map(line => {
        const parts = line.split(": ");
        const target = parseInt(parts[0], 10);
        const values = parts[1].split(" ").map(value => parseInt(value, 10));
        return { target, values };
    });
    return equations;
};

const canBeAchivedOne = (target: number, accumulator: number, values: number[]) => {
    if (values.length === 0) {
        return accumulator === target;
    }
    const [head, ...rest] = values;
    // handle addition
    if (canBeAchivedOne(target, accumulator + head, rest)) {
        return true;
    }
    // handle multiplication
    if (canBeAchivedOne(target, accumulator * head, rest)) {
        return true;
    }
    return false;
};

const partOne = (input: Equation[], debug: boolean) => {
    let result = 0;
    for (const {target, values} of input) {
        const [head, ...rest] = values;
        if (canBeAchivedOne(target, head, rest)) {
            result += target;
        }
    }
    return result;
};

const canBeAchivedTwo = (target: number, accumulator: number, values: number[]) => {
    if (values.length === 0) {
        return accumulator === target;
    }
    const [head, ...rest] = values;
    // handle addition
    if (canBeAchivedTwo(target, accumulator + head, rest)) {
        return true;
    }
    // handle multiplication
    if (canBeAchivedTwo(target, accumulator * head, rest)) {
        return true;
    }
    // handle concatenation
    if (canBeAchivedTwo(target, parseInt(accumulator.toString() + head.toString(), 10), rest)) {
        return true;
    }
    return false;
};

const partTwo = (input: Equation[], debug: boolean) => {
    let result = 0;
    for (const {target, values} of input) {
        const [head, ...rest] = values;
        if (canBeAchivedTwo(target, head, rest)) {
            result += target;
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

const showInput = (input: Equation[]) => {
    console.log(input);
};

const test = (_: Equation[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Equation[], number> = {
    day: 7,
    input: () => processInput(7),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}