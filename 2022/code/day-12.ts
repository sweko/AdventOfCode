import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Maze {
    start: { x: number, y: number };
    end: { x: number, y: number };
    map: number[][];
}

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    let start = { x: 0, y: 0 };
    let end = { x: 0, y: 0 };

    const map = input.map((line, y) => line.split("").map((char, x) => {
        if (char === "S") {
            start = { x, y };
            char = "a";
        }
        if (char === "E") {
            end = { x, y };
            char = "z";
        }
        return char.charCodeAt(0) - 97;
    })
    );

    return {
        start,
        end,
        map
    };
};

const findPath = (start: { x: number, y: number }, end: { x: number, y: number }, maze: number[][]) => {
    const width = maze[0].length;
    const height = maze.length;

    const result: number[][] = Array(height).fill(0).map(() => Array(width).fill(Number.POSITIVE_INFINITY));
    result[start.y][start.x] = 0;

    const queue = [start];

    while (queue.length > 0) {
        const current = queue.shift();
        const currentElevation = maze[current.y][current.x];
        const currentResult = result[current.y][current.x];

        const neighbours = [
            { x: current.x, y: current.y - 1 },
            { x: current.x, y: current.y + 1 },
            { x: current.x - 1, y: current.y },
            { x: current.x + 1, y: current.y }
        ].filter(n => n.x >= 0 && n.x < width && n.y >= 0 && n.y < height) // filter out of bounds neighbours
            .filter(n => maze[n.y][n.x] <= currentElevation + 1) // filter out neighbours that are too high
            .filter(n => result[n.y][n.x] > currentResult + 1); // filter out neighbours that have already been visited

        for (const neighbour of neighbours) {
            result[neighbour.y][neighbour.x] = currentResult + 1;
            queue.push(neighbour);
        }
    }

    return result[end.y][end.x];
}

const partOne = ({start, end, map}: Maze, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    return findPath(start, end, map);
}

const partTwo = ({end, map}: Maze, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const as = [];
    for (let yindex = 0; yindex < map.length; yindex++) {
        const row = map[yindex];
        for (let xindex = 0; xindex < row.length; xindex++) {
            const element = row[xindex];
            if (element === 0) {
                as.push({ x: xindex, y: yindex });
            }
        }
    }

    const trailLengths = as.map(a => findPath(a, end, map)).sort((a, b) => a - b);

    return trailLengths[0];
};

const resultOne = (_: Maze, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: Maze, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Maze) => {
    console.log(input);
};

const test = (_: Maze) => {
    console.log("----Test-----");
};

export const solutionTwelve: Puzzle<Maze, number> = {
    day: 12,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
