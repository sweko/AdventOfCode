// Solution for day 25 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";

const processInput = (day: number) => {
    const lines = readInputLines(day);
    let line = lines.shift();
    const result: string[][][] = [];
    while (line) {
        const matrix: string[][] = [];
        while (line) {
            const row = line.split("");
            matrix.push(row);
            line = lines.shift()!;
        }
        result.push(matrix);
        line = lines.shift();
    }

    return result;
};


type LockKey = {
    type: "lock" | "key",
    values: number[],
}

const partOne = (input: string[][][], debug: boolean) => {
    const height = input[0].length - 2;
    const width = input[0][0].length;
    const locks: LockKey[] = [];
    const keys: LockKey[] = [];
    for (const matrix of input) {
        const type = matrix[0][0] === "." ? "key" : "lock";
        const values = matrix.slice(1, -1).reduce((prev, curr) => prev.map((val, index) => curr[index] === "#" ? val + 1 : val), Array(width).fill(0) as number[]);
        if (type === "lock") {
            locks.push({ type, values });
        } else {
            keys.push({ type, values });
        }
    }

    let counter = 0;
    for (const lock of locks) {
        for (const key of keys) {
            const match = key.values.map((val, index) => lock.values[index] + val).every(val => val <= height);
            if (match) {
                counter += 1;
            }
        }
    }

    return counter;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const showInput = (input: string[][][]) => {
    console.log(input);
};

const test = (_: string[][][]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<string[][][], number> = {
    day: 25,
    input: () => processInput(25),
    partOne,
    resultOne: resultOne,
    showInput,
    test,
}