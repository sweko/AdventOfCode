// Solution for day 6 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";
import { Performancer } from "../utils/performancer";

type Input = {
    maze: boolean[][]; // true is open, false is wall
    start: Position;
}

type Position = {
    x: number;
    y: number;
}

type Direction = "up" | "down" | "left" | "right";

type State = {
    position: Position;
    direction: Direction;
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const result: Input = {
        maze: [],
        start: {
            x: 0,
            y: 0,
        }
    }

    for (const line of lines) {
        const cells = line.split("");
        const row: boolean[] = [];
        for (const cell of cells) {
            if (cell === "#") {
                row.push(false);
            } else if (cell === "^") {
                result.start.x = row.length;
                result.start.y = result.maze.length;
                row.push(true);
            } else {
                row.push(true);
            }
        }
        result.maze.push(row);
    }

    return result;
};

const positionToString = ({ x, y }: Position) => `${x},${y}`;

const move = ({ position, direction }: State) => {
    switch (direction) {
        case "up":
            return { x: position.x, y: position.y - 1 };
        case "down":
            return { x: position.x, y: position.y + 1 };
        case "left":
            return { x: position.x - 1, y: position.y };
        case "right":
            return { x: position.x + 1, y: position.y };
    }
};

const turnRight = ({ direction }: State) => {
    switch (direction) {
        case "up":
            return "right";
        case "right":
            return "down";
        case "down":
            return "left";
        case "left":
            return "up";
    }
};

const partOne = (input: Input, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const visiteds = new Set<string>();
    visiteds.add(positionToString(input.start));

    const state: State = {
        position: input.start,
        direction: "up",
    }

    const width = input.maze[0].length;
    const height = input.maze.length;

    while (true) {
        // have the guard take a step
        const next = move(state);

        // check if we go overboard
        if (next.x < 0 || next.x >= width || next.y < 0 || next.y >= height) {
            break;
        }

        if (input.maze[next.y][next.x]) {
            state.position = next;
            visiteds.add(positionToString(next));
        } else {
            // turn right
            state.direction = turnRight(state);
        }
    }

    return visiteds.size;
};

const stateToString = ({ position, direction }: State) => `${positionToString(position)}-${direction}`;

const willItLoop = (maze: boolean[][], position: Position, direction: Direction) => {
    Performancer.start("willItLoop");
    const visiteds = new Set<string>();
    const width = maze[0].length;
    const height = maze.length;

    const state: State = {
        position: position,
        direction: direction,
    }

    while (true) {
        // have the guard take a step
        const next = move(state);

        // check if we go overboard
        if (next.x < 0 || next.x >= width || next.y < 0 || next.y >= height) {
            Performancer.end("willItLoop");
            return false;
        }

        if (maze[next.y][next.x]) {
            state.position = next;
            const stateString = stateToString(state);
            if (visiteds.has(stateString)) {
                Performancer.end("willItLoop");
                return true;
            }
            visiteds.add(stateString);
        } else {
            // turn right
            state.direction = turnRight(state);
        }
    }
};

const partTwo = (input: Input, debug: boolean) => {
    const width = input.maze[0].length;
    const height = input.maze.length;

    let positions = 0;
    for (let rindex = 0; rindex < height; rindex++) {
        const row = input.maze[rindex];
        for (let cindex = 0; cindex < width; cindex++) {
            if (!row[cindex]) {
                continue;
            }

            // make a copy of the maze with the added obstacle
            const maze = input.maze.map(row => row.slice());
            maze[rindex][cindex] = false;

            if (willItLoop(maze, input.start, "up")){
                positions += 1;
            }
        }
    }

    Performancer.print("willItLoop");

    return positions;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Input) => {
    console.log(input);
};

const test = (_: Input) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Input, number> = {
    day: 6,
    input: () => processInput(6),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}