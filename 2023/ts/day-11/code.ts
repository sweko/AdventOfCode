// Solution for day 11 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";

type Cell = "." | "#";

interface Point {
    x: number;
    y: number;
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const result: Cell[][] = [];
    for (let line of lines) {
        const row: Cell[] = [];
        for (let char of line) {
            row.push(char as Cell);
        }
        result.push(row);
    }
    return result;
};

const expandUniverse = (universe: Cell[][]) => {
    const result: Cell[][] = universe.map((row) => row.slice());

    for (let index = 0; index < result.length; index++) {
        const row = result[index];
        const isEmpty = row.every((cell) => cell === ".");
        if (isEmpty) {
            const emptyRow: Cell[] = Array(row.length).fill(".");
            result.splice(index, 0, emptyRow);
            index += 1;
        }
    }

    for (let index = 0; index < result[0].length; index++) {
        const column = result.map((row) => row[index]);
        const isEmpty = column.every((cell) => cell === ".");
        if (isEmpty) {
            for (let row of result) {
                row.splice(index, 0, ".");
            }
            index += 1;
        }
    }

    return result;
};

const getGalaxies = (universe: Cell[][]) => {
    const result = [] as Point[];
    for (let y = 0; y < universe.length; y++) {
        const row = universe[y];
        for (let x = 0; x < row.length; x++) {
            const cell = row[x];
            if (cell === "#") {
                result.push({ x, y });
            }
        }
    }
    return result;
}

const getDistance = (first: Point, second: Point) => {
    return Math.abs(first.x - second.x) + Math.abs(first.y - second.y);
}

const partOne = (universe: Cell[][], debug: boolean) => {
    const expanded = expandUniverse(universe);
    const galaxies = getGalaxies(expanded);

    let sum = 0;
    for (let findex = 0; findex < galaxies.length; findex++) {
        const first = galaxies[findex];
        for (let sindex = findex + 1; sindex < galaxies.length; sindex++) {
            const second = galaxies[sindex];
            sum += getDistance(first, second);
        }
    }
    return sum;
};

const expandUniverseTwo = (universe: Cell[][], factor: number) => {
    const result: Cell[][] = universe.map((row) => row.slice());

    for (let index = 0; index < result.length; index++) {
        const row = result[index];
        const isEmpty = row.every((cell) => cell === ".");
        if (isEmpty) {
            for (let f = 0; f < factor - 1; f++) {
                const emptyRow: Cell[] = Array(row.length).fill(".");
                result.splice(index, 0, emptyRow);
                index += 1;
            }
        }
    }

    for (let index = 0; index < result[0].length; index++) {
        const column = result.map((row) => row[index]);
        const isEmpty = column.every((cell) => cell === ".");
        if (isEmpty) {
            for (let f = 0; f < factor - 1; f++) {
                for (let row of result) {
                    row.splice(index, 0, ".");
                }
                index += 1;
            }
        }
    }

    return result;
};

const partTwo = (universe: Cell[][], debug: boolean) => {
    // const sums = [];
    // for (let factor = 1; factor <= 100; factor++) {
    //     const expanded = expandUniverseTwo(universe, factor);
    //     const galaxies = getGalaxies(expanded);

    //     let sum = 0;
    //     for (let findex = 0; findex < galaxies.length; findex++) {
    //         const first = galaxies[findex];
    //         for (let sindex = findex + 1; sindex < galaxies.length; sindex++) {
    //             const second = galaxies[sindex];
    //             sum += getDistance(first, second);
    //         }
    //     }
    //     sums.push(sum);
    // }
    // console.log(sums);
    // console.log(sums.differences());

    const galaxies = getGalaxies(universe);

    let sumInit = 0;
    for (let findex = 0; findex < galaxies.length; findex++) {
        const first = galaxies[findex];
        for (let sindex = findex + 1; sindex < galaxies.length; sindex++) {
            const second = galaxies[sindex];
            sumInit += getDistance(first, second);
        }
    }

    const factor = 2;
    const expanded = expandUniverseTwo(universe, factor);
    const expandedGalaxies = getGalaxies(expanded);
    let sumOne = 0;
    for (let findex = 0; findex < expandedGalaxies.length; findex++) {
        const first = expandedGalaxies[findex];
        for (let sindex = findex + 1; sindex < expandedGalaxies.length; sindex++) {
            const second = expandedGalaxies[sindex];
            sumOne += getDistance(first, second);
        }
    }

    const diffFactor = sumOne - sumInit;
    // console.log(diffFactor);

    // console.log(sumOne + diffFactor * (10 - 2));
    // console.log(sumOne + diffFactor * (100 - 2));

    // console.log(sumOne + diffFactor * (1_000_000 - 1));
    const result = sumOne + diffFactor * (1_000_000 - 2);
    // console.log(sumOne + diffFactor * 1_000_000);
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
    day: 11,
    input: () => processInput(11),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}