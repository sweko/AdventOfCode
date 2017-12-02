import { readInput, readInputLines } from "../extra/aoc-helper";
import { isNumber } from "util";
import * as md5 from "md5";

const salt = "cuanljph";
const iteration = 64;

let hashCache;

async function main() {
    hashCache = {};
    let keyIndex = processPartOne();
    console.log(`Part 1: index of the ${iteration}-th key is ${keyIndex}`);

    hashCache = {};
    keyIndex = processPartTwo();
    console.log(`Part 2: index of the ${iteration}-th stretched key is ${keyIndex}`);
}

function checkKey(index: number) {
    const tripleRegex = /([a-f0-9])\1\1/;
    const match = generateHash(index).match(tripleRegex);
    if (!match) return false;
    const digit = match[1].repeat(5);
    for (let i = 1; i <= 1000; i++) {
        if (generateHash(index + i).indexOf(digit) !== -1)
            return true;
    }

    return false;
}

function generateHash(index: number): string {
    if (hashCache[index]) {
        return hashCache[index];
    }

    const hash = md5(salt + index);
    hashCache[index] = hash;
    return hash;
}

function processPartOne() {
    let index = -1;
    let keys = 0;
    while (keys !== iteration) {
        index++;
        if (checkKey(index)) {
            keys += 1;
            console.log(`${keys}: ${index}`);
        }
    }
    return index;
}

function checkKeyStretch(index: number) {
    const tripleRegex = /([a-f0-9])\1\1/;
    const match = generateHashStretch(index).match(tripleRegex);
    if (!match) return false;
    const digit = match[1].repeat(5);
    for (let i = 1; i <= 1000; i++) {
        if (generateHashStretch(index + i).indexOf(digit) !== -1)
            return true;
    }

    return false;
}

function generateHashStretch(index: number): string {
    if (hashCache[index]) {
        return hashCache[index];
    }

    let hash = md5(salt + index);
    for (let i = 1; i <= 2016; i++) {
        hash = md5(hash);
    }
    hashCache[index] = hash;
    return hash;
}

function processPartTwo() {
    let index = -1;
    let keys = 0;
    while (keys !== iteration) {
        index++;
        if (checkKeyStretch(index)) {
            keys += 1;
            console.log(`${keys}: ${index}`);
        }
    }
    return index;
}

main();