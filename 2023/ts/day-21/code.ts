// Solution for day 21 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";

type Plot = '.' | '#' | 'S' | 'O';

interface Point {
    x: number;
    y: number;
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const plots = lines.map(line => line.split("") as Plot[]);
    return plots;
};

type DistancePoint = Point & { steps: number };

const floodFill = (input: Plot[][], startX: number, startY: number, stepsLeft: number) => {
    const allowed = ['.', 'S'];

    const queue: DistancePoint[] = [];
    queue.push({ x: startX, y: startY, steps: stepsLeft });

    while (queue.length > 0) {
        const { x, y, steps } = queue.shift()!;
        if (x < 0 || y < 0 || x >= input[0].length || y >= input.length) {
            continue;
        }
        if (!allowed.includes(input[y][x])) {
            continue;
        }
        input[y][x] = 'O';
        if (steps === 0) {
            continue;
        }
        queue.push({ x: x - 1, y, steps: steps - 1 });
        queue.push({ x: x + 1, y, steps: steps - 1 });
        queue.push({ x, y: y - 1, steps: steps - 1 });
        queue.push({ x, y: y + 1, steps: steps - 1 });
    }
};

const partOne = (input: Plot[][], debug: boolean) => {
    const stepsLeft = 64;

    let start = { x: 0, y: 0 };

    for (let rindex = 0; rindex < input.length; rindex++) {
        const row = input[rindex];
        for (let cindex = 0; cindex < row.length; cindex++) {
            const element = row[cindex];
            if (element === 'S') {
                start = { x: cindex, y: rindex };
            }
        }
    }

    floodFill(input, start.x, start.y, stepsLeft);
    // printMatrix(input);

    const plots = input.flatMap((row, rindex) => row.map((element, cindex) => ({ element, rindex, cindex })));
    const finalPlots = plots
        .filter(plot => plot.element === 'O')
        .filter(plot => {
            const distance = Math.abs(plot.rindex - start.y) + Math.abs(plot.cindex - start.x);
            return (distance % 2) === (stepsLeft % 2);
        });

    return finalPlots.length;
};

const partTwo = (input: Plot[][], debug: boolean) => {
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

const showInput = (input: Plot[][]) => {
    console.log(input);
};

const test = (_: Plot[][]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Plot[][], number> = {
    day: 21,
    input: () => processInput(21),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}