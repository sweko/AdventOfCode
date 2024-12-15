// Solution for day 13 of advent of code 2024

import { readInputLines, readInput, dlog } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type ClawMachine = {
    a: {
        x: number,
        y: number,
    },
    b: {
        x: number,
        y: number,
    },
    price: {
        x: number,
        y: number,
    }
}

const processInput = (day: number) => {
    const buttonRegex = /^Button (?:A|B): X\+(\d+), Y\+(\d+)$/;
    const prizeRegex = /^Prize: X=(\d+), Y=(\d+)$/;
    const lines = readInputLines(day);
    let fline = lines.shift()!;
    const result: ClawMachine[] = [];
    while (fline) {
        const sline = lines.shift()!;
        const tline = lines.shift()!;
        lines.shift()!;
        const fmatch = fline.match(buttonRegex)!;
        const smatch = sline.match(buttonRegex)!;
        const tmatch = tline.match(prizeRegex)!;
        const claw = {
            a: {
                x: parseInt(fmatch[1]),
                y: parseInt(fmatch[2]),
            },
            b: {
                x: parseInt(smatch[1]),
                y: parseInt(smatch[2]),
            },
            price: {
                x: parseInt(tmatch[1]),
                y: parseInt(tmatch[2]),
            }
        }
        result.push(claw);
        fline = lines.shift()!;
    }
    return result;
};

const partOne = (input: ClawMachine[], debug: boolean) => {
    let token = 0;
    for (const { a, b, price } of input) {
        const bsolution = (price.x * a.y - price.y * a.x) / (b.x * a.y - b.y * a.x);
        const asolution = (price.x - b.x * bsolution) / a.x;
        if (Math.floor(asolution) !== asolution || Math.floor(bsolution) !== bsolution) {
            continue;
        }
        if (asolution < 0 || bsolution < 0) {
            continue;
        }
        if (asolution > 100 || bsolution > 100) {
            continue;
        }
        token += 3 * asolution + bsolution;
    }
    return token;
};

const partTwo = (input: ClawMachine[], debug: boolean) => {
    let token = 0;
    const offset = 10_000_000_000_000;
    for (const { a, b, price } of input) {
        dlog(`Processing ${a.x}, ${a.y} - ${b.x}, ${b.y} - ${price.x}, ${price.y}`);
        price.x += offset;
        price.y += offset;
        const bsolution = (price.x * a.y - price.y * a.x) / (b.x * a.y - b.y * a.x);
        const asolution = (price.x - b.x * bsolution) / a.x;
        if (Math.floor(asolution) !== asolution || Math.floor(bsolution) !== bsolution) {
            dlog(`Non integer solution`);
            continue;
        }
        if (asolution < 0 || bsolution < 0) {
            dlog(`Negative solution`);
            continue;
        }
        dlog(`Solution: ${asolution}, ${bsolution}`);
        token += 3 * asolution + bsolution;
    }
    return token;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: ClawMachine[]) => {
    console.log(input);
};

const test = (_: ClawMachine[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<ClawMachine[], number> = {
    day: 13,
    input: () => processInput(13),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}