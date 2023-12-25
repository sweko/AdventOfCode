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

const floodFillOne = (garden: Plot[][], startX: number, startY: number, stepsLeft: number) => {
    const allowed = ['.', 'S'];

    const queue: DistancePoint[] = [];
    queue.push({ x: startX, y: startY, steps: stepsLeft });
    let runs = 0;
    while (queue.length > 0) {
        runs += 1;
        const { x, y, steps } = queue.shift()!;
        if (x < 0 || y < 0 || x >= garden[0].length || y >= garden.length) {
            continue;
        }
        if (!allowed.includes(garden[y][x])) {
            continue;
        }
        garden[y][x] = 'O';
        if (steps === 0) {
            continue;
        }
        queue.push({ x: x - 1, y, steps: steps - 1 });
        queue.push({ x: x + 1, y, steps: steps - 1 });
        queue.push({ x, y: y - 1, steps: steps - 1 });
        queue.push({ x, y: y + 1, steps: steps - 1 });
    }
    console.log(`Runs: ${runs}`);
};

const partOne = (input: Plot[][], debug: boolean) => {
    const stepsLeft = 6;

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

    const garden = input.map(row => row.slice());

    floodFillOne(garden, start.x, start.y, stepsLeft);
    // printMatrix(input);

    const plots = garden.flatMap((row, rindex) => row.map((element, cindex) => ({ element, rindex, cindex })));
    const finalPlots = plots
        .filter(plot => plot.element === 'O')
        .filter(plot => {
            const distance = Math.abs(plot.rindex - start.y) + Math.abs(plot.cindex - start.x);
            return (distance % 2) === (stepsLeft % 2);
        });

    return finalPlots.length;
};

const floodFillTwo = (garden: Plot[][], startX: number, startY: number, stepsLeft: number) => {
    const allowed = ['.', 'S'];

    const queue: DistancePoint[] = [];
    queue.push({ x: startX, y: startY, steps: stepsLeft });
    const result = new Map<string, number>();
    let runs = 0;
    while (queue.length > 0) {
        runs += 1;
        if (runs % 10_000 === 0) {
            console.log(`Runs: ${runs}, queue: ${queue.length}`);
        }
        const { x, y, steps } = queue.shift()!;

        let xlookup = x % garden[0].length;
        if (xlookup < 0) {
            xlookup += garden[0].length;
        }
        let ylookup = y % garden.length;
        if (ylookup < 0) {
            ylookup += garden.length;
        }

        // console.log(`Checking ${xlookup}, ${ylookup}`);
        // console.log(garden[ylookup][xlookup]);
        if (garden[ylookup][xlookup] === "#") {
            continue;
        }
        const key = `(${x},${y})`;
        const distance = Math.abs(y - startY) + Math.abs(x - startX);
        result.set(key, distance);
        if (steps === 0) {
            continue;
        }
        queue.push({ x: x - 1, y, steps: steps - 1 });
        queue.push({ x: x + 1, y, steps: steps - 1 });
        queue.push({ x, y: y - 1, steps: steps - 1 });
        queue.push({ x, y: y + 1, steps: steps - 1 });
    }
    console.log(`Runs: ${runs}`);
    return result;
};


const partTwo = (input: Plot[][], debug: boolean) => {
    const stepsLeft = 50;

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

    const places = floodFillTwo(input, start.x, start.y, stepsLeft);
    
    const finalPlots = [...places.values()].filter(distance => {
            return (distance % 2) === (stepsLeft % 2);
    }).length;

    return finalPlots;
    // printMatrix(input);

    // const plots = input.flatMap((row, rindex) => row.map((element, cindex) => ({ element, rindex, cindex })));
    // const finalPlots = plots
    //     .filter(plot => plot.element === 'O')
    //     .filter(plot => {
    //         const distance = Math.abs(plot.rindex - start.y) + Math.abs(plot.cindex - start.x);
    //         return (distance % 2) === (stepsLeft % 2);
    //     });

    // return finalPlots.length;
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
    // partTwo,
    resultOne: resultOne,
    // resultTwo: resultTwo,
    showInput,
    test,
}