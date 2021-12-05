import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { printMatrix } from "../extra/terminal-helper";
import { Puzzle } from "./model";

interface Point {
    x : number;
    y : number;
}

interface Vent {
    from: Point;
    to: Point;
}

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    const regex = /^(\d+),(\d+) -> (\d+),(\d+)$/;
    const result = input.map(line => {
        const match = regex.exec(line);
        if (!match) {
            throw new Error("Invalid input");
        }
        return {
            from: {
                x: parseInt(match[1], 10),
                y: parseInt(match[2], 10)
            },
            to: {
                x: parseInt(match[3], 10),
                y: parseInt(match[4], 10)
            }
        }
    })
    return result;
};

const partOne = (input: Vent[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const lines = input.filter(vent => (vent.from.x === vent.to.x) || (vent.from.y === vent.to.y));

    const xmax = Math.max(...lines.map(line => [line.from.x, line.to.x]).flat());
    const ymax = Math.max(...lines.map(line => [line.from.y, line.to.y]).flat());

    const grid = new Array(xmax + 1).fill(0).map(_ => new Array(ymax + 1).fill(0));

    for (const line of lines) {
        const fromx = Math.min(line.from.x, line.to.x);
        const tox = Math.max(line.from.x, line.to.x);
        const fromy = Math.min(line.from.y, line.to.y);
        const toy = Math.max(line.from.y, line.to.y);

        for (let rindex = fromx; rindex <= tox ; rindex++) {
            for (let cindex = fromy; cindex <= toy ; cindex++) {
                grid[cindex][rindex] += 1;
            }
        }
    }

    const result = grid.map(row => row.filter(cell => cell > 1).length).reduce((a, b) => a + b, 0);
    return result;
};

const partTwo = (input: Vent[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    const xmax = Math.max(...input.map(line => [line.from.x, line.to.x]).flat());
    const ymax = Math.max(...input.map(line => [line.from.y, line.to.y]).flat());
    const grid = new Array(xmax + 1).fill(0).map(_ => new Array(ymax + 1).fill(0));

    const diagonals = input.filter(vent => (vent.from.x !== vent.to.x) && (vent.from.y !== vent.to.y));
    const gridLines = input.filter(vent => (vent.from.x === vent.to.x) || (vent.from.y === vent.to.y));

    for (const line of gridLines) {
        const fromx = Math.min(line.from.x, line.to.x);
        const tox = Math.max(line.from.x, line.to.x);
        const fromy = Math.min(line.from.y, line.to.y);
        const toy = Math.max(line.from.y, line.to.y);

        for (let rindex = fromx; rindex <= tox ; rindex++) {
            for (let cindex = fromy; cindex <= toy ; cindex++) {
                grid[cindex][rindex] += 1;
            }
        }
    }

    for (const line of diagonals) {
        const count = Math.abs(line.from.x -line.to.x) + 1;
        const xdir = line.from.x < line.to.x ? 1 : -1;
        const ydir = line.from.y < line.to.y ? 1 : -1;
        for (let index = 0; index < count; index++) {
            const x = line.from.x + xdir * index;
            const y = line.from.y + ydir * index;
            grid[y][x] += 1;
        }
    }

    const result = grid.map(row => row.filter(cell => cell > 1).length).reduce((a, b) => a + b, 0);
    return result;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Vent[]) => {
    console.log(input);
};

const test = (_: Vent[]) => {
    console.log("----Test-----");
};

export const solutionFive: Puzzle<Vent[], number> = {
    day: 5,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
