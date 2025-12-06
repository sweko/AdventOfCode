// Solution for day 4 of advent of code 2025

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";

type Cell = "." | "@";

type RemoveResponse = {
    matrix: Cell[][];
    removed: number;
};

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const cells = lines.map(line => line.split("") as Cell[]);
    return cells;
};

const removeLayer = (matrix: Cell[][]): RemoveResponse => {
    let count = 0;
    const copy = matrix.map(row => [...row]);
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] !== "@") {
                continue;
            }

            const topRow = matrix[row - 1];
            const topLeft = topRow?.[col - 1] === "@" ? 1 : 0;
            const topTop = topRow?.[col] === "@" ? 1 : 0;
            const topRight = topRow?.[col + 1] === "@" ? 1 : 0;
            const left = matrix[row][col - 1] === "@" ? 1 : 0;
            const right = matrix[row][col + 1] === "@" ? 1 : 0;
            const bottomRow = matrix[row + 1];
            const bottomLeft = bottomRow?.[col - 1] === "@" ? 1 : 0;
            const bottomBottom = bottomRow?.[col] === "@" ? 1 : 0;
            const bottomRight = bottomRow?.[col + 1] === "@" ? 1 : 0;

            const neighbors = topLeft + topTop + topRight + left + right + bottomLeft + bottomBottom + bottomRight;

            if (neighbors < 4) {
                copy[row][col] = ".";
                count += 1;
            }
        }
    }
    return {
        matrix: copy,
        removed: count,
    }
};

const partOne = (input: Cell[][], debug: boolean) => {
    const {removed: result} = removeLayer(input);
    return result;
};

const partTwo = (input: Cell[][], debug: boolean) => {
    let {removed, matrix} = removeLayer(input);
    let totalRemoved = removed;
    //console.log(`After removal #1, removed ${removed} cells, for a total of ${totalRemoved}`);

    let passCount = 1;
    while (removed > 0) {
        passCount += 1;
        const response = removeLayer(matrix);
        matrix = response.matrix;
        removed = response.removed;
        totalRemoved += removed;
        //console.log(`After removal #${passCount}, removed ${removed} cells, for a total of ${totalRemoved}`);
    }

    return totalRemoved;
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
    day: 4,
    input: () => processInput(4),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}