import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const input = await readInput(day);
    const result = input.split(",").map(n => parseInt(n, 10));
    return result;
};

function calculateFishes(fishes: number[], days: number) {
    const fishCycle = 6;
    const newFishCycle = 8;
    let dayIndex = 0;

    let state = new Array(newFishCycle).fill(0);
    for (const fish of fishes) {
        state[fish] += 1;
    }

    while (dayIndex < days) {
        const newState = new Array(newFishCycle + 1).fill(0);
        for (let i = 1; i < state.length; i++) {
            newState[i - 1] = state[i];
        }
        newState[newFishCycle] = state[0];
        newState[fishCycle] += state[0];

        state = newState;
        dayIndex += 1;
    }
    return state.reduce((a, b) => a + b, 0);
}

const partOne = (input: number[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    const days = 80;
    return calculateFishes(input, days);
};

const partTwo = (input: number[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const days = 256;
    return calculateFishes(input, days);
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: number[]) => {
    console.log(input);
};

const test = (_: number[]) => {
    console.log("----Test-----");
};

export const solutionSix: Puzzle<number[], number> = {
    day: 6,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}



