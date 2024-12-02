// Solution for day 2 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const reports = lines.map(line => line.split(" ").map(num => parseInt(num)));
    return reports;
};

const partOne = (input: number[][], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let safeCount = 0;

    for (const report of input) {
        let broken = false;
        const direction = (report[1] - report[0] > 0) ? 1 : -1;
        //console.log(`Direction: ${direction}`);
        for (let index = 1; index < report.length; index++) {
            const current = report[index];
            const previous = report[index - 1];
            const diff = current - previous;
            if (diff * direction <= 0) {
                broken = true;
                //console.log(`Broken report (direction error): ${report}`);
                break;
            }
            if (Math.abs(diff) > 3) {
                broken = true;
                //console.log(`Broken report (diff error): ${report}`);
                break;
            }
        }
        if (!broken) {
            //console.log(`Safe report: ${report}`);
            safeCount++;
        }
    }

    return safeCount;
};

const checkReport = (report: number[]) => {
    const direction = (report[1] - report[0] > 0) ? 1 : -1;
    for (let index = 1; index < report.length; index++) {
        const current = report[index];
        const previous = report[index - 1];
        const diff = current - previous;
        if (diff * direction <= 0) {
            return false
        }
        if (Math.abs(diff) > 3) {
            return false;
        }
    }
    return true;
}

const partTwo = (input: number[][], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let safeCount = 0;

    for (const report of input) {
        if (checkReport(report)) {
            safeCount++;
        } else {
            // try all the combinations where we remove a single element
            for (let index = 0; index < report.length; index++) {
                const newReport = report.slice(0, index).concat(report.slice(index + 1));
                if (checkReport(newReport)) {
                    safeCount++;
                    break;
                }
            }
        }
    }

    return safeCount;
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
    day: 2,
    input: () => processInput(2),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}