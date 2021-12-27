import { performance } from "perf_hooks";
import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { toHash } from "../extra/hash-helpers";
import { Performer } from "../extra/performer";
import { printMatrix } from "../extra/terminal-helper";
import { Puzzle } from "./model";

type Cell = "." | "v" | ">";

interface CellIndex {
    x: number, 
    y: number, 
    value: Cell
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    return lines.map(line => line.split("") as Cell[]);
};

const toKey = (ci: CellIndex) => `${ci.x},${ci.y}`;

const performer = new Performer<"copy-array"|"get-cells"|"get-cell-map">();

const executeStep = (matrix: Cell[][]): {matrix: Cell[][], moves: number} => {
    const height = matrix.length;
    const width = matrix[0].length;

    performer.start("copy-array");
    const result: Cell[][] = Array(matrix.length).fill(0).map(() => Array(matrix[0].length).fill("."));
    performer.end("copy-array");

    performer.start("get-cells");
    const cells = matrix.reduce<CellIndex[]>((acc, line, y) => [...acc, ...line.map((c, x) => ({x, y, value: c}))], []);
    performer.end("get-cells");
    performer.start("get-cell-map");
    const cellMap = {};
    for (const cell of cells) {
        cellMap[toKey(cell)] = cell;
    }
    performer.end("get-cell-map");
    // const cellMap = toHash<CellIndex, CellIndex>(cells, c => toKey(c));
    let moves = 0;
    // evaluate east
    const eastCucumbers = cells.filter(c => c.value === ">").map(c => {
        const index = (c.x + 1) % width;
        const key = toKey({x: index, y: c.y, value: "."});
        return {...c, next: cellMap[key]};
    });

    // move east
    const moveEast = eastCucumbers.filter(c => c.next.value === ".");
    const stayEast = eastCucumbers.filter(c => c.next.value !== ".");

    for (const cell of moveEast) {
        result[cell.y][cell.next.x] = ">";
        // modify cellMap
        const key = toKey(cell);
        const nextKey = toKey(cell.next);
        cellMap[key] = {...cell, value: "."};
        cellMap[nextKey] = {...cell.next, value: ">"};
        moves += 1;
    }
    for (const cell of stayEast) {
        result[cell.y][cell.x] = ">";
    }
    // evaluate south
    const southCucumbers = cells.filter(c => c.value === "v").map(c => {
        const index = (c.y + 1) % height;
        const key = toKey({x: c.x, y: index, value: "."});
        return {...c, next: cellMap[key]};
    });
    // move south
    const moveSouth = southCucumbers.filter(c => c.next.value === ".");
    const staySouth = southCucumbers.filter(c => c.next.value !== ".");

    for (const cell of moveSouth) {
        result[cell.next.y][cell.x] = "v";
        // modify cellMap
        const key = toKey(cell);
        const nextKey = toKey(cell.next);
        cellMap[key] = {...cell, value: "."};
        cellMap[nextKey] = {...cell.next, value: "v"};
        moves += 1;
    }

    for (const cell of staySouth) {
        result[cell.y][cell.x] = "v";
    }
    return { matrix: result, moves };
}

const partOne = (input: Cell[][], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    let matrix = input.map(line => line.slice());
    let moves = -1;
    let steps = 0;
    while (moves !== 0) {
        const { matrix: newMatrix, moves: newMoves } = executeStep(matrix);
        matrix = newMatrix;
        moves = newMoves;
        steps += 1;
    }
    console.log(performer.getValues())
    return steps;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};


const showInput = (input: Cell[][]) => {
    console.log(input);
};

const test = (_: Cell[][]) => {
    console.log("----Test-----");
};

export const solutionTwentyFive: Puzzle<Cell[][], number> = {
    day: 25,
    input: processInput,
    partOne,
    resultOne,
    showInput,
    test,
}
