// Solution for day 20 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";
import { get } from "http";


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
    const neighbours: Point[] = [];
    if (point.x - distance >= 0) {
        neighbours.push({ x: point.x - distance, y: point.y });
    }
    for (let deltax = - distance + 1; deltax <= distance - 1; deltax += 1) {
        const x = point.x + deltax;
        if (x < 0 || x >= width) {
            continue;
        }
        const deltay = distance - Math.abs(deltax);
        const lowy = point.y - deltay;
        if (lowy >= 0) {
            neighbours.push({ x, y: lowy });
        }

        const highy = point.y + deltay;
        if (highy < height) {
            neighbours.push({ x, y: highy });
        }
    }
    if (point.x + distance < width) {
        neighbours.push({ x: point.x + distance, y: point.y });
    }
    return neighbours;
};

// const getNeighboursUpToDistance = (point: Point, distance: number, width: number, height: number) => {
//     const result: Point[] = [];
//     for (let index = 2; index <= distance; index++) {
//         result.push(...getNeighbours(point, index, width, height));
//     }
//     return result;
// };

const getCheats = ({ maze }: Maze, distance: number) => {
    const cheats: number[] = [];
    const width = maze[0].length;
    const height = maze.length;

    for (let rindex = 0; rindex < height; rindex++) {
        for (let cindex = 0; cindex < width; cindex++) {
            const cell = maze[rindex][cindex];
            if (isWallCell(cell)) {
                continue;
            }

            for (let dindex = 2; dindex <= distance; dindex++) {
                const neighbours: OpenCell[] = getNeighbours({ x: cindex, y: rindex }, dindex, width, height)
                    .filter(neighbour => neighbour.x >= 0 && neighbour.x < width && neighbour.y >= 0 && neighbour.y < height)
                    .map(neighbour => maze[neighbour.y][neighbour.x])
                    .filter(neighbour => isOpenCell(neighbour));

                for (const neighbour of neighbours) {
                    const cheat = neighbour.distance - cell.distance - dindex;
                    if (cheat > 0) {
                        cheats.push(cheat);
                    }
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
    for (const { key, value } of freqs) {
        if (value === 1) {
            console.log(`There is one cheat that saves ${key} picoseconds.`);
        } else {
            console.log(`There are ${value} cheats that save ${key} picoseconds.`);
        }
    }

    return cheats.filter(cheat => cheat >= 100).length;
};

const partTwo = (input: string[][], debug: boolean) => {
    const maze = makeMaze(input);

    printMatrix(maze.maze, cell => {
        if (isWallCell(cell)) {
            return "####";
        }
        return cell.distance.toString().padStart(3, " ").padEnd(4, " ");
    });

    const cheats = getCheats(maze, 7);

    const freqs = cheats.groupReduce(cheat => cheat, (a, _b) => a + 1, 0).toSorted((a, b) => a.key - b.key);
    for (const { key, value } of freqs) {
        if (value === 1) {
            console.log(`There is one cheat that saves ${key} picoseconds.`);
        } else {
            console.log(`There are ${value} cheats that save ${key} picoseconds.`);
        }
    }

    return cheats.filter(cheat => cheat >= 50).length;
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

    const distance = (a: Point, b: Point) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

    const point = { x: 13, y: 15 };
    const width = 50;
    const height = 50;

    const result = Array(19).fill(0).map((_, index) => getNeighbours(point, index, width, height)).flatMap(neighbours => neighbours);
    console.log(`Neighbours for ${point.x},${point.y} are (${result.length}):`);

    for (const neighbour of result) {
        console.log(`Distance from ${point.x},${point.y} to ${neighbour.x},${neighbour.y} is ${distance(point, neighbour)}`);
    }
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