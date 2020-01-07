import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { printMatrix } from "../extra/terminal-helper";

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const result = Array(7).fill(0).map(_ => Array(7).fill(0));
    for (let lindex = 0; lindex < lines.length; lindex++) {
        const line = lines[lindex];
        for (let cindex = 0; cindex < line.length; cindex++) {
            const char = line[cindex];
            if (char === "#") {
                result[lindex + 1][cindex + 1] = 1 << (cindex + lindex * 5);
            }
        }
    }
    return result;
};

const getSum = (eris: number[][]) => eris.sum(row => row.sum());

const getNext = (eris: number[][]) => {
    const result = Array(7).fill(0).map(_ => Array(7).fill(0));
    for (let lindex = 1; lindex <= 5; lindex++) {
        for (let cindex = 1; cindex <= 5; cindex++) {
            const up = (eris[lindex - 1][cindex] === 0) ? 0 : 1;
            const down = (eris[lindex + 1][cindex] === 0) ? 0 : 1;
            const left = (eris[lindex][cindex - 1] === 0) ? 0 : 1;
            const right = (eris[lindex][cindex + 1] === 0) ? 0 : 1;
            const neighbours = up + down + left + right;
            if (eris[lindex][cindex] === 0) {
                if ((neighbours === 1) || (neighbours === 2)) {
                    result[lindex][cindex] = 1 << (cindex - 1 + (lindex - 1) * 5);
                } else {
                    result[lindex][cindex] = 0;
                }
            } else {
                if (neighbours === 1) {
                    result[lindex][cindex] = eris[lindex][cindex];
                } else {
                    result[lindex][cindex] = 0;
                }
            }
        }
    }
    return result;
}

const partOne = (input: number[][], debug: boolean) => {
    const previous: { [key: number]: true } = { [getSum(input)]: true };

    let next = getNext(input);
    while (true) {
        const sum = getSum(next);
        if (previous[sum]) return sum;
        previous[sum] = true;
        next = getNext(next);
    }
};

const partTwo = (input: number[][], debug: boolean) => {

    const eris = [{
        level: 0,
        layout: input
    }];

    return 0;
};

const resultOne = (_: any, result: number) => {
    return `Biodiversity rating ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The period of the orbit is ${result}`;
};

const showInput = (input: number[][]) => {
    console.log(input);
};

const test = (_: number[][]) => {
    console.log("----Test-----");
};

export const solution24: Puzzle<number[][], number> = {
    day: 24,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
