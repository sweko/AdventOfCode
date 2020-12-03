import { readInputLines, readInput, debugLog } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";


const processInput = async (day: number) => {
    const input = await readInputLines(day);
    return input.map(line => line.split('').map(char => char === "#"));
};

function checkSlope(input: boolean[][], slope: {x:number, y: number}, debug: boolean) {
    let x = 0;
    let y = 0;
    let result = 0;
    const height = input.length;
    const width = input[0].length;
    while (x < height) {
        debugLog(debug, x, y);
        if (input[x][y]) {
            debugLog(debug, "Отепа се бато");
            result += 1;
        };
        x += slope.x;
        y = (y + slope.y) % width;
    }
    return result;
}

const partOne = (input: boolean[][], debug: boolean) => {
    return checkSlope(input, {y: 3, x: 1}, debug);
};

const partTwo = (input: boolean[][], debug: boolean) => {
    const s11 = checkSlope(input, {y: 1, x: 1}, debug);
    const s31 = checkSlope(input, {y: 3, x: 1}, debug);
    const s51 = checkSlope(input, {y: 5, x: 1}, debug);
    const s71 = checkSlope(input, {y: 7, x: 1}, debug);
    const s12 = checkSlope(input, {y: 1, x: 2}, debug);
    debugLog(debug, s11, s31, s51, s71, s12);
    return s11 * s31 * s51 * s71 * s12;
};

const result = (_: any, result: number) => {
    return `Total count of tree encounters is ${result}`;
};

const showInput = (input: boolean[][]) => {
    console.log(input);
};

const test = (_: boolean[][]) => {
    console.log("----Test-----");
};

export const solutionThree: Puzzle<boolean[][], number> = {
    day: 3,
    input: processInput,
    partOne,
    partTwo,
    resultOne: result,
    resultTwo: result,
    showInput,
    test,
}


