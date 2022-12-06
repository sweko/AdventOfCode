import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Input {
    commands: Command[];
    stacks: string[][];
}

interface Command {
    quantity: number;
    from: number;
    to: number;
}

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    const situation = input.takeWhile(x => x !== "");
    const indices = situation[situation.length-1].split(" ").filter(x => x !== "").map(x => parseInt(x));
    const stacks = Array(indices.length).fill(0).map(_ => []);

    for (let index = situation.length-2; index >= 0; index -= 1) {
        let line = situation[index];
        let stackIndex = 0;
        while (line !== "") {
            const value = line.substring(0, 2);
            if (value.trim() !== "") {
                stacks[stackIndex].push(value[1]);
            }
            line = line.substring(4);
            stackIndex += 1;
        }
    }

    const commands = input.skipWhile(x => x !== "").slice(1).map(line => {
        const match = line.match(/^move (\d+) from (\d+) to (\d+)$/);
        return {
            quantity: parseInt(match[1]),
            from: parseInt(match[2])-1,
            to: parseInt(match[3])-1
        }
    });
    return { commands, stacks };
};


const partOne = (input: Input, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const stacks = input.stacks.map(x => x.slice());

    for (const {quantity, from, to} of input.commands) {
        for (let index = 0; index < quantity; index++) {
            const crate = stacks[from].pop();
            stacks[to].push(crate);
        }
    }

    return stacks.map(stack => stack[stack.length-1]).join("");
};

const partTwo = (input: Input, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const stacks = input.stacks.map(x => x.slice());

    for (const {quantity, from, to} of input.commands) {
        const helperStack = [];
        for (let index = 0; index < quantity; index++) {
            const crate = stacks[from].pop();
            helperStack.push(crate);
        }
        for (let index = 0; index < quantity; index++) {
            const crate = helperStack.pop();
            stacks[to].push(crate);
        }
    }

    return stacks.map(stack => stack[stack.length-1]).join("");
};

const resultOne = (_: any, result: string) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: string) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Input) => {
    console.log(input);
};

const test = (input: Input) => {
    console.log("----Test-----");
};

export const solutionFive: Puzzle<Input, string> = {
    day: 5,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
