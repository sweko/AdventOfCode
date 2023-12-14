// Solution for day 14 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";

type Direction = "up" | "down" | "left" | "right";
type Cell = "." | "#" | "O";

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const cells = lines.map(line => line.split("") as Cell[]);
    return cells;
};



const tiltUp = (input: Cell[][]) => {
    const rockRow = Array(input[0].length).fill('#');
    const cells = [rockRow, ...input.map(line => line.slice())];
    for (let x = 0; x < cells.length; x++) {
        const row = cells[x];
        for (let y = 0; y < row.length; y++) {
            if (cells[x][y] !== "O") {
                continue;
            }
            let xmove = x - 1;
            while (cells[xmove][y] === ".") {
                xmove -= 1;
            }
            xmove += 1;
            if (xmove !== x) {
                cells[xmove][y] = "O";
                cells[x][y] = ".";
            }
        }
    }
    return cells.slice(1);
}

const calculateWeight = (cells: Cell[][]) => {
    return cells
        .map(row => row.filter(cell => cell === "O").length)
        .sum((count, index) => count * (cells.length - index));
}

const partOne = (input: Cell[][], debug: boolean) => {
    const cells = tiltUp(input);
    const weight = calculateWeight(cells);
    return weight;
};

const tiltLeft = (input: Cell[][]) => {
    const cells = input.map(line => ["#", ...line]) as Cell[][];
    for (let y = 0; y < cells[0].length; y++) {
        for (let x = 0; x < cells.length; x++) {
            if (cells[x][y] !== "O") {
                continue;
            }
            let ymove = y - 1;
            while (cells[x][ymove] === ".") {
                ymove -= 1;
            }
            ymove += 1;
            if (ymove !== y) {
                cells[x][ymove] = "O";
                cells[x][y] = ".";
            }
        }
    }
    return cells.map(line => line.slice(1));
}

const tiltRight = (input: Cell[][]) => {
    const cells = input.map(line => [...line, "#"]) as Cell[][];
    for (let y = cells[0].length - 1; y >= 0; y--) {
        for (let x = 0; x < cells.length; x++) {
            if (cells[x][y] !== "O") {
                continue;
            }
            let ymove = y + 1;
            while (cells[x][ymove] === ".") {
                ymove += 1;
            }
            ymove -= 1;
            if (ymove !== y) {
                cells[x][ymove] = "O";
                cells[x][y] = ".";
            }
        }
    }
    return cells.map(line => line.slice(0, line.length - 1));
}

const tiltDown = (input: Cell[][]) => {
    const rockRow = Array(input[0].length).fill('#');
    const cells = [...input.map(line => line.slice()), rockRow];
    for (let x = cells.length - 1; x >= 0; x--) {
        const row = cells[x];
        for (let y = 0; y < row.length; y++) {
            if (cells[x][y] !== "O") {
                continue;
            }
            let xmove = x + 1;
            while (cells[xmove][y] === ".") {
                xmove += 1;
            }
            xmove -= 1;
            if (xmove !== x) {
                cells[xmove][y] = "O";
                cells[x][y] = ".";
            }
        }
    }
    return cells.slice(0, cells.length - 1);
}

const cellsToString = (cells: Cell[][]) => {
    return cells.map(line => line.join("")).join("|");
}

const stringToCells = (input: string) => {
    return input.split("|").map(line => line.split("") as Cell[]);
}

const partTwo = (input: Cell[][], debug: boolean) => {
    const cycleCount = 1_000_000_000;
    const cache = new Map<number, string>();

    let cycleLength = 0;
    let cycleStart = 0;

    let cells = input.map(line => line.slice());
    for (let index = 1; index <= cycleCount; index++) {
        cells = tiltUp(cells);
        cells = tiltLeft(cells);
        cells = tiltDown(cells);
        cells = tiltRight(cells);

        const key = cellsToString(cells);
        const values = [...cache.entries()];
        const found = values.find(([_, value]) => value === key);
        if (found) {
            // console.log(`Found cycle at index ${index}, match with ${found[0]}`);
            cycleLength = index - found[0];
            cycleStart = found[0];
            break;
        }
        cache.set(index, key);
    }

    const cycleIndex = (cycleCount - cycleStart + 1) % cycleLength;
    const mapIndex = cycleIndex + cycleStart - 1;

    const finalCells = stringToCells(cache.get(mapIndex)!);
    const weight = calculateWeight(finalCells);

    return weight;
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
    day: 14,
    input: () => processInput(14),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}