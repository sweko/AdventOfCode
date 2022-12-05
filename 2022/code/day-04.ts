import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface ElfPair {
    first: Elf;
    second: Elf;
}

interface Elf {
    start: number;
    end: number;
}

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    return input.map(line => {
        const match = line.match(/^(\d+)-(\d+),(\d+)-(\d+)$/);
        return {
            first: {
                start: parseInt(match[1]),
                end: parseInt(match[2])
            },
            second: {
                start: parseInt(match[3]),
                end: parseInt(match[4])
            }
        }
    });
};

const maxSize = 1000;

const partOne = (input: ElfPair[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let counter = 0;

    for (const { first, second } of input) {
        const map = new Array(maxSize).fill(0);
        for (let i = first.start; i <= first.end; i++) {
            map[i] += 1;
        }
        for (let i = second.start; i <= second.end; i++) {
            map[i] += 2;
        }
        const noOnes = map.every(x => x !== 1);
        if (noOnes) {
            counter += 1;
            continue;
        }
        const noTwo = map.every(x => x !== 2);
        if (noTwo) {
            counter += 1;
        }
    }

    return counter;
};

const partTwo = (input: ElfPair[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    let counter = 0;

    for (const { first, second } of input) {
        const map = new Array(maxSize).fill(0);
        for (let i = first.start; i <= first.end; i++) {
            map[i] += 1;
        }
        for (let i = second.start; i <= second.end; i++) {
            map[i] += 2;
        }
        if (map.some(x => x === 3)) {
            counter += 1;
        }
    }

    return counter;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: ElfPair[]) => {
    console.log(input);
};

const test = (input: ElfPair[]) => {
    console.log("----Test-----");
    console.log(input.map(ep => Math.max(ep.first.end, ep.second.end)).max());
};

export const solutionFour: Puzzle<ElfPair[], number> = {
    day: 4,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
