// Solution for day 11 of advent of code 2025

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import path from "path";

type Node = {
    name: string;
    connections: string[];
};

const processInput = (day: number):Node[] => {
    const lines = readInputLines(day);
    const nodes = lines.map(line => {
        const [name, tail] = line.split(": ");
        const connections = tail.split(" ");
        return { name, connections };
    });
    return nodes;
};

const partOne = (input: Node[], debug: boolean) => {
    const nodes: Record<string, string[]> = {};
    const paths: Record<string, [number, number]> = {};
    for (const node of input) {
        nodes[node.name] = node.connections;
        paths[node.name] = [0, 0];
    }

    paths["you"] = [1, 0];
    paths["out"] = [0, NaN];

    const queue: string[] = ["you"];

    while (queue.length > 0) {
        const current = queue.shift()!;
        if (debug) {
            console.log(`Processing node ${current}`);
        }

        const connections = nodes[current];
        if (!connections) {
            continue;
        }
        const [pathCount, prevCount] = paths[current];

        for (const conn of connections) {
            paths[conn][0] += pathCount - prevCount;
            if (!queue.includes(conn)) {
                queue.push(conn);
            }
        }

        paths[current] = [pathCount, pathCount];

    }

    return paths.out[0];
};

const partTwo = (input: Node[], debug: boolean) => {
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

const showInput = (input: Node[]) => {
    console.log(input);
};

const test = (_: Node[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Node[], number> = {
    day: 11,
    input: () => processInput(11),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}