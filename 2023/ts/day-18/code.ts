// Solution for day 18 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

interface PlanStep {
    direction: string,
    amount: number,
    color: string
}

interface Point {
    x: number,
    y: number
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const regex = /^([A-Z]) (\d+) \(#([a-f0-9]{6})\)$/;
    const planSteps = lines.map(line => {
        const match = line.match(regex);
        if (!match) {
            throw new Error(`Invalid line ${line}`);
        }
        return {
            direction: match[1],
            amount: parseInt(match[2], 10),
            color: match[3]
        }
    });
    return planSteps;
};

const partOne = (input: PlanStep[], debug: boolean) => {
    const trench: Point[] = [{ x: 0, y: 0 }];
    let position = { x: 0, y: 0 };

    for (const step of input) {
        if (step.direction === "R") {
            for (let i = 0; i < step.amount; i++) {
                position = { x: position.x + 1, y: position.y };
                trench.push(position);
            }
            continue;
        }
        if (step.direction === "L") {
            for (let i = 0; i < step.amount; i++) {
                position = { x: position.x - 1, y: position.y };
                trench.push(position);
            }
            continue;
        }
        if (step.direction === "D") {
            for (let i = 0; i < step.amount; i++) {
                position = { x: position.x, y: position.y - 1 };
                trench.push(position);
            }
            continue;
        }
        if (step.direction === "U") {
            for (let i = 0; i < step.amount; i++) {
                position = { x: position.x, y: position.y + 1 };
                trench.push(position);
            }
            continue;
        }
    }

    // remove the last element, as it is the starting point
    trench.pop();

    const trenchSet = new Set<string>();

    for (const point of trench) {
        trenchSet.add(`${point.x},${point.y}`);
    }

    const maxy = trench.max(p => p.y);
    const minx = trench.min(p => p.x);

    const digStart = { x: minx, y: maxy };
    while (!trenchSet.has(`${digStart.x},${digStart.y}`)) {
        digStart.x += 1;
    }

    digStart.x += 1;
    digStart.y -= 1;

    const queue: Point[] = [digStart];

    while (queue.length > 0) {
        const {x, y} = queue.shift()!;
        const key = `${x},${y}`;
        if (trenchSet.has(key)) {
            continue;
        }

        trenchSet.add(key);

        const left = { x: x - 1, y: y };
        const right = { x: x + 1, y: y };
        const up = { x: x, y: y + 1 };
        const down = { x: x, y: y - 1 };

        const leftDig = trenchSet.has(`${left.x},${left.y}`);
        if (!leftDig) {
            queue.push(left);
        }

        const rightDig = trenchSet.has(`${right.x},${right.y}`)
        if (!rightDig) {
            queue.push(right);
        }

        const upDig = trenchSet.has(`${up.x},${up.y}`);
        if (!upDig) {
            queue.push(up);
        }

        const downDig = trenchSet.has(`${down.x},${down.y}`);
        if (!downDig) {
            queue.push(down);
        }
    }

    return trenchSet.size;
};

const partTwo = (input: PlanStep[], debug: boolean) => {
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

const showInput = (input: PlanStep[]) => {
    console.log(input);
};

const test = (_: PlanStep[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<PlanStep[], number> = {
    day: 18,
    input: () => processInput(18),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}