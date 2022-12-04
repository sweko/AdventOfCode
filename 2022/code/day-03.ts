import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Rucksack {
    first: string;
    second: string;
}

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    return input;
};

const getHistogram = (input: string) => {
    const histogram = new Set<string>();
    for (const char of input) {
        histogram.add(char);
    }
    return histogram;
}

const intersection = (first: Set<string>, second: Set<string>) => {
    const result = new Set<string>();
    for (const char of first) {
        if (second.has(char)) {
            result.add(char);
        }
    }
    return result;
}

const getPriority = (char: string) => {
    if (char === char.toLocaleLowerCase()) {
        return  char.charCodeAt(0) - 96;
    } 
    return char.charCodeAt(0) - 38;
}

const partOne = (input: string[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let total = 0;

    const rucksacks = input.map(line => {
        const len = line.length;
        const first = line.substring(0, len/2);
        const second = line.substring(len/2, len);
        return { first, second } as Rucksack;
    });

    for (const {first, second} of rucksacks) {
        const fhist = getHistogram(first);
        const shist = getHistogram(second);
        const common = intersection(fhist, shist);
        const letter = [...common][0];
        total += getPriority(letter);
    }

    return total;
};

const partTwo = (input: string[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    let index = 0;
    let total = 0;
    while (index < input.length) {
        const fhist = getHistogram(input[index]);
        const shist = getHistogram(input[index+1]);
        const thist = getHistogram(input[index+2]);
        const common = intersection(intersection(fhist, shist), thist);
        const letter = [...common][0];
        //console.log(letter);
        total += getPriority(letter);
        index += 3;
    }
    return total;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: string[]) => {
    console.log(input);
};

const test = (_: string[]) => {
    console.log("----Test-----");
};

export const solutionThree: Puzzle<string[], number> = {
    day: 3,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
