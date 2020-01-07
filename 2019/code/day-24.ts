import { readInputLines, readInput, debugLog } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { printMatrix } from "../extra/terminal-helper";

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const result = Array(5).fill(0).map(_ => Array(5).fill(0));
    for (let lindex = 0; lindex < lines.length; lindex++) {
        const line = lines[lindex];
        for (let cindex = 0; cindex < line.length; cindex++) {
            const char = line[cindex];
            if (char === "#") {
                result[lindex][cindex] = 1;
            }
        }
    }
    return result;
};

const getState = (isBug: boolean, neighbours: number) => {
    if (isBug) {
        return (neighbours === 1) ? 1 : 0
    } else {
        return ((neighbours === 1) || (neighbours === 2)) ? 1 : 0
    }
};

const getttersOne = [
    [
        (eris: number[][]) => getState(eris[0][0] === 1, eris[0][1] + eris[1][0]),
        (eris: number[][]) => getState(eris[0][1] === 1, eris[0][0] + eris[0][2] + eris[1][1]),
        (eris: number[][]) => getState(eris[0][2] === 1, eris[0][1] + eris[0][3] + eris[1][2]),
        (eris: number[][]) => getState(eris[0][3] === 1, eris[0][2] + eris[0][4] + eris[1][3]),
        (eris: number[][]) => getState(eris[0][4] === 1, eris[0][3] + eris[1][4]),
    ],
    [
        (eris: number[][]) => getState(eris[1][0] === 1, eris[0][0] + eris[1][1] + eris[2][0]),
        (eris: number[][]) => getState(eris[1][1] === 1, eris[0][1] + eris[1][0] + eris[1][2] + eris[2][1]),
        (eris: number[][]) => getState(eris[1][2] === 1, eris[0][2] + eris[1][1] + eris[1][3] + eris[2][2]),
        (eris: number[][]) => getState(eris[1][3] === 1, eris[0][3] + eris[1][2] + eris[1][4] + eris[2][3]),
        (eris: number[][]) => getState(eris[1][4] === 1, eris[0][4] + eris[1][3] + eris[2][4]),
    ],
    [
        (eris: number[][]) => getState(eris[2][0] === 1, eris[1][0] + eris[2][1] + eris[3][0]),
        (eris: number[][]) => getState(eris[2][1] === 1, eris[1][1] + eris[2][0] + eris[2][2] + eris[3][1]),
        (eris: number[][]) => getState(eris[2][2] === 1, eris[1][2] + eris[2][1] + eris[2][3] + eris[3][2]),
        (eris: number[][]) => getState(eris[2][3] === 1, eris[1][3] + eris[2][2] + eris[2][4] + eris[3][3]),
        (eris: number[][]) => getState(eris[2][4] === 1, eris[1][4] + eris[2][3] + eris[3][4]),
    ],
    [
        (eris: number[][]) => getState(eris[3][0] === 1, eris[2][0] + eris[3][1] + eris[4][0]),
        (eris: number[][]) => getState(eris[3][1] === 1, eris[2][1] + eris[3][0] + eris[3][2] + eris[4][1]),
        (eris: number[][]) => getState(eris[3][2] === 1, eris[2][2] + eris[3][1] + eris[3][3] + eris[4][2]),
        (eris: number[][]) => getState(eris[3][3] === 1, eris[2][3] + eris[3][2] + eris[3][4] + eris[4][3]),
        (eris: number[][]) => getState(eris[3][4] === 1, eris[2][4] + eris[3][3] + eris[4][4]),
    ],
    [
        (eris: number[][]) => getState(eris[4][0] === 1, eris[4][1] + eris[3][0]),
        (eris: number[][]) => getState(eris[4][1] === 1, eris[4][0] + eris[4][2] + eris[3][1]),
        (eris: number[][]) => getState(eris[4][2] === 1, eris[4][1] + eris[4][3] + eris[3][2]),
        (eris: number[][]) => getState(eris[4][3] === 1, eris[4][2] + eris[4][4] + eris[3][3]),
        (eris: number[][]) => getState(eris[4][4] === 1, eris[4][3] + eris[3][4]),
    ]
]

const getSum = (eris: number[][]) => eris.sum((row, rindex) => row.sum((cell, cindex) => cell << (cindex + rindex * 5)));

const getNextOne = (eris: number[][]) => eris.map((row, rindex) => row.map((cell, cindex) => getttersOne[rindex][cindex](eris)));

const partOne = (eris: number[][], debug: boolean) => {

    const previous: { [key: number]: true } = { [getSum(eris)]: true };

    let next = getNextOne(eris);
    while (true) {
        const sum = getSum(next);
        if (previous[sum]) return sum;
        previous[sum] = true;
        next = getNextOne(next);
    }
};

