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

const executeStep = (polymer: string, rules: StringHash) => {
    const insertions = [];
    for (let index = 0; index < polymer.length-1; index++) {
        const key = polymer.substring(index, index+2);
        insertions.push(rules[key] || "");
    }
    const polyChars = polymer.split("");
    const output = [];
    for (let index = 0; index < polymer.length-1; index++) {
        output.push(polyChars[index]);
        output.push(insertions[index]);
    }
    output.push(polyChars[polymer.length-1]);
    return output.join("");
};

const partOne = (input: Input, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let polymer = input.polymer;

    for (let run = 0; run < 10; run++) {
        polymer = executeStep(polymer, input.rules);
    }

    const histogram: Hash<number> = {};

    for (let index = 0; index < polymer.length; index++) {
        const char = polymer[index];
        histogram[char] = (histogram[char] || 0) + 1;
    }

    const frequencies = Object.entries(histogram).sort((a, b) => (b[1]  as number) - (a[1] as number));
    return frequencies[0][1] - frequencies[frequencies.length-1][1];
};

const partTwo = (input: Input, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    return 0;
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
