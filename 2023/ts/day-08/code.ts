// Solution for day 8 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

interface Desert {
    directions: string;
    nodes: Record<string, Node>;
}

interface Node {
    left: string;
    right: string;
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const directions = lines[0];
    const nodes = lines.slice(2).map(line => {
        const match = line.match(/^([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)$/);
        if (!match) {
            throw Error(`Invalid input line ${line}`);
        }
        const [, source, left, right] = match;
        return {
            source,
            left,
            right
        }
    });
    const nodeMap = nodes.reduce((acc, node) => {
        acc[node.source] = {
            left: node.left,
            right: node.right
        };
        return acc;
    }, {} as Record<string, { left: string, right: string }>);

    return {
        directions,
        nodes: nodeMap
    } as Desert;
};

const partOne = ({directions, nodes}: Desert, debug: boolean) => {
    let dirIndex = 0;
    let stepCount = 0;

    let currentNode = "AAA";
    const targetNode = "ZZZ";

    while (currentNode !== targetNode) {
        const currentDir = directions[dirIndex];
        const currentNodeData = nodes[currentNode];
        if (currentDir === "L") {
            currentNode = currentNodeData.left;
        } else {
            currentNode = currentNodeData.right;
        }
        stepCount += 1;
        dirIndex += 1;
        if (dirIndex === directions.length) {
            dirIndex = 0;
        }
    }

    return stepCount;
};

const isTargetReached = (currentNodes: string[]) => {
    return currentNodes.every(node => node.endsWith("Z"));
}

const partTwo = ({directions, nodes}: Desert, debug: boolean) => {
    let dirIndex = 0;
    let stepCount = 0;

    let currentNodes = Object.keys(nodes).filter(key => key.endsWith("A"));
    console.log(currentNodes);

    while (!isTargetReached(currentNodes)) {
        const nextNodes = [] as string[];
        for (const node of currentNodes) {
            const currentDir = directions[dirIndex];
            const currentNodeData = nodes[node];
            if (currentDir === "L") {
                nextNodes.push(currentNodeData.left);
            } else {
                nextNodes.push(currentNodeData.right);
            }
        }
        currentNodes = nextNodes;

        stepCount += 1;
        dirIndex += 1;
        if (dirIndex === directions.length) {
            dirIndex = 0;
        }

        if (stepCount % 2_000_000 === 0) {
            console.log(stepCount);
            console.log(currentNodes);
        }
    }

    return stepCount;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Desert) => {
    console.log(input);
};

const test = (_: Desert) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Desert, number> = {
    day: 8,
    input: () => processInput(8),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}