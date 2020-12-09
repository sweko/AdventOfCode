import { access } from "fs";
import { readInputLines, readInput, debugLog } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Hash } from "../extra/hash-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    return input.map(line => Number(line));
};

const size = 25;

const getValidSums = (preamble: number[]) => {
    const set = new Set();
    for (let i = 0; i<preamble.length; i+=1) {
        const first = preamble[i];
        for (let j = i+1; j<preamble.length; j+=1) {
            const second = preamble[j];
            if (first !== second) {
                set.add(first+second);
            }
        }
    };
    return Array.from(set);
}

const partOne = (input: number[], debug: boolean) => {
    let preamble = input.slice(0, size);
    let rest = input.slice(size);

    while (rest.length !== 0) {
        const sums = getValidSums(preamble);
        const next = rest[0];
        if (sums.includes(next)) {
            preamble = [...preamble.slice(1), next];
            rest = rest.slice(1);
        } else {
            return rest[0];
        }
    }
    return -1;
};


const partTwo = (input: number[], debug: boolean) => {
    const target = partOne(input, debug);
    for (let i = 0; i<input.length; i+=1) {
        let sum = 0;
        let j = i;
        while (sum < target) {
            sum += input[j];
            j += 1;
        };
        if (sum === target) {
            // we have the solution
            const numbers = input.slice(i, j);
            return numbers.min() + numbers.max();
        }
    };
    return -1;
};

const resultOne = (_: any, result: number) => {
    return `The first number that is not a sum is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The encryption weakness of XMAS is ${result}`;
};

const showInput = (input: number[]) => {
    console.log(input);
};

const test = (_: number[]) => {
    console.log("----Test-----");
};

export const solutionNine: Puzzle<number[], number> = {
    day: 9,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}


