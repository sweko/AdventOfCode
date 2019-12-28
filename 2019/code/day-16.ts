import { readInputLines, readInput, debugLog } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { performance } from "perf_hooks";
import { memoize } from "../extra/num-helpers";

const processInput = async (day: number) => {
    const result = await readInput(day);
    return result;
};

const partOne = (input: string, debug: boolean) => {
    let digits = input.split("").map(d => Number(d));
    total = digits.length;

    for (let index = 0; index < 100; index++) {
        digits = getNext(digits);
    }

    debugLog(debug, `Average run time is ${timings.sum(t => t.total) / timings.length}ms`)
    debugLog(debug, `Average factor time is ${timings.sum(t => t.factors) / timings.length}ms`)
    debugLog(debug, `Average flatten time is ${timings.sum(t => t.flat) / timings.length}ms`)

    return Number(digits.slice(0, 8).join(""));
};

const partTwo = (input: string, debug: boolean) => {
    const offset = Number(input.slice(0, 7));
    const totalLength = input.length * 10000;
    const rest = totalLength - offset;
    const times = Math.ceil(rest / input.length);
    const realInput = input.repeat(times).slice(input.length * times - rest).split("").map(c => Number(c));
    console.log("Length of relevant input:", realInput.length);
    console.log("Calculated length:", rest);


    let source = [...realInput, 0];
    for (let index = 0; index < 100; index++) {
        const result: number[] = Array(rest + 1).fill(0);
        for (let index = realInput.length - 1; index >= 0; index--) {
            result[index] = (result[index + 1] + source[index]) % 10;
        }
        source = result;
    }

    return Number(source.slice(0, 8).join(""));
};

const timings: { total: number, factors: number, flat: number }[] = [];
let timing: { total: number, factors: number, flat: number };
let muls = 0;

// TOTAL HACK
let total = 0;

const getFactors = memoize((index: number) => {
    const start1 = performance.now();

    const factors = Array(index + 1).fill(0)
        .concat(...Array(index + 1).fill(1))
        .concat(...Array(index + 1).fill(0))
        .concat(...Array(index + 1).fill(-1));

    const end1 = performance.now();
    timing.factors += end1 - start1;

    const start2 = performance.now();
    const times = Math.ceil(total / factors.length) + 1;

    let result = Array(total + 1).fill(null);
    for (let index = 0; index < result.length; index++) {
        result[index] = factors[index % factors.length];
    }
    result = result.slice(1);

    const end2 = performance.now();
    timing.flat += end2 - start2;

    return result;
});

const getNext = (digits: number[]) => {
    const start = performance.now();
    const result: number[] = Array(digits.length);
    timing = { total: 0, factors: 0, flat: 0 };
    timings.push(timing);


    for (let index = 0; index < digits.length; index++) {
        const factors = getFactors(index);
        let resDigit = 0;
        for (let findex = index; findex < factors.length; findex++) {
            const factor = factors[findex];
            if (factor !== 0) {
                const digit = digits[findex];
                if (factor === 1) {
                    resDigit += digit;
                } else {
                    resDigit -= digit;
                }
                muls += 1;
            }
        }
        result[index] = Math.abs(resDigit) % 10;
    }
    const end = performance.now();
    timing.total = end - start;

    return result;
}

const resultOne = (_: any, result: number) => {
    return `The first eight digits in the final output are ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The eight digit embedded message is ${result}`;
};

const showInput = (input: string) => {
    console.log(input);
};

const test = (_: string) => {
    let digits = "80871224585914546619083218645595".split("").map(d => Number(d));
    total = digits.length;
    for (let index = 0; index < 100; index++) {
        digits = getNext(digits);
    }
    console.log(Number(digits.slice(0, 8).join("")));
    console.log(Number(digits.slice(0, 8).join("")) === 24176176);
    console.log(muls);
};

export const solution16: Puzzle<string, number> = {
    day: 16,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
