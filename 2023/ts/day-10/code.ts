// Solution for day 10 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";

interface Point {
    x: number;
    y: number;
}

type NoPipe = {
    character: ".";
    top: false;
    bottom: false;
    left: false;
    right: false;
} & Point;


type PipePipe = {
    character: "|";
    top: true;
    bottom: true;
    left: false;
    right: false;
} & Point;

type DashPipe = {
    character: "-";
    top: false;
    bottom: false;
    left: true;
    right: true;
} & Point;

type ElPipe = {
    character: "L";
    top: true;
    bottom: false;
    left: false;
    right: true;
} & Point;

type JayPipe = {
    character: "J";
    top: true;
    bottom: false;
    left: true;
    right: false;
} & Point;

type SevenPipe = {
    character: "7";
    top: false;
    bottom: true;
    left: true;
    right: false;
} & Point;

type EffPipe = {
    character: "F";
    top: false;
    bottom: true;
    left: false;
    right: true;
} & Point;

type StartPipe = {
    character: "S";
    top: false;
    bottom: false;
    left: false;
    right: false;
} & Point;

interface Maze {
    pipes: Pipe[][];
    start: StartPipe;
}

type Pipe = NoPipe | PipePipe | DashPipe | ElPipe | JayPipe | SevenPipe | EffPipe | StartPipe;

type Direction = "top" | "bottom" | "left" | "right";

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const maze: Pipe[][] = [];
    let start: StartPipe = {} as StartPipe;
    for (let y = 0; y < lines.length; y++) {
        const line = lines[y];
        const row: Pipe[] = [];
        for (let x = 0; x < line.length; x++) {
            const character = line[x];
            if (character === ".") {
                row.push({ character, x, y, top: false, bottom: false, left: false, right: false } as NoPipe);
            } else if (character === "|") {
                row.push({ character, x, y, top: true, bottom: true, left: false, right: false } as PipePipe);
            } else if (character === "-") {
                row.push({ character, x, y, top: false, bottom: false, left: true, right: true } as DashPipe);
            } else if (character === "L") {
                row.push({ character, x, y, top: true, bottom: false, left: false, right: true } as ElPipe);
            } else if (character === "J") {
                row.push({ character, x, y, top: true, bottom: false, left: true, right: false } as JayPipe);
            } else if (character === "7") {
                row.push({ character, x, y, top: false, bottom: true, left: true, right: false } as SevenPipe);
            } else if (character === "F") {
                row.push({ character, x, y, top: false, bottom: true, left: false, right: true } as EffPipe);
            } else if (character === "S") {
                start = { character, x, y, top: false, bottom: false, left: false, right: false };
                row.push(start);
            } else {
                throw `Unknown character ${character}`;
            }
        }
        maze.push(row);
    }
    return {
        pipes: maze,
        start
    } as Maze;
};

const getStartPipe = (maze: Maze): Pipe => {
    // does the top match?
    const topRow = maze.pipes[maze.start.y - 1];
    const top = topRow ? topRow[maze.start.x] : null;
    const topMatch = top && top.bottom;
    // does the bottom match?
    const bottomRow = maze.pipes[maze.start.y + 1];
    const bottom = bottomRow ? bottomRow[maze.start.x] : null;
    const bottomMatch = bottom && bottom.top;
    // does the left match?
    const left = maze.pipes[maze.start.y][maze.start.x - 1];
    const leftMatch = left && left.right;
    // does the right match?
    const right = maze.pipes[maze.start.y][maze.start.x + 1];
    const rightMatch = right && right.left;

    if (topMatch) {
        if (bottomMatch) {
            const result: PipePipe =  {
                character: "|",
                x: maze.start.x,
                y: maze.start.y,
                top: true,
                bottom: true,
                left: false,
                right: false
            };
            return result;
        } else if (leftMatch) {
            const result: JayPipe =  {
                character: "J",
                x: maze.start.x,
                y: maze.start.y,
                top: true,
                bottom: false,
                left: true,
                right: false
            };
            return result;
        } else if (rightMatch) {
            const result: ElPipe =  {
                character: "L",
                x: maze.start.x,
                y: maze.start.y,
                top: true,
                bottom: false,
                left: false,
                right: true
            };
            return result;
        }
    } else {
        if (bottomMatch) {
            if (leftMatch) {
                const result: SevenPipe =  {
                    character: "7",
                    x: maze.start.x,
                    y: maze.start.y,
                    top: false,
                    bottom: true,
                    left: true,
                    right: false
                };
                return result;
            } else if (rightMatch) {
                const result: EffPipe =  {
                    character: "F",
                    x: maze.start.x,
                    y: maze.start.y,
                    top: false,
                    bottom: true,
                    left: false,
                    right: true
                };
                return result;
            }
        } else {
            if (leftMatch) {
                if (rightMatch) {
                    const result: DashPipe =  {
                        character: "-",
                        x: maze.start.x,
                        y: maze.start.y,
                        top: false,
                        bottom: false,
                        left: true,
                        right: true
                    };
                    return result;
                }
            }
        }
    }
    throw "No match found";
};

