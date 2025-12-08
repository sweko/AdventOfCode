// Solution for day 7 of advent of code 2025

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";

type Cell = "S" | "." | "^";
type Point = { row: number, col: number };

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const cells = lines.map(line => line.split("") as Cell[]);
    return cells;
};

const partOne = (input: Cell[][], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    let beamLocations: number[] = [];
    let activatedSplitters = 0;

    const firstRow = input[0];
    // find the S
    beamLocations.push(firstRow.indexOf("S"));
    for (let row = 1; row < input.length; row++) {
        const currentRow = input[row];
        let temps: number[] = [];
        for (const beam of beamLocations) {
            if (currentRow[beam] === "^") {
                // splitter
                activatedSplitters++;
                temps.push(beam - 1);
                temps.push(beam + 1);
            } else if (currentRow[beam] === ".") {
                // continue beam
                temps.push(beam);
            }
        }
        beamLocations = [... new Set(temps)]; // unique
        if (debug) {
            console.log(`After row ${row}, beams at: ${beamLocations}`);
        }
    }

    return activatedSplitters;
};


const toString = (point: Point): string => `(${point.row},${point.col})`;
const cache: Record<string, number> = {};

const countMoves = (input: Cell[][], { row, col }: Point): number => {
    const key = toString({ row, col });
    if (cache[key] !== undefined) {
        return cache[key];
    }

    if (row === input.length - 1) {
        cache[key] = 1;
        return 1;
    }
    // is there a splitter underneath?
    const nextRow = row + 1;
    const currentCol = col;
    if (input[nextRow][currentCol] === "^") {
        // splitter
        const leftMoves = countMoves(input, { row: nextRow, col: currentCol - 1 });
        const rightMoves = countMoves(input, { row: nextRow, col: currentCol + 1 });
        cache[key] = leftMoves + rightMoves;
        return leftMoves + rightMoves;
    } else if (input[nextRow][currentCol] === ".") {
        // continue beam
        const moves = countMoves(input, { row: nextRow, col: currentCol });
        cache[key] = moves;
        return moves;
    }
    throw new Error(`Beam blocked at row ${nextRow}, col ${currentCol}`);
};

const partTwo = (input: Cell[][], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const firstRow = input[0];
    // find the S
    const start = {
        row: 0,
        col: firstRow.indexOf("S")
    }

    const result = countMoves(input, start);

    return result;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Cell[][]) => {
    console.log(input);
};

const test = (_: Cell[][]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Cell[][], number> = {
    day: 7,
    input: () => processInput(7),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}