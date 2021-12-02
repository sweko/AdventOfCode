import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

type Direction = "up" | "down" | "forward";
type Instruction = [Direction, number];

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    const regex = /^(forward|down|up) (\d)$/;
    const result = input.map(line => {
        const match = regex.exec(line);
        if (match) {
            return [match[1], parseInt(match[2])] as Instruction;
        }
    })
    return result;
};

const partOne = (input: Instruction[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let position = 0;
    let depth = 0;

    for (const [direction, value] of input) {
        if (direction === "down") {
            depth += value;
        } else if (direction === "up") {
            depth -= value;
            if (depth < 0) {
                throw Error("The submarine is flying");
            }
        } else if (direction === "forward") {
            position += value;
        }
    }

    return position * depth;
};

const partTwo = (input: Instruction[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let position = 0;
    let depth = 0;
    let aim = 0;

    for (const [direction, value] of input) {
        if (direction === "down") {
            aim += value;
        } else if (direction === "up") {
            aim -= value;
        } else if (direction === "forward") {
            position += value;
            depth += aim * value;
            if (depth < 0) {
                throw Error("The submarine is flying");
            }
        }
    }

    return position * depth;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Instruction[]) => {
    console.log(input);
};

const test = (_: Instruction[]) => {
    console.log("----Test-----");
};

export const solutionTwo: Puzzle<Instruction[], number> = {
    day: 2,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
