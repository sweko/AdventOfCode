// Solution for day 19 of advent of code 2024

import { readInputLines, readInput, dlog } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { count } from "console";

type Input = {
    patterns: string[];
    designs: string[];
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const patterns = lines[0].split(", ")
    const designs = lines.slice(2)
    return { patterns, designs };
};

const isPossible = (() => {
    const cache = new Map<string, boolean>();
    cache.set("", true);

    const isPossibleInner = (design: string, patterns: string[]) => {
        // console.log(`Checking design ${design}`);
        if (cache.has(design)) {
            return cache.get(design)!;
        }

        const applicable = patterns.filter(pattern => design.startsWith(pattern));
        for (const pattern of applicable) {
            if (isPossibleInner(design.slice(pattern.length), patterns)) {
                cache.set(design, true);
                return true;
            }
        }
        cache.set(design, false);
        return false;
    }
    return isPossibleInner;
})();

const partOne = ({patterns, designs}: Input, debug: boolean) => {
    dlog("input", patterns, designs);

    let possible = 0;
    for (const design of designs) {
        if (isPossible(design, patterns)) {
            dlog(`Design ${design} is possible`);
            possible += 1;
        } else {
            dlog(`Design ${design} is not possible`);
        }
    }
    return possible;
};

const countCombinations = (() => {
    const cache = new Map<string, number>();
    cache.set("", 1);

    const countCombinationsInner = (design: string, patterns: string[]) => {
        if (cache.has(design)) {
            return cache.get(design)!;
        }

        const applicable = patterns.filter(pattern => design.startsWith(pattern));
        let combinations = 0;
        for (const pattern of applicable) {
            const current = countCombinationsInner(design.slice(pattern.length), patterns);
            combinations += current;
        }
        cache.set(design, combinations);
        return combinations;
    }
    return countCombinationsInner;
})();

const partTwo = ({patterns, designs}: Input, debug: boolean) => {
    let total = 0;
    for (const design of designs) {
        const combinations = countCombinations(design, patterns);
        dlog(`Design ${design} has ${combinations} combinations`);
        total += combinations;
    }
    return total;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Input) => {
    console.log(input);
};

const test = (_: Input) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Input, number> = {
    day: 19,
    input: () => processInput(19),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}