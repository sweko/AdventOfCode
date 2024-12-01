import * as fs from "fs";

const params = process.argv.slice(2);
if (params.length < 1) {
  console.log("Usage: node setup-day.ts <day>");
  process.exit(1);
}

const day = +params[0];
const folder = `./day-${day.toString().padStart(2, "0")}`;

if (fs.existsSync(`./${folder}`)) {
  console.log(`Day ${day} already exists!`);
  process.exit(1);
}

fs.mkdirSync(`./${folder}`);

fs.writeFileSync(`./${folder}/input.txt`, "demo input");

const puzzleTemplate = `// Solution for day ${day} of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

const processInput = (day: number) => {
    const lines = readInputLines(day);
    return lines;
};

const partOne = (input: string[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    return input.length;
};

const partTwo = (input: string[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    return input.length;
};

const resultOne = (_: any, result: number) => {
    return \`Result part one is \${result}\`;
};

const resultTwo = (_: any, result: number) => {
    return \`Result part two is \${result}\`;
};

const showInput = (input: string[]) => {
    console.log(input);
};

const test = (_: string[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<string[], number> = {
    day: ${day},
    input: () => processInput(${day}),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}`

fs.writeFileSync(`./${folder}/code.ts`, puzzleTemplate);

console.log(`Day ${day} created!`);