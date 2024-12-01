// Solution for day 17 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";

interface Point {
    x: number;
    y: number;
}

type Direction = 'horizontal' | 'vertical' | 'start';

type TravelingPoint = Point & { price: number, direction: Direction };

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const numbers = lines.map(line => line.split("").map(c => parseInt(c, 10)));
    return numbers;
};

const getNeighbours = (city: number[][], prices: number[][], position: TravelingPoint) => {
    if (position.direction === 'start') {
        return [];
    }
};

const partOne = (input: number[][], debug: boolean) => {
    const startPosition = { x: 0, y: 0, price: 0, direction: 'start' } as const;

    const prices: number[][] = Array(input.length).fill(0).map(_ => Array(input[0].length).fill(0).map(_ => Number.MAX_SAFE_INTEGER));
    prices[0][0] = 0;

    const queue: TravelingPoint[] = [startPosition];

    let callCount = 0;

    while (queue.length > 0) {
        callCount += 1;
        const position = queue.shift()!;

        // is the price current?
        const currentPrice = prices[position.y][position.x][`${position.direction}-${position.distance}`];
        if (currentPrice < position.price) {
            continue;
        }

        const upPosition = getUpPosition(input, prices, position);
        if (upPosition) {
            // if there was a cheaper one, we would not be here
            let existing = queue.findIndex(q => q.x === upPosition.x && q.y === upPosition.y && q.direction === upPosition.direction && q.distance === upPosition.distance);
            while (existing !== -1) {
                queue.splice(existing, 1);
                existing = queue.findIndex(q => q.x === upPosition.x && q.y === upPosition.y && q.direction === upPosition.direction && q.distance === upPosition.distance);
            }
            queue.push(upPosition);
        }

        const downPosition = getDownPosition(input, prices, position);
        if (downPosition) {
            // if there was a cheaper one, we would not be here
            let existing = queue.findIndex(q => q.x === downPosition.x && q.y === downPosition.y && q.direction === downPosition.direction && q.distance === downPosition.distance);
            while (existing !== -1) {
                queue.splice(existing, 1);
                existing = queue.findIndex(q => q.x === downPosition.x && q.y === downPosition.y && q.direction === downPosition.direction && q.distance === downPosition.distance);
            }
            queue.push(downPosition);
        }

        const leftPosition = getLeftPosition(input, prices, position);
        if (leftPosition) {
            // if there was a cheaper one, we would not be here
            let existing = queue.findIndex(q => q.x === leftPosition.x && q.y === leftPosition.y && q.direction === leftPosition.direction && q.distance === leftPosition.distance);
            while (existing !== -1) {
                queue.splice(existing, 1);
                existing = queue.findIndex(q => q.x === leftPosition.x && q.y === leftPosition.y && q.direction === leftPosition.direction && q.distance === leftPosition.distance);
            }
            queue.push(leftPosition);
        }

        const rightPosition = getRightPosition(input, prices, position);
        if (rightPosition) {
            // if there was a cheaper one, we would not be here
            let existing = queue.findIndex(q => q.x === rightPosition.x && q.y === rightPosition.y && q.direction === rightPosition.direction && q.distance === rightPosition.distance);
            while (existing !== -1) {
                queue.splice(existing, 1);
                existing = queue.findIndex(q => q.x === rightPosition.x && q.y === rightPosition.y && q.direction === rightPosition.direction && q.distance === rightPosition.distance);
            }
            queue.push(rightPosition);
        }
    }

    console.log(callCount);
    // console.log(prices);
    const finishPrices = prices[prices.length - 1][prices[0].length - 1];
    const minPrice = Math.min(...Object.values(finishPrices));
    return minPrice;
};

const partTwo = (input: number[][], debug: boolean) => {
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

const showInput = (input: number[][]) => {
    console.log(input);
};

const test = (_: number[][]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<number[][], number> = {
    day: 17,
    input: () => processInput(17),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}