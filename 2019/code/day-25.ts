import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { IntcodeSimulator } from "../extra/intcode-simulator";

const processInput = async (day: number) => {
    const input = await readInput(day);
    return input.split(",").map(c => Number(c));
};

const fromAscii = (command: string) => (command + "\n").split("").map(c => c.charCodeAt(0));

const partOne = (instructions: number[], debug: boolean) => {

    const input = [];
    const mutex = true;
    const mug = true;
    const polygon = false;
    const hypercube = true;
    const kleinBottle = true;
    input.push(...fromAscii("south"));
    if (mutex) {
        input.push(...fromAscii("take mutex"));
    }

    if (kleinBottle) {
        input.push(...fromAscii("south"));
        input.push(...fromAscii("west"));
        input.push(...fromAscii("west"));
        input.push(...fromAscii("take klein bottle"));
        input.push(...fromAscii("east"));
        input.push(...fromAscii("east"));
        input.push(...fromAscii("north"));
    }
    input.push(...fromAscii("east"));
    if (mug) {
        input.push(...fromAscii("take mug"));
    }
    input.push(...fromAscii("east"));
    if (polygon) {
        input.push(...fromAscii("take polygon"));
    }
    if (hypercube) {
        input.push(...fromAscii("north"));
        input.push(...fromAscii("north"));
        input.push(...fromAscii("take hypercube"));
        input.push(...fromAscii("south"));
        input.push(...fromAscii("south"));
    }
    input.push(...fromAscii("east"));
    input.push(...fromAscii("east"));
    input.push(...fromAscii("east"));
    input.push(...fromAscii("south"));
    input.push(...fromAscii("west"));
    input.push(...fromAscii("west"));
    input.push(...fromAscii("inv"));

    let result = 11534338;

    const simulator = new IntcodeSimulator(instructions.slice(), input);
    simulator.output = value => {
        if (value > 255) {
            result = value;
            return;
        }
        if (debug) {
            const char = String.fromCharCode(value);
            process.stdout.write(char);
        }
        
    };

    simulator.run();
    return result;
};

const resultOne = (_: any, result: number) => {
    return `The password for the main airlock is ${result}`;
};

const showInput = (input: number[]) => {
    console.log(input);
};

const test = (_: number[]) => {
    console.log("----Test-----");
};

export const solution25: Puzzle<number[], number> = {
    day: 25,
    input: processInput,
    partOne,
    resultOne,
    showInput,
    test,
}
