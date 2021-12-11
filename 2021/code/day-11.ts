import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { printMatrix } from "../extra/terminal-helper";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    const lines = input.map(line => line.split("").map(char => parseInt(char, 10)));
    return lines;
};

const executeStep = (grid: number[][]) : [number[][], number] => {
    const fillValue = 0;
    const expanded = [
        Array(grid[0].length + 2).fill(fillValue),
        ...grid.map(row => [fillValue, ...row, fillValue]),
        Array(grid[0].length + 2).fill(fillValue),
    ];

    const fulls = [];
    let flashes = 0;

    for (let rindex = 1; rindex < expanded.length-1; rindex++) {
        const row = expanded[rindex];
        for (let cindex = 1; cindex < row.length-1; cindex++) {
            row[cindex] += 1;
            if (row[cindex] > 9) {
                fulls.push({x: rindex, y: cindex});
            }
        }
    }

    while (fulls.length > 0) {
        const {x, y} = fulls.shift();
        if (expanded[x][y] < 0) {
            continue;
        }
        expanded[x][y] = -100;
        flashes += 1;
        expanded[x-1][y] += 1;
        if (expanded[x-1][y] > 9) {
            fulls.push({x: x-1, y: y});
        }
        expanded[x+1][y] += 1;
        if (expanded[x+1][y] > 9) {
            fulls.push({x: x+1, y: y});
        }
        expanded[x][y-1] += 1;
        if (expanded[x][y-1] > 9) {
            fulls.push({x: x, y: y-1});
        }
        expanded[x][y+1] += 1;
        if (expanded[x][y+1] > 9) {
            fulls.push({x: x, y: y+1});
        }
        expanded[x-1][y-1] += 1;
        if (expanded[x-1][y-1] > 9) {
            fulls.push({x: x-1, y: y-1});
        }
        expanded[x+1][y-1] += 1;
        if (expanded[x+1][y-1] > 9) {
            fulls.push({x: x+1, y: y-1});
        }
        expanded[x-1][y+1] += 1;
        if (expanded[x-1][y+1] > 9) {
            fulls.push({x: x-1, y: y+1});
        }
        expanded[x+1][y+1] += 1;
        if (expanded[x+1][y+1] > 9) {
            fulls.push({x: x+1, y: y+1});
        }
    }

    for (let rindex = 1; rindex < expanded.length-1; rindex++) {
        const row = expanded[rindex];
        for (let cindex = 1; cindex < row.length-1; cindex++) {
            if (row[cindex]<0) 
                row[cindex] = 0;
        }
    }

    return [
        expanded.slice(1, expanded.length-1).map(row => row.slice(1, row.length-1)),
        flashes
    ];
}

const partOne = (input: number[][], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let grid = input;
    let flashes = 0;
    let totalFlashes = 0;
    for (let index = 0; index < 100; index++) {
        [grid, flashes] = executeStep(grid);
        totalFlashes += flashes;
    }

    return totalFlashes;
};

const partTwo = (input: number[][], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let grid = input;
    let flashes = 0;
    let index = 0;
    while (true) {
        [grid, flashes] = executeStep(grid);
        index += 1;
        const gridSum = grid.reduce((acc, row) => acc + row.reduce((acc, cell) => acc + cell, 0), 0);
        if (gridSum === 0) {
            break;
        }
    }

    return index;
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

export const solutionEleven: Puzzle<number[][], number> = {
    day: 11,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
