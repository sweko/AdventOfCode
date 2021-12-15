import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Hash, StringHash, toHash } from "../extra/hash-helpers";
import { Puzzle } from "./model";

interface Input {
    polymer: string;
    rules:  StringHash;
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const polymer = lines[0];
    const rules = toHash(
        lines.slice(2).map(line => ({
            source: line.substring(0, 2),
            target: line.substring(6, 7)
        })),
        rule => rule.source,
        rule => rule.target);
    return {polymer, rules};
};

const executeStep = (polymer: Hash<number>, rules: StringHash) => {
    const result: Hash<number> = {};

    for (const basePair in polymer) {
        const value = polymer[basePair];
        const target = rules[basePair];
        const baseOne = basePair[0] + target;
        const baseTwo = target + basePair[1];
        result[baseOne] = (result[baseOne] || 0) + value;
        result[baseTwo] = (result[baseTwo] || 0) + value;
    }

    return result;
};

const calculateFrequencyDiff = (input: Input, limit: number) => {
    let polymer: Hash<number> = {};

    for (let index = 0; index < input.polymer.length - 1; index++) {
        const key = input.polymer.substring(index, index + 2);
        polymer[key] = (polymer[key] || 0) + 1;
    }

    for (let run = 0; run < limit; run++) {
        polymer = executeStep(polymer, input.rules);
    }

    const histogram: Hash<number> = {};

    for (const basePair in polymer) {
        const first = basePair[0];
        const second = basePair[1];
        histogram[first] = (histogram[first] || 0) + polymer[basePair];
        histogram[second] = (histogram[second] || 0) + polymer[basePair];
    }

    for (const key in histogram) {
        histogram[key] = Math.ceil(histogram[key] / 2);
    }

    const frequencies = Object.values(histogram).sort((a, b) => b - a);
    return frequencies[0] - frequencies[frequencies.length - 1];
}

const partOne = (input: Input, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    const limit = 10;
    return calculateFrequencyDiff(input, limit);
};



const partTwo = (input: Input, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const limit = 40;
    return calculateFrequencyDiff(input, limit);
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

export const solutionFourteen: Puzzle<Input, number> = {
    day: 14,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
