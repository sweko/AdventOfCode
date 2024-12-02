// Solution for day 1 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type NumberArrayPair = [number[], number[]];

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const first: number[] = [];
    const second: number[] = [];
    for (const line of lines) {
        const parts = line.split("   ");
        first.push(parseInt(parts[0]));
        second.push(parseInt(parts[1]));
    }
    return [first, second] as NumberArrayPair;
};

const partOne = (input: NumberArrayPair, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    const fsort = input[0].toSorted((f, s) => f-s);
    const ssort = input[1].toSorted((f, s) => f-s);
    
    let totalDistance = 0;
    for (let index = 0; index < fsort.length; index++) {
        const f = fsort[index];
        const s = ssort[index];
        const distance = Math.abs(f-s);
        totalDistance += distance;
    }
    return totalDistance;
};

const toHistogram = (input: number[]) => {
    const histogram = new Map<number, number>();
    for (const element of input) {
        const count = histogram.get(element) || 0;
        histogram.set(element, count + 1);
    }
    return histogram;
}

const partTwo = (input: NumberArrayPair, debug: boolean) => {
    const fhist = toHistogram(input[0]);
    const shist = toHistogram(input[1]);

    let similarity = 0;
    for (const [key, times] of fhist) {
        const occurences = shist.get(key) || 0;
        const score = key * times * occurences;
        similarity += score;
    }

    return similarity;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: NumberArrayPair) => {
    console.log(input);
};

const test = (_: NumberArrayPair) => {
    console.log("----Test-----");
};

export const solution: Puzzle<NumberArrayPair, number> = {
    day: 1,
    input: () => processInput(1),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}