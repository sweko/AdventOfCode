// Solution for day 14 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

interface Point {
    x: number;
    y: number;
}

interface Robot {
    position: Point;
    velocity: Point;
}

const processInput = (day: number) => {
    const inputRegex = /^p=(\d+),(\d+) v=(-?\d+),(-?\d+)$/;
    const lines = readInputLines(day);
    const robots = lines.map((line) => {
        const match = line.match(inputRegex);
        if (!match) {
            throw new Error(`Invalid input, no match found for line ${line}`);
        }
        const position = {
            x: parseInt(match[1], 10),
            y: parseInt(match[2], 10),
        };
        const velocity = {
            x: parseInt(match[3], 10),
            y: parseInt(match[4], 10),
        };
        return { position, velocity };
    });
    return robots;
};

const global = {
    width : 101,
    height : 103,
}

const partOne = (input: Robot[], debug: boolean) => {
    const robots = input.map(({position, velocity}) => ({
        position: {x: position.x, y: position.y},
        velocity: {x: velocity.x, y: velocity.y}
    }));
    let first = 0;
    let second = 0;
    let third = 0;
    let fourth = 0;

    for (const {position, velocity} of robots) {
        for (let index = 1; index <= 100; index++) {
            position.x += velocity.x;
            if (position.x < 0) {
                position.x = position.x + global.width;
            }
            if (position.x >= global.width) {
                position.x = position.x - global.width;
            }
            position.y += velocity.y;
            if (position.y < 0) {
                position.y = position.y + global.height;
            }
            if (position.y >= global.height) {
                position.y = position.y - global.height;
            }
        }

        const halfWidth = (global.width-1) / 2;
        const halfHeight = (global.height-1) / 2;

        if (position.x < halfWidth) {
            if (position.y < halfHeight) {
                first++;
            } else if (position.y > halfHeight) {
                third++;
            }
        } else if (position.x > halfWidth) {
            if (position.y < halfHeight) {
                second++;
            } else if (position.y > halfHeight) {
                fourth++;
            }
        }
    }
    console.log(first, second, third, fourth);
    return first * second * third * fourth;
};

const partTwo = (input: Robot[], debug: boolean) => {
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

const showInput = (input: Robot[]) => {
    console.log(input);
};

const test = (_: Robot[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Robot[], number> = {
    day: 14,
    input: () => processInput(14),
    partOne,
    //partTwo,
    resultOne: resultOne,
    //resultTwo: resultTwo,
    showInput,
    test,
}