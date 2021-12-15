import { readInputLines, readInput, debugLog } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { printMatrix } from "../extra/terminal-helper";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    const lines = input.map(line => line.split("").map(c => parseInt(c, 10)));
    return lines;
};

const  processCave = (cave: number[][], debug: boolean = false) => {
    const ridiculouslyHighRiskLevel = 999999999;
    const height = cave.length;
    const width = cave[0].length;

    const riskLevel = cave.map(line => line.map(_ => ridiculouslyHighRiskLevel));
    riskLevel[0][0] = 0;

    const queue: [number, number][] = [[0, 0]];
    while (queue.length > 0) {
        const [x, y] = queue.shift();
        const risk = riskLevel[x][y];

        // up
        if (x > 0) {
            if (riskLevel[x - 1][y] > risk + cave[x - 1][y]) {
                riskLevel[x - 1][y] = risk + cave[x - 1][y];
                queue.push([x - 1, y]);
            }
        }
        // down
        if (x < height - 1) {
            if (riskLevel[x + 1][y] > risk + cave[x + 1][y]) {
                riskLevel[x + 1][y] = risk + cave[x + 1][y];
                queue.push([x + 1, y]);
            }
        }
        // left
        if (y > 0) {
            if (riskLevel[x][y - 1] > risk + cave[x][y - 1]) {
                riskLevel[x][y - 1] = risk + cave[x][y - 1];
                queue.push([x, y - 1]);
            }
        }
        // right
        if (y < width - 1) {
            if (riskLevel[x][y + 1] > risk + cave[x][y + 1]) {
                riskLevel[x][y + 1] = risk + cave[x][y + 1];
                queue.push([x, y + 1]);
            }
        }
    }

    if (debug) {
        printMatrix(riskLevel, c => c.toString().padStart(4, " "));
    }

    return riskLevel[height - 1][width - 1];
}

const partOne = (input: number[][], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    return processCave(input, debug);
};

const offset = (value: number, offset: number): number => {
    const result = value + offset;
    if (result > 9) {
        return result - 9;
    }
    return result;
}

const partTwo = (input: number[][], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const height = input.length;
    const width = input[0].length;

    const fullCave = Array(height*5).fill(0).map(() => Array(width*5).fill(0));
    for (let rindex = 0; rindex < 5; rindex++) {
        for (let cindex = 0; cindex < 5; cindex++) {
            for (let x = 0; x < height; x++) {
                for (let y = 0; y < width; y++) {
                    const xindex = rindex * height + x;
                    const yindex = cindex * width + y;
                    fullCave[xindex][yindex] = offset(input[x][y], rindex + cindex);
                }
            }
        }
    }

    return processCave(fullCave);
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

export const solutionFifteen: Puzzle<number[][], number> = {
    day: 15,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}

