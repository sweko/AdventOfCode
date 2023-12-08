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

const partOne = ({ directions, nodes }: Desert, debug: boolean) => {
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

interface Cycle {
    offset: number;
    length: number;
}

const joinTwoCycles = (first: Cycle, second: Cycle) => {
    let fcounter = 0;
    let scounter = 0;

    let matchCounter = 0;

    while (true) {
        let fnext = first.offset + first.length * fcounter;
        let snext = second.offset + second.length * scounter;
        if (fnext === snext) {
            // console.log("Found common node");
            // console.log(fnext, fcounter, scounter);
            // matchCounter += 1;
            // if (matchCounter === 5) {
            //     return fnext;
            // }
            // fcounter += 1;
            // scounter += 1;

            return {
                offset: fnext % (first.length * second.length),
                length: first.length * second.length
            }
        }

        if (fnext < snext) {
            fcounter += 1;
        }

        if (fnext > snext) {
            scounter += 1;
        }
    }

}

const partTwo = ({ directions, nodes }: Desert, debug: boolean) => {
    let currentNodes = Object.keys(nodes).filter(key => key.endsWith("A"));
    const numNodes = Object.keys(nodes).length;
    const dirLength = directions.length;

    const longestPossible = numNodes * dirLength;

    const cycles = [] as Cycle[];
    for (const startNode of currentNodes) {
        let currentNode = startNode;
        let dirIndex = 0;
        let stepCount = 0;
        let lastCycle = 0;
        let ccount = 0;
        for (let index = 0; index < longestPossible; index++) {
            const currentDir = directions[dirIndex];
            const currentNodeData = nodes[currentNode];
            if (currentDir === "L") {
                currentNode = currentNodeData.left;
            } else if (currentDir === "R") {
                currentNode = currentNodeData.right;
            } else {
                throw Error(`Invalid direction ${currentDir}`);
            }

            stepCount += 1;
            dirIndex += 1;
            if (dirIndex === directions.length) {
                dirIndex = 0;
            }
            if (currentNode.endsWith("Z")) {
                ccount += 1;
                if (ccount === 2) {
                    const cycleLength = stepCount - lastCycle;
                    cycles.push({
                        offset: lastCycle % cycleLength,
                        length: cycleLength
                    })
                    break;
                }
                lastCycle = stepCount;
            }
        }
    }

    // We abuse the facts that
    // 1. All cycles have a common factor which is the length of the cycle (which is a prime number)
    // 2. All cycles have a common offset which is 0
    // 3. Each cycle length divided by the number of directions is a prime number
    const total = cycles.reduce((acc, cycle) => {
        acc *= (cycle.length / directions.length);
        return acc;
    }, 1);

    return total * directions.length;
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