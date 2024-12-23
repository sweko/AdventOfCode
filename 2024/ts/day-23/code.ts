// Solution for day 23 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const connections = lines.map(line => line.split("-") as [string, string]);
    return connections;
};

const partOne = (input: [string, string][], debug: boolean) => {
    const connections: Map<string, Set<string>> = new Map();
    for (const connection of input) {
        const [a, b] = connection;
        if (!connections.has(a)) {
            connections.set(a, new Set());
        }
        if (!connections.has(b)) {
            connections.set(b, new Set());
        }
        connections.get(a)!.add(b);
        connections.get(b)!.add(a);
    }

    let counter = 0;
    for (const [first, values] of connections) {
        for (const second of values) {
            if (first > second) {
                continue;
            }
            for (const third of values) {
                if (second >= third) {
                    continue;
                }
                if (connections.get(second)!.has(third)) {
                    if (first.startsWith("t") || second.startsWith("t") || third.startsWith("t")) {
                        // console.log(`Found triangle ${first} - ${second} - ${third}`);
                        counter += 1;
                    }
                }
            }
        }
    }
    return counter;
};

const partTwo = (input: [string, string][], debug: boolean) => {
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

const showInput = (input: [string, string][]) => {
    console.log(input);
};

const test = (_: [string, string][]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<[string, string][], number> = {
    day: 23,
    input: () => processInput(23),
    partOne,
    //partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}