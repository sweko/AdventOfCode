import { performance } from "perf_hooks";
import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Input {
    start: string;
    end: string;
}

type Caves = {[key: string]: Node};

type NodeType = 'start' | 'end' | 'big' | 'small';

interface Node {
    type: NodeType;
    name: string;
    connections: string[];
}

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    const values = input.map(line => line.split("-")).map(items => ({
        start: items[0],
        end: items[1],
    }));
    return values;
};

//const copyCaves = <T>(input: T):T => JSON.parse(JSON.stringify(input));
const copyCaves = (input: Caves):Caves => {
    const result: Caves = {};
    for (const node in input) {
        result[node] = {
            type: input[node].type,
            name: input[node].name,
            connections: [...input[node].connections],
        }
    }
    return result;
}

function getCaves(input: Input[]) {
    const caves: Caves = {};
    const nodeNames = [...new Set(input.map(item => [item.start, item.end]).flat())];
    for (const nodeName of nodeNames) {
        let type: NodeType = 'small';
        if (nodeName === nodeName.toUpperCase()) {
            type = 'big';
        }
        caves[nodeName] = {
            type,
            name: nodeName,
            connections: [],
        };
    }

    for (const link of input) {
        caves[link.start].connections.push(link.end);
        caves[link.end].connections.push(link.start);
    }
    return caves;
}

let callCount = 0;

const getPathsOne = (caves: Caves, start: string, end: string): string[][] => {
    callCount += 1;
    const startNode = caves[start];
    const nexts = startNode.connections;
    const result = [];
    const nextCaves = copyCaves(caves);
    if (startNode.type === 'small') {
        delete nextCaves[start];
        for (const key in nextCaves) {
            nextCaves[key].connections = nextCaves[key].connections.filter(item => item !== start);
        }
    }
    for (const next of nexts) {
        if (next === end) {
            result.push([start, end]);
            continue;
        };
        const nodePaths = getPathsOne(nextCaves, next, end);
        for (const nodePath of nodePaths) {
            result.push([start, ...nodePath]);
        }
    }
    return result;
};

const partOne = (input: Input[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const caves: Caves = getCaves(input);
    callCount = 0;
    const paths = getPathsOne(caves, "start", "end");
    console.log(callCount);
    
    return paths.length;
};

const processTwo = (caves: Caves, start: Node, end: string, usedBonus = false) => {
    const result: string[][] = [];
    for (const next of start.connections) {
        if (next === end) {
            result.push([start.name, end]);
            continue;
        };
        if (next === "start") {
            continue;
        }
        const nodePaths = getPathsTwo(caves, next, end, usedBonus);
        for (const nodePath of nodePaths) {
            result.push([start.name, ...nodePath]);
        }
    }
    return result;
};

const getPathsTwo = (caves: Caves, start: string, end: string, usedBonus = false): string[][] => {
    callCount += 1;
    const startNode = caves[start];
    const nextCaves = copyCaves(caves);
    if (startNode.type === 'small') {
        if (usedBonus) {
            delete nextCaves[start];
            for (const key in nextCaves) {
                nextCaves[key].connections = nextCaves[key].connections.filter(item => item !== start);
            }
            return processTwo(nextCaves, startNode, end, true);
        } else {
            // bonus now
            const paths = processTwo(nextCaves, startNode, end, true);

            // no bonus for you
            delete nextCaves[start];
            for (const key in nextCaves) {
                nextCaves[key].connections = nextCaves[key].connections.filter(item => item !== start);
            }
            paths.push(...processTwo(nextCaves, startNode, end, false));

            return paths;
        }
    } else {
        return processTwo(nextCaves, startNode, end, usedBonus);
    }
};

const partTwo = (input: Input[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const caves: Caves = getCaves(input);
    callCount = 0;
    const paths = getPathsTwo(caves, "start", "end");
    const start = performance.now();
    const distincts = [...new Set(paths.map(path => path.join(",")))];
    const end = performance.now();
    console.log(`Distincts duration: ${end - start}ms`);
    console.log(`Call count: ${callCount}`);
    return distincts.length;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Input[]) => {
    console.log(input);
};

const test = (_: Input[]) => {
    console.log("----Test-----");
};

export const solutionTwelve: Puzzle<Input[], number> = {
    day: 12,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}

