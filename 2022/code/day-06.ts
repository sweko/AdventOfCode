import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    return readInput(day);
};

const wordDuplicates4 = (word: [string, string, string, string]) => {
    const [a, b, c, d] = word;
    return a === b || a === c || a === d || b === c || b === d || c === d;
};

const wordDuplicates = (word: string[]) => {
    const hist = new Set<string>();
    for (const letter of word) {
        if (hist.has(letter)) {
            return true;
        }
        hist.add(letter);
    }
    return false;
};

const partOne = (input: string, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const word = input.split("").slice(0, 3);
    let index = 3;
    while (index < input.length) {
        word.push(input[index]);
        if (wordDuplicates(word)) {
            word.shift();
            index += 1;
            continue;
        }

        return index+1;
    }

    return 0;
};

const partTwo = (input: string, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const word = input.split("").slice(0, 13);
    let index = 13;
    while (index < input.length) {
        word.push(input[index]);
        if (wordDuplicates(word)) {
            word.shift();
            index += 1;
            continue;
        }

        return index+1;
    }

    return 0;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: string) => {
    console.log(input);
};

const test = (_: string) => {
    console.log("----Test-----");
};

export const solutionSix: Puzzle<string, number> = {
    day: 6,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
