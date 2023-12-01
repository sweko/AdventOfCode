// Solution for day 1 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

const processInput = (day: number) => {
    const input = readInputLines(day);
    return input;
};

const mapFirstLast = (input: string[]) => {
    return input.map(line => {
        const chars = line.split("");
        const first = chars.find(char => char.match(/[0-9]/))!;
        const last = chars.findLast!(char => char.match(/[0-9]/))!;
        return {
            first: +first,
            last: +last
        };
    });
}

const partOne = (input: string[], debug: boolean) => {
    const fls = mapFirstLast(input);
    const result = fls.sum(fl => fl.first*10 + fl.last);
    return result;
};

const partTwo = (input: string[], debug: boolean) => {
    const map: Record<string, string> = {
        "one": "1",
        "two": "2",
        "three": "3",
        "four": "4",
        "five": "5",
        "six": "6",
        "seven": "7",
        "eight": "8",
        "nine": "9",
    }
    const numNames =  Object.keys(map);
    const numRegex = new RegExp(numNames.join("|"), "g");
    const modInput: string[] = [];
    for (const string of input) {
        const result = string.replaceAll(numRegex, (match) => map[match]);
        modInput.push(result);
    }
    const fls = mapFirstLast(modInput);
    return fls.sum(fl => fl.first*10 + fl.last);
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

