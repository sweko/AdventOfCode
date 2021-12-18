import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface NumberTree {
    left: NumberTree | number
    right: NumberTree | number
};

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    return lines;
};

const explode = (input: string) : [boolean, string] => {
    let result = input.split("");
    let index = 0;
    let bracketCount = 0;
    let found = false;
    for (; index < input.length; index++) {
        const char = input[index];
        if (char === "[") {
            bracketCount++;
            if (bracketCount === 5) {
                found = true;
                break;
            }
        } else if (char === "]") {
            bracketCount--;
        }
    }

    if (!found) {
        return [false, input];
    }

    const boom = input.slice(index, input.indexOf("]", index)+1);
    const rx = /^\[(\d+),(\d+)\]$/;
    const match = boom.match(rx);
    if (!match) {
        throw new Error("Invalid match - no kaboom for" + boom);
    }
    const first = parseInt(match[1], 10);
    const second = parseInt(match[2], 10);

    const right = input.slice(index+boom.length);
    const rightrx = /^[\[\],]*(\d+)/;
    const rmatch = right.match(rightrx);
    if (rmatch) {
        const rvalue = parseInt(rmatch[1], 10);
        const deleteCount = rvalue > 9 ? 2 : 1;
        const rresult = rvalue + second;
        let rindex = 0;
        while ([",","[","]"].includes(right[rindex])) { 
            rindex++; 
        }

        result.splice(index + boom.length + rindex, deleteCount, ...rresult.toString().split(""));
    }

    result.splice(index, boom.length, "0");

    const leftrx = /(\d+)[\[\],]*$/;
    const lmatch = input.slice(0, index).match(leftrx);
    if (lmatch) {
        const lvalue = parseInt(lmatch[1], 10);
        const deleteCount = lvalue > 9 ? 2 : 1;
        const lresult = lvalue + first;
        result.splice(lmatch.index, deleteCount, ...lresult.toString().split(""));
    }

    return [true, result.join("")];
}

const split = (input: string) : [boolean, string] => {
    const rx = /\d\d/;
    const match = input.match(rx);
    if (match) {
        const result = input.split("");
        const index = match.index;
        const value = parseInt(match[0], 10);
        const left = Math.floor(value / 2);
        const right = Math.ceil(value / 2);
        const change = `[${left},${right}]`;
        result.splice(index, 2, ...change);
        return [true, result.join("")]
    }

    return [false, input];
}

const reduce = (input: string) : string  => {
    let result = input;
    let success = false;
    while (true) {
        [success, result] = explode(result);
        if (success) {
            continue;
        }

        [success, result] = split(result);
        if (success) {
            continue;
        }
        break;
    }
    return result;
}

const addition = (first: string, second: string) => {
    return reduce(`[${first},${second}]`);
}

const getMagnitude = (input: string): number => {
    let result = input;

    while (result[0] === "[") {
        result = result.replace(/\[(\d+),(\d+)]/g, (_, first: string, second: string) => {
            const f = parseInt(first, 10);
            const s = parseInt(second, 10);
            return (3 * f + 2 * s).toString();
        });
    }

    return parseInt(result);
}

const partOne = (input: string[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let result = input[0];
    for (let index = 1; index < input.length; index++) {
        const element = input[index];
        result = addition(result, element);
    }

    return getMagnitude(result);
};

const partTwo = (input: string[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let max = 0;

    for (let findex = 0; findex < input.length; findex++) {
        for (let sindex = 0; sindex < input.length; sindex++) {
            if (findex === sindex) {
                continue;
            }
            const first = input[findex];
            const second = input[sindex];
            const result = addition(first, second);
            const magnitude = getMagnitude(result);
            if (magnitude > max) {
                max = magnitude;
            }
        }
    }

    return max;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: string[]) => {
    console.log(input);
};

const test = (_: string[]) => {
    console.log("----Test-----");
    console.log(getMagnitude("[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]"));

    console.log(getMagnitude("[[1,2],[[3,4],5]]")); // becomes 143.
    console.log(getMagnitude("[[[[0,7],4],[[7,8],[6,0]]],[8,1]]")); // becomes 1384.
    console.log(getMagnitude("[[[[1,1],[2,2]],[3,3]],[4,4]]")); // becomes 445.
    console.log(getMagnitude("[[[[3,0],[5,3]],[4,4]],[5,5]]")); // becomes 791.
    console.log(getMagnitude("[[[[5,0],[7,4]],[5,5]],[6,6]]")); // becomes 1137.
    console.log(getMagnitude("[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]")); // becomes 3488
};

export const solutionEighteen: Puzzle<string[], number> = {
    day: 18,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
