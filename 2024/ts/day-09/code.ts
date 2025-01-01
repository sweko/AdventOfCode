// Solution for day 9 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

const processInput = (day: number) => {
    const line = readInput(day);
    return line.split("").map(c => parseInt(c, 10));
};

type DiskBlock = '.' | number;

const explode = (diskMap: number[]) => {
    const length = diskMap.sum();
    const result: DiskBlock[] = Array(length).fill('.');
    let fileIndex = 0;
    let diskIndex = 0;
    let fileIndicator = true;
    for (const size of diskMap) {
        if (fileIndicator) {
            result.fill(fileIndex, diskIndex, diskIndex + size);
            fileIndex += 1;
            fileIndicator = false;
        } else {
            result.fill('.', diskIndex, diskIndex + size);
            fileIndicator = true;
        }
        diskIndex += size;
    }
    return result;
};

const partOne = (input: number[], debug: boolean) => {
    const disk = explode(input);
    let lastBlockIndex = disk.length - 1;
    while (disk[lastBlockIndex] === '.') {
        lastBlockIndex -= 1;
    }
    let firstEmptyIndex = 0;
    while (disk[firstEmptyIndex] !== '.') {
        firstEmptyIndex += 1;
    }
    while (firstEmptyIndex < lastBlockIndex) {
        disk[firstEmptyIndex] = disk[lastBlockIndex];
        disk[lastBlockIndex] = '.';
        while (disk[lastBlockIndex] === '.') {
            lastBlockIndex -= 1;
        }
        while (disk[firstEmptyIndex] !== '.') {
            firstEmptyIndex += 1;
        }
    }

    const checksum = disk.sum((item, index) => (item === '.') ? 0 : item * index);
    return checksum;
};

const partTwo = (input: number[], debug: boolean) => {
    const disk = explode(input);
    console.log(disk.join(""));
    const files = input.filter((_, index) => index % 2 === 0);
    const blocks = files.slice();
    const empties = input.filter((_, index) => index % 2 === 1);
    for (let findex = files.length-1; findex > 0; findex -= 1) {
        const fileSize = files[findex];
        const eindex = empties.findIndex(empty => empty >= fileSize);
        if (eindex === -1) {
            continue;
        }
        if (eindex >= findex) {
            continue;
        }
        console.log(`Moving file ${findex} of size ${fileSize} to empty ${eindex} of size ${empties[eindex]}`);
        const emptySize = empties[eindex];
        const emptyStart = blocks.slice(0, eindex+1).sum() + empties.slice(0, eindex).sum();
        const fileStart = blocks.slice(0, findex).sum() + empties.slice(0, findex).sum();
        for (let i = 0; i < fileSize; i++) {
            disk[emptyStart + i] = disk[fileStart + i];
            disk[fileStart + i] = '.';
        }
        empties[eindex] = emptySize - fileSize;
        blocks[eindex] += fileSize;
        // console.log(disk.join(""));
        // console.log(files);
        // console.log(blocks);
        // console.log(empties);
    }
    console.log(disk.join(""));
    const checksum = disk.sum((item, index) => (item === '.') ? 0 : item * index);
    return checksum;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: number[]) => {
    console.log(input);
};

const test = (_: number[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<number[], number> = {
    day: 9,
    input: () => processInput(9),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}