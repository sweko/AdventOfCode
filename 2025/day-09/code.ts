// Solution for day 9 of advent of code 2025

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type Point = [number, number];

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const points = lines.map(line => line.trim().split(',').map(Number) as Point);
    return points;
};

const partOne = (input: Point[], debug: boolean) => {
    let maxArea = 0;
    // loop through all pairs of points
    for (let findex = 0; findex < input.length; findex++) {
        const [fx, fy] = input[findex];
        for (let sindex = findex + 1; sindex < input.length; sindex++) {
            const [sx, sy] = input[sindex];
            const maxx = Math.max(fx, sx);
            const maxy = Math.max(fy, sy);
            const minx = Math.min(fx, sx);
            const miny = Math.min(fy, sy);
            const area = (maxx- minx + 1) * (maxy - miny + 1);
            if (area > maxArea) {
                maxArea = area;
            }
        }
    }
    return maxArea;
}

const partTwo = (input: Point[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    return input.length;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Point[]) => {
    console.log(input);
};

const test = (_: Point[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Point[], number> = {
    day: 9,
    input: () => processInput(9),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}