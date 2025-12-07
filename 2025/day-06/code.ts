// Solution for day 6 of advent of code 2025

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type Input = {
    numbers: string[][];
    operations: string[];
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const operationsLine = lines.pop()! + " ";
    const opRegex = /([+*]\s+)\s+/g;

    const match = operationsLine.match(opRegex)!;

    const operations: string[] = [];
    for (const operation of match) {
        operations.push(operation);
    }

    const numbers = lines.map(line => {
        const values = line + " ";
        const nums = [];
        let startIndex = 0;
        for (const operation of operations) {
            nums.push(values.slice(startIndex, startIndex + operation.length - 1));
            startIndex += operation.length;
        }
        return nums;
    });

    return {
        numbers,
        operations: operations.map(op => op.trim())
    };
};

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const product = (arr: number[]) => arr.reduce((a, b) => a * b, 1);

const partOne = ({numbers, operations}: Input, debug: boolean) => {
    let total = 0;
    for (let index = 0; index < operations.length; index++) {
        const opName = operations[index];
        const nums = numbers.map(row => row[index]);
        const op = opName === "+" ? sum : product;
        const opResult = op(nums.map(n => parseInt(n, 10)));
        if (debug) {
            console.log(`Operation ${opName} on [${nums.join(", ")}] = ${opResult}`);
        }
        total += opResult;
    }
    return total;
};

const partTwo = ({numbers, operations}: Input, debug: boolean) => {
    let total = 0;
    for (let index = 0; index < operations.length; index++) {
        const opName = operations[index];
        const nums = numbers.map(row => row[index]);
        const chars = nums.map(n => n.split(''));

        // transpose the chars matrix
        const transposed: string[][] = [];
        for (let i = 0; i < chars[0].length; i++) {
            transposed[i] = chars.map(row => row[i]);
        }
        const numsReconstructed = transposed.map(charArr => charArr.join(''));
        const op = opName === "+" ? sum : product;
        const opResult = op(numsReconstructed.map(n => parseInt(n, 10)));
        if (debug) {
            console.log(`Operation ${opName} on [${nums.join(", ")}] = ${opResult}`);
        }
        total += opResult;
    }
    return total;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Input) => {
    console.log(input);
};

const test = (_: Input) => {

};

export const solution: Puzzle<Input, number> = {
    day: 6,
    input: () => processInput(6),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}