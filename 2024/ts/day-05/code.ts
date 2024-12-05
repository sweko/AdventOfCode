// Solution for day 5 of advent of code 2024

import { readInputLines, readInput, dlog } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type Input = {
    ruleset: [number, number][],
    updates: number[][];
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const result: Input = {
        ruleset: [],
        updates: [],
    }

    let currentLine = lines.shift();
    while (!!currentLine) {
        // get the rulesets
        const ruleset = currentLine.split("|").map(value => parseInt(value, 10)) as [number, number];
        result.ruleset.push(ruleset);
        currentLine = lines.shift();
    }

    //get the updates
    currentLine = lines.shift();
    while (!!currentLine) {
        const update = currentLine.split(",").map(value => parseInt(value, 10));
        result.updates.push(update);
        currentLine = lines.shift();
    }

    return result;
};

// this can be optimized
const checkUpdate = (update: number[], ruleset: [number, number][]) => {
    for (let findex = 0; findex < update.length; findex++) {
        const first = update[findex];
        for (let sindex = findex + 1; sindex < update.length; sindex++) {
            const second = update[sindex];
            if (ruleset.some(([frule, srule]) => (frule === second && srule === first))) {
                dlog(`Failed update ${update} for ${first} and ${second}`);
                return false;
            }
        }
    }
    dlog(`Passed update ${update}`);
    return true;
};

const partOne = (input: Input, debug: boolean) => {
    let result = 0;
    for (const update of input.updates) {
        if (checkUpdate(update, input.ruleset)) {
            // assumes that the update has an odd number of elements
            result += update[(update.length - 1) / 2];
        }
    }
    return result;
};

const findProblemIndices = (update: number[], ruleset: [number, number][]) => {
    for (let findex = 0; findex < update.length; findex++) {
        const first = update[findex];
        for (let sindex = findex + 1; sindex < update.length; sindex++) {
            const second = update[sindex];
            if (ruleset.some(([frule, srule]) => (frule === second && srule === first))) {
                return [findex, sindex];
            }
        }
    }
    return null;
}

const fixUpdate = (update: number[], ruleset: [number, number][]) => {
    const result = [...update];
    let problemIndices = findProblemIndices(result, ruleset);
    while (problemIndices) {
        const [findex, sindex] = problemIndices;

        const first = result[findex];
        const second = result[sindex];

        result[findex] = second;
        result[sindex] = first;

        problemIndices = findProblemIndices(result, ruleset);
    }

    return result;
}

const partTwo = (input: Input, debug: boolean) => {
    let result = 0;
    const invalidUpdates = input.updates.filter(update => !checkUpdate(update, input.ruleset));
    dlog("-----");
    for (const update of invalidUpdates) {
        const fixed = fixUpdate(update, input.ruleset);
        // assumes that the update has an odd number of elements
        dlog(`Fixed update [${update}] to [${fixed}]`);
        result += fixed[(fixed.length - 1) / 2];
    }
    return result;
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
    day: 5,
    input: () => processInput(5),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}