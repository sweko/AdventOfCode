// Solution for day 10 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const numbers = lines.map(l => l.split("").map(n => parseInt(n, 10)));
    return numbers;
};

type Point = {
    x: number;
    y: number;
}

const pointInBounds = (point: Point, width: number, height: number) => {
    return point.x >= 0 && point.x < width && point.y >= 0 && point.y < height;
}

const pointToString = (point: Point) => `${point.x},${point.y}`;

const countTrailheadScore = (trailhead: Point, elevations: number[][]) => {
    const queue = [trailhead];
    const width = elevations[0].length;
    const height = elevations.length;

    let destinations = new Set<string>();

    while (queue.length > 0) {
        const current = queue.shift()!;
        const currentElevation = elevations[current.y][current.x];

        if (currentElevation === 9) {
            destinations.add(pointToString(current));
            continue;
        }

        const neighbors = [
            { x: current.x - 1, y: current.y },
            { x: current.x + 1, y: current.y },
            { x: current.x, y: current.y - 1 },
            { x: current.x, y: current.y + 1 },
        ].filter(p => pointInBounds(p, width, height));

        const goodNeighbours = neighbors.filter(n => elevations[n.y][n.x] == currentElevation + 1);

        queue.push(...goodNeighbours);
    }

    return destinations.size;
}

const partOne = (elevations: number[][], debug: boolean) => {
    const trailheads = [];
    for (let y = 0; y < elevations.length; y++) {
        for (let x = 0; x < elevations[y].length; x++) {
            if (elevations[y][x] === 0) {
                trailheads.push({ x, y });
            }
        }
    }

    let totalScore = 0;

    for (const trailhead of trailheads) {
        totalScore += countTrailheadScore(trailhead, elevations);
    }

    return totalScore;
};

const countTrailheadRating = (trailhead: Point, elevations: number[][]) => {
    const queue = [trailhead];
    const width = elevations[0].length;
    const height = elevations.length;

    let counter = 0;

    while (queue.length > 0) {
        const current = queue.shift()!;
        const currentElevation = elevations[current.y][current.x];

        if (currentElevation === 9) {
            counter += 1;
            continue;
        }

        const neighbors = [
            { x: current.x - 1, y: current.y },
            { x: current.x + 1, y: current.y },
            { x: current.x, y: current.y - 1 },
            { x: current.x, y: current.y + 1 },
        ].filter(p => pointInBounds(p, width, height));

        const goodNeighbours = neighbors.filter(n => elevations[n.y][n.x] == currentElevation + 1);

        queue.push(...goodNeighbours);
    }

    return counter;
}

const partTwo = (elevations: number[][], debug: boolean) => {
    const trailheads = [];
    for (let y = 0; y < elevations.length; y++) {
        for (let x = 0; x < elevations[y].length; x++) {
            if (elevations[y][x] === 0) {
                trailheads.push({ x, y });
            }
        }
    }

    let totalScore = 0;

    for (const trailhead of trailheads) {
        totalScore += countTrailheadRating(trailhead, elevations);
    }

    return totalScore;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: number[][]) => {
    console.log(input);
};

const test = (_: number[][]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<number[][], number> = {
    day: 10,
    input: () => processInput(10),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}