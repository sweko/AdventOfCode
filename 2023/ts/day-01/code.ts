// Solution for day 1 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

const processInput = (day: number) => {
    const input = readInputLines(day);
    return input;
};

// this is terribly inneficient, but it works
const getFirstDigit = (input: string, map: Record<string, number>) => {
    for (let index = 0; index < input.length; index++) {
        const part = input.substring(index, input.length);
        for (const key in map) {
            if (part.startsWith(key)) {
                return map[key];
            }
        }
    }
    return Number.NEGATIVE_INFINITY;
};

const getLastDigit = (input: string, map: Record<string, number>) => {
    for (let index = input.length; index > 0; index--) {
        const part = input.substring(0, index);
        for (const key in map) {
            if (part.endsWith(key)) {
                return map[key];
            }
        }
    }
    return Number.NEGATIVE_INFINITY;
}

const mapFirstLast = (input: string[], map: Record<string, number>) => {
    return input.map(line => {
        const first = getFirstDigit(line, map);
        const last = getLastDigit(line, map);
        return { first, last };
    });
}

const partOne = (input: string[], debug: boolean) => {
    const map: Record<string, number> = {
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
    }
    const fls = mapFirstLast(input, map);
    const result = fls.sum(fl => fl.first * 10 + fl.last);
    return result;
};

const partTwo = (input: string[], debug: boolean) => {
    const map: Record<string, number> = {
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
        "one": 1,
        "two": 2,
        "three": 3,
        "four": 4,
        "five": 5,
        "six": 6,
        "seven": 7,
        "eight": 8,
        "nine": 9
    }
    const fls = mapFirstLast(input, map);
    const result = fls.sum(fl => fl.first * 10 + fl.last);
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
    day: 1,
    input: () => processInput(1),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}

