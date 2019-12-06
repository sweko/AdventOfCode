import { readInputLines } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

type Direction = "L" | "R" | "U" | "D";

interface Command {
    direction: Direction;
    ammount: number;
}

interface CommandPair {
    first: Command[],
    second: Command[];
}

const vectors = {
    "D": { x: 0, y: -1 },
    "U": { x: 0, y: +1 },
    "L": { x: -1, y: 0 },
    "R": { x: +1, y: 0 },
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const commands = {
        first: lineToCommands(lines[0]),
        second: lineToCommands(lines[1])
    }
    return commands;
};

const lineToCommands = (line: string): Command[] => line.split(",").map(cmd => ({
    direction: cmd.slice(0, 1) as Direction,
    ammount: parseInt(cmd.slice(1))
}));

const partOne = (commands: CommandPair) => {
    const fmaze = runMazeOne(commands.first).sort();
    const smaze = runMazeOne(commands.second).sort();
    let findex = 0, sindex = 0;
    let closest = Number.MAX_SAFE_INTEGER;
    while (findex !== fmaze.length && sindex !== fmaze.length) {
        if (fmaze[findex] > smaze[sindex]) {
            sindex += 1;
        } else if (fmaze[findex] < smaze[sindex]) {
            findex += 1;
        } else {
            const coords = fmaze[findex].split(":").map(c => parseInt(c));
            const value = Math.abs(coords[0]) + Math.abs(coords[1]);
            if (closest > value) {
                closest = value;
            }
            findex += 1;
            sindex += 1;
        }
    }
    return closest;
};

const runMazeOne = (commands: Command[]) => {
    const maze: string[] = [];
    let locx = 0, locy = 0;// = { x: 0, y: 0 };
    for (const command of commands) {
        const vector = vectors[command.direction];
        for (let index = 0; index < command.ammount; index += 1) {
            const pos = {
                x: locx + vector.x,
                y: locy + vector.y
            };
            const id = `${pos.x}:${pos.y}`;
            maze.push(id);
            locx = pos.x;
            locy = pos.y;
        }
    }
    return maze;
}

const partTwo = (commands: CommandPair) => {
    const fmaze = runMazeTwo(commands.first);
    const smaze = runMazeTwo(commands.second);
    fmaze.sort((akvp, bkvp) => akvp.key > bkvp.key ? 1 : akvp.key < bkvp.key ? -1 : 0);
    smaze.sort((akvp, bkvp) => akvp.key > bkvp.key ? 1 : akvp.key < bkvp.key ? -1 : 0);
    let findex = 0, sindex = 0;
    let closest = Number.MAX_SAFE_INTEGER;
    while (findex !== fmaze.length && sindex !== fmaze.length) {
        if (fmaze[findex].key > smaze[sindex].key) {
            sindex += 1;
        } else if (fmaze[findex].key < smaze[sindex].key) {
            findex += 1;
        } else {
            const value = fmaze[findex].step + smaze[sindex].step;
            if (closest > value) {
                closest = value
            }
            findex += 1;
            sindex += 1;
        }
    }
    return closest;
};

const runMazeTwo = (commands: Command[]) => {
    const maze: { key: string, step: number }[] = [];
    let loc = { x: 0, y: 0 };
    let steps = 0;
    for (const command of commands) {
        const vector = vectors[command.direction];
        for (let index = 0; index < command.ammount; index += 1) {
            steps += 1;
            const pos = {
                x: loc.x + vector.x,
                y: loc.y + vector.y
            };
            const id = `${pos.x}:${pos.y}`;
            maze.push({ key: id, step: steps });
            loc = pos;
        }
    }
    return maze;
}

const resultOne = (_: any, result: number) => {
    return `Closest intersect is ${result} units distant`;
};

const resultTwo = (_: any, result: number) => {
    return `Fewest number of steps to get to an intersect is ${result}`;
};

const showInput = (input: CommandPair) => {
    console.log(input);
};

const test = () => {
    const lines = ["R8,U5,L5,D3", "U7,R6,D4,L4"];
    const commands = {
        first: lineToCommands(lines[0]),
        second: lineToCommands(lines[1])
    }
    const result = partOne(commands);
    console.log(result);
};

export const solutionThree: Puzzle<CommandPair, number> = {
    day: 3,
    input: processInput,
    partOne,
    partTwo,
    resultOne,
    resultTwo,
    showInput,
    test,
}
