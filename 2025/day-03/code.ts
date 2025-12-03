// Solution for day 3 of advent of code 2025

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type Bank = number[];

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const banks = lines.map(line => {
        const bank = line.split("").map(num => parseInt(num, 10));
        return bank;
    });
    return banks;
};

const getBankValueOne = (bank: Bank) => {
    let first = 0;
    let findex = -1;
    // find the biggest digit that's not in the last place
    for (let index = 0; index < bank.length-1; index++) {
        if (bank[index] > first) {
            first = bank[index];
            findex = index;
        }
    }
    let second = 0;
    // find the biggest digit after the first
    for (let index = findex + 1; index < bank.length; index++) {
        if (bank[index] > second) {
            second = bank[index];
        }
    }
    //console.log(`Bank: ${bank.join("")}, first: ${first}, second: ${second}, value: ${10* first + second}`);
    return 10* first + second;
};

const partOne = (input: Bank[], debug: boolean) => {
    let result = 0;
    for (const bank of input) {
        const bankValue = getBankValueOne(bank);
        result += bankValue;
    }
    return result;
};


const getNextBiggest = (bank: Bank, startIndex: number, endOffset:number) => {
    let biggest = 0;
    let bindex = -1;
    const endIndex = bank.length - endOffset;
    for (let index = startIndex; index < endIndex; index++) {
        if (bank[index] > biggest) {
            biggest = bank[index];
            bindex = index;
        }
    }
    return [biggest, bindex];
};

const getBankValueTwo = (bank: Bank) => {
    let result = 0;
    let startIndex = 0;
    for (let index = 11; index >= 0; index--) {
        const [biggest, bindex] = getNextBiggest(bank, startIndex, index);
        startIndex = bindex + 1;
        result = result * 10 + biggest;
    }
    //console.log(`Bank: ${bank.join("")}, value: ${result}`);
    return result;
};

const partTwo = (input: Bank[], debug: boolean) => {
    let result = 0;
    for (const bank of input) {
        const bankValue = getBankValueTwo(bank);
        result += bankValue;
    }
    return result;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Bank[]) => {
    console.log(input);
};

const test = (_: Bank[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Bank[], number> = {
    day: 3,
    input: () => processInput(3),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}