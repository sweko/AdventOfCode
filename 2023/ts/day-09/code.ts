// Solution for day 9 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const measurements = lines.map(line => line.split(" ").map(item => parseInt(item, 10)));
    return measurements;
};

const getNextValue = (measurement: number[]) => {
    const diffSets = [measurement];
    while (diffSets.last().some(item => item !== 0)) {
        const lastSet = diffSets.last();
        const nextSet = lastSet.differences();
        diffSets.push(nextSet);
    }

    diffSets.last().push(0);

    for (let index = diffSets.length - 2; index >= 0; index -= 1) {
        const bellow = diffSets[index + 1];
        const current = diffSets[index];
        current.push(bellow.last() + current.last());
    }

    const result = diffSets[0].last();
    // console.log(result);
    return result;
}

const partOne = (measurements: number[][], debug: boolean) => {
    const result = measurements.sum(measurement => getNextValue(measurement));
    return result;
};

const getPreviousValue = (measurement: number[]) => {
    const diffSets = [measurement];
    while (diffSets.last().some(item => item !== 0)) {
        const lastSet = diffSets.last();
        const nextSet = lastSet.differences();
        diffSets.push(nextSet);
    }

    diffSets.last().unshift(0);

    for (let index = diffSets.length - 2; index >= 0; index -= 1) {
        const bellow = diffSets[index + 1];
        const current = diffSets[index];
        current.unshift(current[0] - bellow[0]);
    }

    const result = diffSets[0][0];
    // console.log(result);
    return result;
}

const partTwo = (measurements: number[][], debug: boolean) => {
    const result = measurements.sum(measurement => getPreviousValue(measurement));
    return result;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: number[][]) => {
    console.log(input);
};

const test = (_: number[][]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<number[][], number> = {
    day: 9,
    input: () => processInput(9),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}