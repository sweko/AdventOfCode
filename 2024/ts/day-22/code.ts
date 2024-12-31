// Solution for day 22 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

const processInput = (day: number) => {
    const lines = readInputLines(day);
    return lines.map(line => parseInt(line, 10));
};

const mix = (first: bigint, second: bigint) => {
    return first ^ second;
}

const prune = (value: bigint) => {
    return value % 16777216n;
}

const next = (current: bigint) => {
    const one = prune(mix(current, current * 64n));
    const two = prune(mix(one, one >> 5n));
    const three = prune(mix(two, two * 2048n));
    return three;
};

const partOne = (input: number[], debug: boolean) => {
    const bigs = input.map(x => BigInt(x));
    const secrets = bigs.map(value => {
        let current = value;
        for (let i = 0; i < 2000; i++) {
            current = next(current);
        }
        return Number(current);
    });
    return secrets.sum();
};

const partTwo = (input: number[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    return input.length;
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
    const start = 123n;
    let current = start;
    for (let i = 0; i < 10; i++) {
        current = next(current);
        console.log(Number(current));
    }
};

export const solution: Puzzle<number[], number> = {
    day: 22,
    input: () => processInput(22),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}