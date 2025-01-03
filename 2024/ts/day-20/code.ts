// Solution for day 20 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";


const processInput = (day: number) => {
    const lines = readInputLines(day);
    const maze = lines.map(line => line.split(""));
    return maze;
};

type Point = {
    x: number,
    y: number,
};

type WallCell = {
    value: "#",
}

type OpenCell = {
    value: ".",
    distance: number,
}

type Cell = WallCell | OpenCell;

type Maze = {
    start: Point,
    end: Point,
    maze: Cell[][];
}

const isOpenCell = (cell: Cell): cell is OpenCell => {
    return cell.value === ".";
}

const isWallCell = (cell: Cell): cell is WallCell => {
    return cell.value === "#";
}

const makeMaze = (source: string[][]) => {
    const input = source.map(row => row.slice());
    let start: Point = { x: 0, y: 0 };
    let end: Point = { x: 0, y: 0 };

    const width = input[0].length;
    const height = input.length;

    for (let rindex = 0; rindex < height; rindex++) {
        for (let cindex = 0; cindex < width; cindex++) {
            if (input[rindex][cindex] === "S") {
                start = { x: cindex, y: rindex };
                input[rindex][cindex] = ".";
            }
            if (input[rindex][cindex] === "E") {
                end = { x: cindex, y: rindex };
                input[rindex][cindex] = ".";
            }
        }
    }

    const maze: Maze = {
        start,
        end,
        maze: input.map(row => row.map(cell => {
            if (cell === "#") {
                return { value: "#" } as WallCell;
            }
            return { value: ".", distance: Number.MAX_SAFE_INTEGER } as OpenCell;
        })),
    };

    (maze.maze[start.y][start.x] as OpenCell).distance = 0;


    const queue: Point[] = [start];

    while (queue.length > 0) {
        const point = queue.shift()!;
        const cell = maze.maze[point.y][point.x];
        if (isWallCell(cell)) {
            continue;
        }

        const neighbours = [
            { x: point.x - 1, y: point.y },
            { x: point.x + 1, y: point.y },
            { x: point.x, y: point.y - 1 },
            { x: point.x, y: point.y + 1 },
        ]
        .filter(neighbour => neighbour.x >= 0 && neighbour.x < width && neighbour.y >= 0 && neighbour.y < height)
        .filter(neighbour => {
            const ncell = maze.maze[neighbour.y][neighbour.x];
            if (isOpenCell(ncell)) {
                return ncell.distance > (cell.distance + 1);
            }
            return false;
        });

        if (neighbours.length > 1) {
            throw new Error("More than one neighbour found");
        }

        if (neighbours.length === 0) {
            continue;
        }

        const neighbour = neighbours[0];
        //console.log(`Processing ${point.x},${point.y} -> ${neighbour.x},${neighbour.y}`);
        const ncell = maze.maze[neighbour.y][neighbour.x];
        if (isOpenCell(ncell)) {
            ncell.distance = cell.distance + 1;
            queue.push(neighbour);
        }
    }

    return maze;
};

const getNeighbours = (point: Point, distance: number, width: number, height: number) => {
    // generate all points that have a distance distance away from the point
    const neighbours = [];
    for (let x = point.x - distance; x <= point.x + distance; x += 1) {
        if (x < 0 || x >= width) {
            continue;
        }
        const y = point.y - distance;
    }
    
};

const getCheats = ({maze}: Maze, distance: number) => {
    const cheats: number[] = [];
    const width = maze[0].length;
    const height = maze.length;

    for (let rindex = 0; rindex < height; rindex++) {
        for (let cindex = 0; cindex < width; cindex++) {
            const cell = maze[rindex][cindex];
            if (isWallCell(cell)) {
                continue;
            }
            const neighbours: OpenCell[] = [
                { x: cindex - 2, y: rindex },
                { x: cindex + 2, y: rindex },
                { x: cindex, y: rindex - 2 },
                { x: cindex, y: rindex + 2 },
                { x: cindex - 1, y: rindex - 1 },
                { x: cindex + 1, y: rindex - 1 },
                { x: cindex - 1, y: rindex + 1 },
                { x: cindex + 1, y: rindex + 1 },
            ].filter(neighbour => neighbour.x >= 0 && neighbour.x < width && neighbour.y >= 0 && neighbour.y < height)
            .map(neighbour => maze[neighbour.y][neighbour.x])
            .filter(neighbour => isOpenCell(neighbour));

            for (const neighbour of neighbours) {
                const cheat = neighbour.distance - cell.distance - 2;
                if (cheat > 0) {
                    cheats.push(cheat);
                }
            }
        }
    }
    return cheats;
};

const partOne = (input: string[][], debug: boolean) => {
    const maze = makeMaze(input);


    printMatrix(maze.maze, cell => {
        if (isWallCell(cell)) {
            return "####";
        }
        return cell.distance.toString().padStart(3, " ").padEnd(4, " ");
    });

    const cheats = getCheats(maze, 2);

    const freqs = cheats.groupReduce(cheat => cheat, (a, _b) => a + 1, 0).toSorted((a, b) => a.key - b.key);
    for (const {key, value} of freqs) {
        if (value === 1) {
            console.log(`There is one cheat that saves ${key} picoseconds.`);
        } else {
            console.log(`There are ${value} cheats that save ${key} picoseconds.`);
        }
    }

    return cheats.filter(cheat => cheat >= 100).length;
};

const partTwo = (input: string[][], debug: boolean) => {
    return input.length;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: string[][]) => {
    console.log(input);
};

const test = (_: string[][]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<string[][], number> = {
    day: 20,
    input: () => processInput(20),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}