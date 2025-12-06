// Solution for day 5 of advent of code 2025

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type Input = {
    ranges: [number, number][];
    ingredients: number[];
};

const processInput = (day: number) => {
    const lines = readInputLines(day);
    let line = lines.shift()!;
    const result = {
        ranges: [] as [number, number][],
        ingredients: [] as number[],
    }

    while (line !== "") {
        const match = line.match(/(\d+)-(\d+)/);
        if (match) {
            result.ranges.push([parseInt(match[1]), parseInt(match[2])]);
        } else {
            throw new Error(`Invalid range line: ${line}`);
        }
        line = lines.shift()!;
    }

    result.ingredients = lines.map(l => parseInt(l, 10));

    return result;
};

const isInRange = (ingredient: number, range: [number, number]) => {
    const [min, max] = range;
    return ingredient >= min && ingredient <= max;
};

const partOne = ({ranges, ingredients}: Input, debug: boolean) => {
    let freshCount = 0;
    for (const ingredient of ingredients) {
        const isFresh = ranges.some(range => isInRange(ingredient, range));
        if (isFresh) {
            freshCount += 1;
        }
    }
    return freshCount;
};

const partTwo = ({ranges}: Input, debug: boolean) => {
    const sortedRanges = ranges.map(range => range.slice()).toSorted((a, b) => a[0] - b[0]);
    // console.log("Sorted Ranges:", sortedRanges);
    let totalCount = 0;

    for (let index = 0; index < sortedRanges.length; index++) {
        // Find any range that ends after we start
        const currentRange = sortedRanges[index];
        const prevMax = sortedRanges.slice(0, index).max(([_, max]) => max);
        if (prevMax >= currentRange[0]) {
            currentRange[0] = prevMax + 1;
        }

        if (currentRange[0] > currentRange[1]) {
            continue; // Fully overlapped
        }

        const rangeLength = currentRange[1] - currentRange[0] + 1;
        //console.log(`Non-overlapped range: ${currentRange[0]}-${currentRange[1]} (length ${rangeLength})`);

        totalCount += rangeLength;
    }

    return totalCount;
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
    console.log("----Test-----");
};

export const solution: Puzzle<Input, number> = {
    day: 5,
    input: () => processInput(5),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}