const nextDirection = (direction: Direction) => {
    switch (direction) {
        case "top":
            return "right";
        case "right":
            return "bottom";
        case "bottom":
            return "left";
        case "left":
            return "top";
    }
    throw "Unknown direction";
};

const getNextPipe = (maze: Maze, currentPipe: Pipe, direction: Direction) => {
    switch (direction) {
        case "top":
            return maze.pipes[currentPipe.y - 1][currentPipe.x];
        case "right":
            return maze.pipes[currentPipe.y][currentPipe.x + 1];
        case "bottom":
            return maze.pipes[currentPipe.y + 1][currentPipe.x];
        case "left":
            return maze.pipes[currentPipe.y][currentPipe.x - 1];
    }
    throw "Unknown direction";
};

const getInverseDirection = (direction: Direction) => {
    switch (direction) {
        case "top":
            return "bottom";
        case "right":
            return "left";
        case "bottom":
            return "top";
        case "left":
            return "right";
    }
    throw "Unknown direction";
}

const partOne = (input: Maze, debug: boolean) => {
    const actualStartPipe = getStartPipe(input);
    input.pipes[input.start.y][input.start.x] = actualStartPipe;
    let currentPipe = actualStartPipe;
    let direction: Direction = "top";
    while (!currentPipe[direction]) {
        direction = nextDirection(direction);
    }
    // console.log(`Starting at ${currentPipe.character} (${currentPipe.x},${currentPipe.y}) going ${direction}`);
    let nextPipe = getNextPipe(input, currentPipe, direction);
    let loopLength = 1;
    while (nextPipe !== actualStartPipe) {
        loopLength += 1;
        currentPipe = nextPipe;
        const restrictedDirection = getInverseDirection(direction);
        while (!currentPipe[direction]) {
            direction = nextDirection(direction);
            if (direction === restrictedDirection) {
                direction = nextDirection(direction);
            }
        }
        // console.log(`Continuing at ${currentPipe.character} (${currentPipe.x},${currentPipe.y}) going ${direction}`);
        nextPipe = getNextPipe(input, currentPipe, direction);
    }

    return Math.floor(loopLength / 2);
};

const floodFillRecurse = (matrix: string[][], x: number, y: number, fill: string) => {
    if (x < 0 || x >= matrix[0].length) {
        return;
    }
    if (y < 0 || y >= matrix.length) {
        return;
    }
    if (matrix[y][x] !== ".") {
        return;
    }
    matrix[y][x] = fill;
    floodFillRecurse(matrix, x + 1, y, fill);
    floodFillRecurse(matrix, x - 1, y, fill);
    floodFillRecurse(matrix, x, y + 1, fill);
    floodFillRecurse(matrix, x, y - 1, fill);
}

