// Solution for day 11 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

const processInput = (day: number) => {
    const line = readInput(day);
    const stones = line.split(" ").map((item) => parseInt(item, 10));
    return stones;
};

const partOne = (input: number[], debug: boolean) => {
    const stones = input.slice();

    const loopTarget = 25;

    for (let loop = 1; loop <= loopTarget; loop++) {
        let index = 0;
        while (index < stones.length) {
            const stone = stones[index];
            if (stone === 0) {
                stones[index] = 1;
                index += 1;
                continue;
            }
            const stoneStr = stone.toString();
            if (stoneStr.length % 2 === 0) {
                const firstHalf = parseInt(stoneStr.slice(0, stoneStr.length / 2), 10);
                const secondHalf = parseInt(stoneStr.slice(stoneStr.length / 2), 10);
                stones[index] = firstHalf;
                stones.splice(index + 1, 0, secondHalf);
                index += 2;
                continue;
            }

            stones[index] = stones[index] * 2024;
            index += 1;
        }
        //console.log(`Loop ${loop} - ${stones}`);
    }
    return stones.length;
};

const partTwo = (input: number[], debug: boolean) => {
    let stones = input.slice();

    const loopTarget = 75;

    for (let loop = 1; loop <= loopTarget; loop++) {
        const newStones = [];
        let index = 0;

        while (index < stones.length) {
            const stone = stones[index];
            if (stone === 0) {
                newStones.push(1);
                index += 1;
                continue;
            }
            const stoneStr = stone.toString();
            if (stoneStr.length % 2 === 0) {
                const firstHalf = parseInt(stoneStr.slice(0, stoneStr.length / 2), 10);
                const secondHalf = parseInt(stoneStr.slice(stoneStr.length / 2), 10);
                newStones.push(firstHalf);
                newStones.push(secondHalf);
                index += 1;
                continue;
            }

            newStones.push(stones[index] * 2024);
            index += 1;
        }
        stones = newStones;
        console.log(`Loop ${loop} - ${stones.length}`);
    }
    return stones.length;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: number[]) => {
    console.log(input);
};

const test = (_: number[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<number[], number> = {
    day: 11,
    input: () => processInput(11),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}