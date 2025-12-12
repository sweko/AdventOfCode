// Solution for day 11 of advent of code 2024

import { readInputLines, readInput, dlog } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

const processInput = (day: number) => {
    const line = readInput(day);
    const stones = line.split(" ").map((item) => parseInt(item, 10));
    return stones;
};

const partOne = (input: number[], debug: boolean) => {
    let stones = input.slice();

    const loopTarget = 25;

    for (let loop = 1; loop <= loopTarget; loop++) {
        let index = 0;
        const nextStones = [];

        while (index < stones.length) {
            const stone = stones[index];
            if (stone === 0) {
                nextStones.push(1);
                index += 1;
                continue;
            }
            const stoneStr = stone.toString();
            if (stoneStr.length % 2 === 0) {
                const firstHalf = parseInt(stoneStr.slice(0, stoneStr.length / 2), 10);
                const secondHalf = parseInt(stoneStr.slice(stoneStr.length / 2), 10);
                nextStones.push(firstHalf);
                nextStones.push(secondHalf);
                index += 1;
                continue;
            }

            nextStones.push(stones[index] * 2024);
            index += 1;
        }
        stones = nextStones;
        dlog(`Loop ${loop} - ${stones.length}`);
        dlog(`  ${stones}`);
    }
    return stones.length;
};

type LinkedList = {
    value: number;
    next: LinkedList | null;
}

const toLinkedList = (input: number[]): LinkedList => {
    let head: LinkedList = { value: input[0], next: null };
    let current = head;
    for (let index = 1; index < input.length; index++) {
        current.next = { value: input[index], next: null };
        current = current.next;
    }
    return head;
}

const partOneLinkedList = (input: number[], debug: boolean) => {
    let stones = input.slice();

    const head = toLinkedList(stones);
    let count = stones.length;

    const loopTarget = 25;

    for (let loop = 1; loop <= loopTarget; loop++) {
        let current: LinkedList | null = head;

        while (current !== null) {
            if (current.value === 0) {
                current.value = 1;
                current = current.next;
                continue;
            }
            const stoneStr = current.value.toString();
            if (stoneStr.length % 2 === 0) {
                const firstHalf = parseInt(stoneStr.slice(0, stoneStr.length / 2), 10);
                const secondHalf = parseInt(stoneStr.slice(stoneStr.length / 2), 10);
                current.value = firstHalf;
                const newStone = { value: secondHalf, next: current.next };
                current.next = newStone;
                current = newStone.next;
                count += 1;
                continue;
            }

            current.value = current.value * 2024;
            current = current.next;
        }

        dlog(`Loop ${loop} - ${count}`);
    }
    return count;
};

const partTwo = (input: number[], debug: boolean) => {
    const cache: Record<number, Record<number, number>> = {};

    const setCache = (value: number, blinks: number, count: number) => {
        if (!cache[value]) {
            cache[value] = {};
        }
        cache[value][blinks] = count;
    }
    
    const getStoneCount = (value: number, blinks: number): number => {
        if (cache[value] && cache[value][blinks]) {
            return cache[value][blinks];
        }
        if (blinks === 0) {
            setCache(value, blinks, 1);
            return 1;
        }
        if (value === 0) {
            const result = getStoneCount(1, blinks - 1);
            setCache(value, blinks, result);
            return result;
        }
        const valueStr = value.toString();
        if (valueStr.length % 2 === 0) {
            const firstHalf = parseInt(valueStr.slice(0, valueStr.length / 2), 10);
            const secondHalf = parseInt(valueStr.slice(valueStr.length / 2), 10);
            const firstCount = getStoneCount(firstHalf, blinks - 1);
            const secondCount = getStoneCount(secondHalf, blinks - 1);
            const result = firstCount + secondCount;
            setCache(value, blinks, result);
            return result;
        }
        const result = getStoneCount(value * 2024, blinks - 1);
        setCache(value, blinks, result);
        return result;
    }

    const result = input.map((item) => getStoneCount(item, 75)).sum();
    return result;

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