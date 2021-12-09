import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { printMatrix } from "../extra/terminal-helper";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    const lines = input.map(line => line.split("").map(n => parseInt(n, 10)));
    return lines;
};

const partOne = (input: number[][], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const expanded = [
        Array(input[0].length+2).fill(99),
        ...input.map(row => [99, ...row, 99]),
        Array(input[0].length+2).fill(99),
    ];

    let total = 0;
    for (let rindex = 1; rindex < expanded.length-1; rindex++) {
        const row = expanded[rindex];
        for (let cindex = 1; cindex < row.length-1; cindex++) {
            const cell = row[cindex];
            const top = expanded[rindex-1][cindex];
            if (top <= cell) continue;
            const left = expanded[rindex][cindex-1];
            if (left <= cell) continue;
            const bottom = expanded[rindex+1][cindex];
            if (bottom <= cell) continue;
            const right = expanded[rindex][cindex+1];
            if (right <= cell) continue;
            total += cell + 1;
        }
    }

    return total;
};

const partTwo = (input: number[][], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const expanded = [
        Array(input[0].length+2).fill(9),
        ...input.map(row => [9, ...row, 9]),
        Array(input[0].length+2).fill(9),
    ];

    const basins: number[] = [];

    while (true) {
        // find a non-wall cell
        let srcx = -1;
        let srcy = -1;
        // the search process can be optimized by not starting in the top-left corner each time
        for (let rindex = 1; rindex < expanded.length-1; rindex++) {
            const row = expanded[rindex];
            for (let cindex = 1; cindex < row.length-1; cindex++) {
                const cell = row[cindex];
                if (cell !== 9) {
                    srcx = rindex;
                    srcy = cindex;
                    break;
                }
            }
            if (srcx !== -1) break;
        }

        if (srcx === -1) {
            break;
        }

        let basinSize = 0;
        const cells = [{x: srcx, y: srcy}];
        while (cells.length > 0) {
            const {x, y} = cells.shift();
            const cell = expanded[x][y];
            if (cell === 9) {
                continue;
            }
            // enqueue all non-wall neighbors
            const top = expanded[x-1][y];
            if (top !== 9) {
                cells.push({x: x-1, y});
            }
            const left = expanded[x][y-1];
            if (left !== 9) {
                cells.push({x, y: y-1});
            }
            const bottom = expanded[x+1][y];
            if (bottom !== 9) {
                cells.push({x: x+1, y});
            }
            const right = expanded[x][y+1];
            if (right !== 9) {
                cells.push({x, y: y+1});
            }
            // make it into a wall
            expanded[x][y] = 9;
            // count it as a basin
            basinSize+=1;
        }
        basins.push(basinSize);
    }

    basins.sort((a, b) => b - a);

    return basins[0] * basins[1] * basins[2];
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

export const solutionNine: Puzzle<number[][], number> = {
    day: 9,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
