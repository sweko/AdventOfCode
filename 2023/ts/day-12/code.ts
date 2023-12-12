// Solution for day 12 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type Spring = "." | "#" | "?";

type Row = {
    pattern: Spring[];
    groups: number[];
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const result = lines.map(line => {
        const [springs, numbers] = line.split(" ");
        const pattern = springs.split("").map(c => c as Spring);
        const groups = numbers.split(",").map(n => parseInt(n, 10));
        return { pattern, groups };
    });
    return result;
};

const patternMatchesGroupsQmark = (pattern: Spring[], groups: number[]): boolean | null => {
    let pindex = 0;
    let gindex = 0;
    let hashCount = 0;
    let currentGroup = groups[gindex];

    while (pattern[pindex] === ".") {
        pindex++;
    }
    if (pindex === pattern.length) {
        return groups.length === 0;
    }

    while (pindex < pattern.length && gindex < groups.length) {
        if (pattern[pindex] === "#") {
            hashCount++;
            if (hashCount > currentGroup) {
                return false;
            }
            pindex += 1;
            continue;
        }

        if (pattern[pindex] === "?") {
            return null;
        }

        // this is a dot, we should check if we have a group
        if (hashCount === currentGroup) {
            gindex +=1;
            currentGroup = groups[gindex];
            hashCount = 0;
        }

        pindex++;
    }
    return true;
};

const patternMatchesGroupsBrute = (pattern: Spring[], groups: number[]): boolean => {
    const patternGroups = [];

    let hashCount = 0;
    for (let index = 0; index < pattern.length; index++) {
        const char = pattern[index];
        if (char === "#") {
            hashCount++;
            continue;
        }
        if (char === ".") {
            if (hashCount > 0) {
                patternGroups.push(hashCount);
                hashCount = 0;
            }
        }
    }
    if (hashCount > 0) {
        patternGroups.push(hashCount);
    }

    if (patternGroups.length !== groups.length) {
        return false;
    }

    for (let index = 0; index < patternGroups.length; index++) {
        if (patternGroups[index] !== groups[index]) {
            return false;
        }
    }
    return true;
};


const getConfigurationsCountBrute = ({pattern, groups}: Row) => {
    const qmarkIndexes = pattern.map((s, i) => s === "?" ? i : -1).filter(i => i !== -1);
    const qmarkCount = qmarkIndexes.length;
    const optionsCount = 1 << qmarkCount;
    let count = 0;

    for (let index = 0; index < optionsCount; index++) {
        const bindex = index.toString(2).padStart(qmarkCount, "0");
        const newPattern = pattern.slice();
        for (let qindex = 0; qindex < qmarkIndexes.length; qindex++) {
            newPattern[qmarkIndexes[qindex]] = (bindex[qindex] === "0") ? "." : "#";
        }
        if (patternMatchesGroupsBrute(newPattern, groups)) {
            count++;
        }
    }
    return count;
};

const getConfigurationsCount = ({pattern, groups}: Row) => {
    // find the first ? 
    // ...and replace it with a #
    // count configurations now
    // ...and replace it with a .
    // count configurations now
    // return the sum of both
    return -1;
};

const partOne = (input: Row[], debug: boolean) => {
    const result = input.sum(row => getConfigurationsCount(row));
    return result;
};

const partTwo = (input: Row[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    return input.length;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Row[]) => {
    console.log(input);
};

const test = (_: Row[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Row[], number> = {
    day: 12,
    input: () => processInput(12),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}