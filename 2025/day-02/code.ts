// Solution for day 2 of advent of code 2025

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type Range = [number, number];

const processInput = (day: number):Range[] => {
    const line = readInput(day);
    return line.split(",").map(s => s.split("-").map(Number) as Range);
};

const partOne = (input: Range[], debug: boolean) => {
    let total = 0;
    for (const [start, end] of input) {
        for (let nvalue = start; nvalue <= end; nvalue++) {
            const value = nvalue.toString();
            if (value.length % 2 !== 0) {
                continue;
            }
            const firstHalf = value.slice(0, value.length / 2);
            const secondHalf = value.slice(value.length / 2);
            if (firstHalf === secondHalf) {
                //console.log(`Found matching value: ${nvalue}`);
                total += nvalue;
            }
        }
    }

    return total;
};

const checkMultiple = (nvalue: number): boolean => {
    const value = nvalue.toString();

    for (let len = 1; len <= value.length / 2; len++) {
        if (value.length % len !== 0) {
            continue;
        }
        const segment = value.slice(0, len);
        const target = segment.repeat(value.length / len);
        if (target === value) {
            //console.log(`Value ${nvalue} is made of multiple segments of ${segment}`);
            return true;
        }
    }
    return false;
}

const partTwo = (input: Range[], debug: boolean) => {
    let total = 0;
    for (const [start, end] of input) {
        for (let nvalue = start; nvalue <= end; nvalue++) {
            if (checkMultiple(nvalue)) {
                //console.log(`Found matching value: ${nvalue}`);
                total += nvalue;
            }
        }
    }

    return total;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Range[]) => {
    console.log(input);
};

const test = (_: Range[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Range[], number> = {
    day: 2,
    input: () => processInput(2),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}