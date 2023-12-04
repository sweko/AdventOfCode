// Solution for day 4 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

interface Scratchcard {
    id: number;
    cardinality: number;
    winning: number[];
    ticket: number[];
}

const processInput = (day: number) => {
    const input = readInputLines(day);
    const scards = input.map(line => {
        const match = line.match(/^Card\s+(\d+):\s+([^|]+)\s+\|\s+([^|]+)$/);
        if (!match) {
            throw "Invalid input";
        };
        const id = parseInt(match[1]);
        const winning = match[2].split(" ").filter(value => value).map(n => parseInt(n, 10));
        const ticket = match[3].split(" ").filter(value => value).map(n => parseInt(n, 10));
        return {
            id,
            winning,
            ticket,
            cardinality: 1
        };
    });
    return scards;
};

const partOne = (input: Scratchcard[], debug: boolean) => {
    let total = 0;
    for (const {winning, ticket} of input) {
        const winners = ticket.filter(value => winning.includes(value)).length;
        const value = !!winners ? (1 << (winners - 1)) : 0;
        total += value;
    }
    return total;
};

const partTwo = (input: Scratchcard[], debug: boolean) => {
    let total = 0;
    for (let index = 0; index < input.length; index++) {
        const {id, cardinality, winning, ticket} = input[index];
        const winners = ticket.filter(value => winning.includes(value)).length;
        for (let next = 1; next <= winners; next++) {
            input[index + next].cardinality += cardinality;
        }
        // console.log(`Card ${id} has ${cardinality} cardinality`);
        total += cardinality;
    }
    return total;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Scratchcard[]) => {
    console.log(input);
};

const test = (_: Scratchcard[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Scratchcard[], number> = {
    day: 4,
    input: () => processInput(4),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}