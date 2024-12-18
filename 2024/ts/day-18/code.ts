// Solution for day 18 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const points = lines.map(l => l.split(",").map(n => parseInt(n, 10)) as [number, number]);
    return points;
};

type Cell = {
    value: boolean,
    price: number
};

type Point = {
    x: number,
    y: number,
};

//this variable is different for each input
const global = {
    width: 71,
    limit: 1024
}

const partOne = (input: [number, number][], debug: boolean) => {

    const width = global.width;
    const limit = global.limit;
    const grid: Cell[][] = Array(width).fill(0).map(() => Array(width).fill(0).map(() => ({
        value: false,
        price: Number.MAX_SAFE_INTEGER
    })));

    for (const [cindex, rindex] of input.slice(0, limit)) {
        grid[rindex][cindex].value = true;
    }

    const queue: Point[] = [{ x: 0, y: 0 }];
    grid[0][0].price = 0;

    while (queue.length > 0) {
        const {x, y} = queue.shift()!;
        const currentPrice = grid[y][x].price;

        const neighbors = [
            { x: x - 1, y: y },
            { x: x + 1, y: y },
            { x: x, y: y - 1 },
            { x: x, y: y + 1 },
        ]
        .filter(n => n.x >= 0 && n.x < width && n.y >= 0 && n.y < width)
        .filter(n => grid[n.y][n.x].value === false)
        .filter(n => grid[n.y][n.x].price > currentPrice + 1);

        for (const neighbor of neighbors) {
            grid[neighbor.y][neighbor.x].price = currentPrice + 1;
            queue.push(neighbor);
        }
    }

    // printMatrix(grid, c => c.value ? "#" : ".");
    // console.log("-------------------");
    // printMatrix(grid, c => c.value ? "#####" : c.price === Number.MAX_SAFE_INTEGER ? "  .  " : c.price.toString().padStart(4, " ").padEnd(5, " "));

    return grid[width-1][width-1].price;
};


const findPath = (input: [number, number][], blockLimit: number) => {
    const width = global.width;

    const grid: Cell[][] = Array(width).fill(0).map(() => Array(width).fill(0).map(() => ({
        value: false,
        price: Number.MAX_SAFE_INTEGER
    })));

    for (const [cindex, rindex] of input.slice(0, blockLimit)) {
        grid[rindex][cindex].value = true;
    }

    const queue: Point[] = [{ x: 0, y: 0 }];
    grid[0][0].price = 0;

    while (queue.length > 0) {
        const {x, y} = queue.shift()!;
        const currentPrice = grid[y][x].price;

        const neighbors = [
            { x: x - 1, y: y },
            { x: x + 1, y: y },
            { x: x, y: y - 1 },
            { x: x, y: y + 1 },
        ]
        .filter(n => n.x >= 0 && n.x < width && n.y >= 0 && n.y < width)
        .filter(n => grid[n.y][n.x].value === false)
        .filter(n => grid[n.y][n.x].price > currentPrice + 1);

        for (const neighbor of neighbors) {
            grid[neighbor.y][neighbor.x].price = currentPrice + 1;
            queue.push(neighbor);
        }
    }

    // printMatrix(grid, c => c.value ? "#" : ".");
    // console.log("-------------------");
    // printMatrix(grid, c => c.value ? "#####" : c.price === Number.MAX_SAFE_INTEGER ? "  .  " : c.price.toString().padStart(4, " ").padEnd(5, " "));

    return grid[width-1][width-1].price;
};

const partTwo = (input: [number, number][], debug: boolean) => {
    const lowLimit = global.limit;
    let blockLimit = lowLimit;
    while (blockLimit < input.length) {
        const result = findPath(input, blockLimit);
        if (result === Number.MAX_SAFE_INTEGER) {
            console.log(`Block limit ${blockLimit} (${input[blockLimit-1]}) is unreachable`);
            return blockLimit;
        }
        blockLimit += 1;
    }
    return blockLimit;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: [number, number][]) => {
    console.log(input);
};

const test = (_: [number, number][]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<[number, number][], number> = {
    day: 18,
    input: () => processInput(18),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}