const floodFill = (matrix: string[][], x: number, y: number, fill: string) => {
    const queue: Point[] = [];
    queue.push({ x, y });

    while (queue.length > 0) {
        const point = queue.shift()!;
        if (point.x < 0 || point.x >= matrix[0].length) {
            continue;
        }
        if (point.y < 0 || point.y >= matrix.length) {
            continue;
        }
        if (matrix[point.y][point.x] !== ".") {
            continue;
        }
        matrix[point.y][point.x] = fill;
        queue.push({ x: point.x + 1, y: point.y });
        queue.push({ x: point.x - 1, y: point.y });
        queue.push({ x: point.x, y: point.y + 1 });
        queue.push({ x: point.x, y: point.y - 1 });
    }
}

const partTwo = (input: Maze, debug: boolean) => {

    const actualStartPipe = getStartPipe(input);
    input.pipes[input.start.y][input.start.x] = actualStartPipe;
    let currentPipe = actualStartPipe;
    let direction: Direction = "top";
    while (!currentPipe[direction]) {
        direction = nextDirection(direction);
    }
    // console.log(`Starting at ${currentPipe.character} (${currentPipe.x},${currentPipe.y}) going ${direction}`);
    let nextPipe = getNextPipe(input, currentPipe, direction);
    const loop: Pipe[] = [];
    while (nextPipe !== actualStartPipe) {
        loop.push(currentPipe);
        currentPipe = nextPipe;
        const restrictedDirection = getInverseDirection(direction);
        while (!currentPipe[direction]) {
            direction = nextDirection(direction);
            if (direction === restrictedDirection) {
                direction = nextDirection(direction);
            }
        }
        // console.log(`Continuing at ${currentPipe.character} (${currentPipe.x},${currentPipe.y}) going ${direction}`);
        nextPipe = getNextPipe(input, currentPipe, direction);
    }
    loop.push(currentPipe);

    const original: string[][] = [];

    for (let y = 0; y < input.pipes.length; y++) {
        const row = input.pipes[y];
        const matrixRow: string[] = [];
        for (let x = 0; x < row.length; x++) {
            const link = loop.find(pipe => pipe.x === x && pipe.y === y);
            if (link) {
                matrixRow.push(link.character);
                continue;
            }
            matrixRow.push(".");
        }
        original.push(matrixRow);
    }

    const expanded: string[][] = Array(original.length * 3)
        .fill(null)
        .map(() => Array(original[0].length * 3).fill("."));

    for (let y = 0; y < original.length; y++) {
        const row = original[y];
        for (let x = 0; x < row.length; x++) {
            const character = row[x];
            if (character === ".") {
                continue;
            }
            const ey = y * 3 + 1;
            const ex = x * 3 + 1;
            expanded[ey][ex] = character;

            if (character === "|") {
                expanded[ey - 1][ex] = character;
                expanded[ey + 1][ex] = character;
                continue;
            }
            if (character === "-") {
                expanded[ey][ex - 1] = character;
                expanded[ey][ex + 1] = character;
                continue;
            }
            if (character === "L") {
                expanded[ey - 1][ex] = "|";
                expanded[ey][ex + 1] = "-";
                continue;
            }
            if (character === "J") {
                expanded[ey - 1][ex] = "|";
                expanded[ey][ex - 1] = "-";
                continue;
            }
            if (character === "7") {
                expanded[ey + 1][ex] = "|";
                expanded[ey][ex - 1] = "-";
                continue;
            }
            if (character === "F") {
                expanded[ey + 1][ex] = "|";
                expanded[ey][ex + 1] = "-";
                continue;
            }

            throw `Unknown character ${character}`;
        }
    }

    floodFill(expanded, 0, 0, "X");

    const scrunched: string[][] = Array(original.length)
        .fill(null)
        .map(() => Array(original[0].length).fill("?"));

    for (let y = 0; y < expanded.length; y++) {
        if (y % 3 !== 1) {
            continue;
        }
        const row = expanded[y];
        for (let x = 0; x < row.length; x++) {
            if (x % 3 !== 1) {
                continue;
            }
            scrunched[Math.floor(y / 3)][Math.floor(x / 3)] = row[x];
        }
    }

    const result = scrunched.sum(row => row.filter(item => item === ".").length);

    return result;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Maze) => {
    console.log(input);
};

const test = (_: Maze) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Maze, number> = {
    day: 10,
    input: () => processInput(10),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}