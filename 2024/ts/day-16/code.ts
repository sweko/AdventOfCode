// Solution for day 16 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";

type Cell = "#" | "." | "S" | "E";
type Facing = "N" | "E" | "S" | "W";

type Node = {
    x: number,
    y: number,
    facing: Facing,
    price: number
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const maze = lines.map(line => line.split("")) as Cell[][];
    return maze;
};

const findNeighbours = (node: Node, maze: Cell[][]) => {
    const neighbours: Node[] = [];
    const directions: Facing[] = ["N", "E", "S", "W"];
    const clockDirections: Facing[] = ["E", "S", "W", "N"];
    const counterDirections: Facing[] = ["W", "N", "E", "S"];
    const dindex = directions.indexOf(node.facing);

    // turn clockwise
    neighbours.push({
        x: node.x,
        y: node.y,
        facing: clockDirections[dindex],
        price: node.price + 1000
    });

    // turn counter clockwise
    neighbours.push({
        x: node.x,
        y: node.y,
        facing: counterDirections[dindex],
        price: node.price + 1000
    });

    // move forward
    const dx = node.facing === "E" ? 1 : node.facing === "W" ? -1 : 0;
    const dy = node.facing === "S" ? 1 : node.facing === "N" ? -1 : 0;
    
    if (maze[node.y + dy][node.x + dx] !== "#") {
        neighbours.push({
            x: node.x + dx,
            y: node.y + dy,
            facing: node.facing,
            price: node.price + 1
        });
    }

    return neighbours;
};

const findStart = (maze: Cell[][]) => {
    const y = maze.findIndex(row => row.includes("S"));
    const x = maze[y].indexOf("S");
    return { x, y };
}

const findEnd = (maze: Cell[][]) => {
    const y = maze.findIndex(row => row.includes("E"));
    const x = maze[y].indexOf("E");
    return { x, y };
}

type PricedCell = {
    cell: Cell,
    price: {
        "N" : number,
        "E" : number,
        "S" : number,
        "W" : number
    }
}

const printCell = (cell: PricedCell) => {
    switch (cell.cell) {
        case "#": return "######";
        case ".": return Math.min(cell.price["N"], cell.price["E"], cell.price["S"], cell.price["W"]).toFixed(0).padStart(6, " ");
        default: return "XXXXXXXXX";
    }
}

const partOne = (input: Cell[][], debug: boolean) => {
    const maze = input.map(row => row.map(cell => ({
        cell,
        price: {
            "N" : Number.MAX_SAFE_INTEGER,
            "E" : Number.MAX_SAFE_INTEGER,
            "S" : Number.MAX_SAFE_INTEGER,
            "W" : Number.MAX_SAFE_INTEGER
        }
    })));
    const start = findStart(input);
    maze[start.y][start.x] = { 
        cell : ".",
        price: {
            "N" : Number.MAX_SAFE_INTEGER,
            "E" : 0,
            "S" : Number.MAX_SAFE_INTEGER,
            "W" : Number.MAX_SAFE_INTEGER,
        }
    };
    const end = findEnd(input);
    maze[end.y][end.x].cell = ".";
    const startNode: Node = {
        x: start.x,
        y: start.y,
        facing: "E",
        price: 0
    };

    const queue: Node[] = [startNode];

    let bestPrice = Number.MAX_SAFE_INTEGER;

    while (queue.length > 0) {
        const current = queue.shift()!;
        const neighbours = findNeighbours(current, input);
        for (const neighbour of neighbours) {
            if (neighbour.x === end.x && neighbour.y === end.y) {
                //console.log(`Found end at ${neighbour.price}`);

                //printMatrix(maze, cell => printCell(cell));

                // return neighbour.price;
                if (neighbour.price < bestPrice) {
                    bestPrice = neighbour.price;
                }
            }
            if (maze[neighbour.y][neighbour.x].price[neighbour.facing] > neighbour.price) {
                maze[neighbour.y][neighbour.x].price[neighbour.facing] = neighbour.price;
                queue.push(neighbour);
            }
        }
    }

    return bestPrice;
};

const partTwo = (input: Cell[][], debug: boolean) => {
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

const showInput = (input: Cell[][]) => {
    console.log(input);
};

const test = (_: Cell[][]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Cell[][], number> = {
    day: 16,
    input: () => processInput(16),
    partOne,
    //partTwo,
    resultOne: resultOne,
    //resultTwo: resultTwo,
    showInput,
    test,
}