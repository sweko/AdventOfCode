// Solution for day 15 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

const processInput = (day: number) => {
    const input = readInput(day);
    return input.split(",");
};

const getHash = (instruction: string) => {
    let currentValue = 0;
    for (let index = 0; index < instruction.length; index++) {
        const char = instruction.charCodeAt(index);
        currentValue = ((currentValue + char) * 17) % 256;
    }
    return currentValue;
};

const partOne = (input: string[], debug: boolean) => {
    const result = input.sum(instruction => getHash(instruction));
    return result;
};

interface Lens {
    label: string;
    focus: number;
}

const partTwo = (input: string[], debug: boolean) => {
    const spaceHeater = Array(256).fill(0).map(_ => [] as Lens[]);
    const minusInstRegex = /^(.*)-$/;
    const setInstRegex = /^(.*)=(\d)$/;

    for (const instruction of input) {
        const minusMatch = instruction.match(minusInstRegex);
        if (minusMatch) {
            const label = minusMatch[1];
            const hash = getHash(label);
            const box = spaceHeater[hash];
            const lensIndex = box.findIndex(lens => lens.label === label);
            if (lensIndex >= 0) {
                box.splice(lensIndex, 1);
            }
        } else {
            const setMatch = instruction.match(setInstRegex);
            if (setMatch) {
                const label = setMatch[1];
                const focus = parseInt(setMatch[2], 10);
                const hash = getHash(label);
                const box = spaceHeater[hash];
                const lensIndex = box.findIndex(lens => lens.label === label);
                if (lensIndex >= 0) {
                    box[lensIndex].focus = focus;
                } else {
                    box.push({ label, focus });
                }
            } else {
                throw `Invalid instruction ${instruction}`;
            }
        }
    }

    const lensePowers = spaceHeater.flatMap((box, bindex) => box
        .map((lens, lindex) => ({
            box: bindex + 1, 
            lens: lindex + 1, 
            focus: lens.focus
        }))
    );

    const result = lensePowers.sum(lense => lense.box * lense.lens * lense.focus);
    return result;
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

export const solution: Puzzle<string[], number> = {
    day: 15,
    input: () => processInput(15),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}