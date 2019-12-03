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
    const result: { [key: string]: number } = {};
    runMazeOne(commands.first, result, 1);
    runMazeOne(commands.second, result, 2);
    const closest = Object.entries(result)
        .filter(entry => entry[1] === 3)
        .map(entry => entry[0].split(":").map(c => parseInt(c)).sum(x => Math.abs(x)))
        .min();
    return closest;
};

const runMazeOne = (commands: Command[], maze: { [key: string]: number }, factor: number) => {
    let loc = { x: 0, y: 0 };
    for (const command of commands) {
        const vector = vectors[command.direction];
        for (let index = 0; index < command.ammount; index += 1) {
            const pos = {
                x: loc.x + vector.x,
                y: loc.y + vector.y
            };
            const id = `${pos.x}:${pos.y}`;
            maze[id] = maze[id] | factor;
            loc = pos;
        }
    }
    return maze;
}

const partTwo = (commands: CommandPair) => {
    const result: { [key: string]: { [key: number]: number } } = {};
    runMazeTwo(commands.first, result, 1);
    runMazeTwo(commands.second, result, 2);
    const closest = Object.entries(result)
        .filter(entry => Object.keys(entry[1]).length === 2)
        .map(entry => ({
            key: entry[0],
            value: Object.values(entry[1]).sum()
        }))
        .min(kvp => kvp.value);
    return closest;
};

const runMazeTwo = (commands: Command[], maze:  { [key: string]: { [key: number]: number } }, cid: number) => {
    let loc = { x: 0, y: 0 };
    let factor = 0;
    for (const command of commands) {
        const vector = vectors[command.direction];
        for (let index = 0; index < command.ammount; index += 1) {
            factor += 1;
            const pos = {
                x: loc.x + vector.x,
                y: loc.y + vector.y
            };
            const id = `${pos.x}:${pos.y}`;
            if (maze[id]) {
                if (!maze[id][cid]) {
                    maze[id][cid] = factor ;    
                }
            } else {
                maze[id] = { [cid]: factor }
            }
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
    const result = partTwo(commands);
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
