import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    return input;
};

const digitMap: Record<string, number> = {
    "0": 0,
    "1": 1,
    "2": 2,
    "-": -1,
    "=": -2,
}


const pentaryToDecimal = (input: string):number => input
    .split("")
    .map(digit => digitMap[digit])
    .reverse()
    .map((digit, index) => 5 ** index * digit)
    .sum();


const decimalToPentary = (value: number):string => {
    if (value === 0) return "0";

    const result = [];
    while (value !== 0) {
        const digit = value % 5;
        if ([0, 1, 2].includes(digit)) {
            value = (value - digit) / 5;
            result.unshift(digit.toString());
            continue;
        } else if (digit === 3) {
            value = (value + 2) / 5;
            result.unshift("=");
            continue;
        } else if (digit === 4) {
            value = (value + 1) / 5;
            result.unshift("-");
            continue;
        }
        throw new Error(`Invalid digit ${digit} for value ${value}`);
    }

    return result.join("");
};

const partOne = (input: string[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const total = input.map(value => pentaryToDecimal(value)).sum();

    return decimalToPentary(total);
};

const resultOne = (_: string[], result: string) => {
    return `Result part one is ${result}`;
};


const showInput = (input: string[]) => {
    console.log(input);
};

const test = (_: string[]) => {
    console.log("----Test-----");
};

export const solutionTwentyFive: Puzzle<string[], string> = {
    day: 25,
    input: processInput,
    partOne,
    resultOne,
    showInput,
    test,
}