const getttersTwo = [
    [
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[0][0] === 1, eris[0][1] + eris[1][0] + above[1][2] + above[2][1]),
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[0][1] === 1, eris[0][0] + eris[0][2] + eris[1][1] + above[1][2]),
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[0][2] === 1, eris[0][1] + eris[0][3] + eris[1][2] + above[1][2]),
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[0][3] === 1, eris[0][2] + eris[0][4] + eris[1][3] + above[1][2]),
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[0][4] === 1, eris[0][3] + eris[1][4] + above[1][2] + above[2][3]),
    ],
    [
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[1][0] === 1, eris[0][0] + eris[1][1] + eris[2][0] + above[2][1]),
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[1][1] === 1, eris[0][1] + eris[1][0] + eris[1][2] + eris[2][1]),
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[1][2] === 1, eris[0][2] + eris[1][1] + eris[1][3] + below[0].sum()),
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[1][3] === 1, eris[0][3] + eris[1][2] + eris[1][4] + eris[2][3]),
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[1][4] === 1, eris[0][4] + eris[1][3] + eris[2][4] + above[2][3]),
    ],
    [
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[2][0] === 1, eris[1][0] + eris[2][1] + eris[3][0] + above[2][1]),
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[2][1] === 1, eris[1][1] + eris[2][0] + eris[3][1] + below.sum(row => row[0])),
        (eris: number[][], above: number[][], below: number[][]) => 0,
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[2][3] === 1, eris[1][3] + eris[2][4] + eris[3][3] + below.sum(row => row[4])),
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[2][4] === 1, eris[1][4] + eris[2][3] + eris[3][4] + above[2][3]),
    ],
    [
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[3][0] === 1, eris[2][0] + eris[3][1] + eris[4][0] + above[2][1]),
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[3][1] === 1, eris[2][1] + eris[3][0] + eris[3][2] + eris[4][1]),
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[3][2] === 1, eris[3][1] + eris[3][3] + eris[4][2] + below[4].sum()),
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[3][3] === 1, eris[2][3] + eris[3][2] + eris[3][4] + eris[4][3]),
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[3][4] === 1, eris[2][4] + eris[3][3] + eris[4][4] + above[2][3]),
    ],
    [
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[4][0] === 1, eris[4][1] + eris[3][0] + above[2][1] + above[3][2]),
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[4][1] === 1, eris[4][0] + eris[4][2] + eris[3][1] + above[3][2]),
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[4][2] === 1, eris[4][1] + eris[4][3] + eris[3][2] + above[3][2]),
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[4][3] === 1, eris[4][2] + eris[4][4] + eris[3][3] + above[3][2]),
        (eris: number[][], above: number[][], below: number[][]) => getState(eris[4][4] === 1, eris[4][3] + eris[3][4] + above[3][2] + above[2][3]),
    ]
]

const getNextTwo = (eris: number[][], above: number[][], below: number[][]) => eris.map((row, rindex) => row.map((cell, cindex) => getttersTwo[rindex][cindex](eris, above, below)));

const partTwo = (input: number[][], debug: boolean) => {

    let eris: { [key: string]: number[][] } = {
        0: input
    };

    if (debug) printMatrix(eris[0], cell => cell ? "#" : ".");

    for (let index = 0; index < 200; index++) {
        const result: { [key: number]: number[][] } = {};
        const gridIndices = Object.keys(eris).map(key => Number(key));
        for (const gridIndex of gridIndices) {
            const grid = eris[gridIndex];
            const above = eris[gridIndex + 1] || Array(5).fill(0).map(_ => Array(5).fill(0));
            const below = eris[gridIndex - 1] || Array(5).fill(0).map(_ => Array(5).fill(0));
            result[gridIndex] = getNextTwo(grid, above, below);
        }
        const bottomIndex = gridIndices.min();
        const bottom = getNextTwo(Array(5).fill(0).map(_ => Array(5).fill(0)), eris[bottomIndex], Array(5).fill(0).map(_ => Array(5).fill(0)));
        if (bottom.sum(row => row.sum()) !== 0) {
            result[bottomIndex - 1] = bottom;
        }
        const topIndex = gridIndices.max();
        const top = getNextTwo(Array(5).fill(0).map(_ => Array(5).fill(0)), Array(5).fill(0).map(_ => Array(5).fill(0)), eris[topIndex]);
        if (top.sum(row => row.sum()) !== 0) {
            result[topIndex + 1] = top;
        }
        eris = result;
        debugLog(debug, `------${index}------`);
        for (const key of Object.keys(eris).sort((f, s) => Number(f) - Number(s))) {
            debugLog(debug, Number(key) > 0 ? `Above ${key}` : Number(key) < 0 ? `Below ${-key}` : 0);
            if (debug) {
                printMatrix(eris[key], cell => cell ? "#" : ".");
            }
        }
    }

    return Object.values(eris).sum(grid => grid.sum(row => row.sum()));
};

const resultOne = (_: any, result: number) => {
    return `Biodiversity rating ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Total number of bugs is ${result}`;
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
