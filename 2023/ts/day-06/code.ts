// Solution for day 6 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

interface Race {
    time: number;
    record: number
}


const processInput = (day: number) => {
    const [times, records] = readInputLines(day);
    const tmatch = times.match(/^Time:\s+(.*)$/);
    const rmatch = records.match(/^Distance:\s+(.*)$/);

    if (!tmatch || !rmatch) {
        throw Error("Invalid input");
    }
    const tvalues = tmatch[1].split(" ").filter(w => w).map(n => parseInt(n));
    const rvalues = rmatch[1].split(" ").filter(w => w).map(n => parseInt(n));

    const result = [] as Race[];
    for (let index = 0; index < tvalues.length; index++) {
        const time = tvalues[index];
        const record = rvalues[index];
        result.push({ time, record });
    }
    return result;
};

const getDistances = (time:number) => {
    const result = [];
    for (let index = 0; index <= time; index++) {
        const distance = index * (time - index);
        result.push(distance);
    }
    return result;
}

const partOne = (input: Race[], debug: boolean) => {
    let total = 1;
    for (const {time, record} of input) {
        const distances = getDistances(time);
        const bigger = distances.filter(d => d > record);
        total *= bigger.length;
    }
    return total;
};

const getDistance = (totalTime: number, buttonTime: number) => buttonTime * (totalTime - buttonTime);

const partTwo = (input: Race[], debug: boolean) => {
    const actualTime = +input.map(r => r.time).join("");
    const actualRecord = +input.map(r => r.record).join("");

    // const distances = getDistances(actualTime);
    // const bigger = distances.filter(d => d > actualRecord);
    // return bigger.length;

    // binary search
    let top = Math.floor(actualTime / 2);
    let bottom = 0;
    while (top - bottom > 5) {
        const middle = Math.floor((top + bottom) / 2);
        const distance = getDistance(actualTime, middle);
        if (distance > actualRecord) {
            top = middle;
        } else {
            bottom = middle;
        }
    }

    // linear search
    while (getDistance(actualTime, bottom) < actualRecord) {
        bottom += 1;
    }

    const result = actualTime - 2 * (bottom - 1) - 1;
    return result;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Race[]) => {
    console.log(input);
};

const test = (_: Race[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Race[], number> = {
    day: 6,
    input: () => processInput(6),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}