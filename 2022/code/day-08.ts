import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { printMatrix } from "../extra/terminal-helper";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const heights = lines.map(line => line.split("").map(c => parseInt(c)));
    return heights;
};

const partOne = (input: number[][], debug: boolean) => {
    if (debug) {
        console.debug("-------Debug-----");
    }
    const width = input[0].length;
    const height = input.length;

    const visibility: boolean[][] = Array(height).fill([]).map(_ => Array(width).fill(false));

    // mark left view
    for (let y = 0; y < height; y++) {
        let max = -1;
        for (let x = 0; x < width; x++) {
            if (input[y][x] > max) {
                max = input[y][x];
                visibility[y][x] = true;
            }
        }
    }

    // mark right view
    for (let y = 0; y < height; y++) {
        let max = -1;
        for (let x = width - 1; x >= 0; x--) {
            if (input[y][x] > max) {
                max = input[y][x];
                visibility[y][x] = true;
            }
        }
    }

    // mark top view
    for (let x = 0; x < width; x++) {
        let max = -1;
        for (let y = 0; y < height; y++) {
            if (input[y][x] > max) {
                max = input[y][x];
                visibility[y][x] = true;
            }
        }
    }

    // mark bottom view
    for (let x = 0; x < width; x++) {
        let max = -1;
        for (let y = height - 1; y >= 0; y--) {
            if (input[y][x] > max) {
                max = input[y][x];
                visibility[y][x] = true;
            }
        }
    }

    const result = visibility.map(row => row.filter(v => v).length).sum();

    return result;
};

const partTwo = (input: number[][], debug: boolean) => {
    if (debug) {
        console.debug("-------Debug-----");
    }

    let maxScore = -1;

    const width = input[0].length;
    const height = input.length;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const tree = input[y][x];
            let topScore = 0;
            // count up
            let topDiff = 1;
            while ((y-topDiff >= 0) && (input[y-topDiff][x] < tree)) {
                topScore += 1;
                topDiff += 1;
            }
            // are we not over the top?
            if (y-topDiff >= 0) {
                topScore += 1;
            }

            // count down
            let bottomScore = 0;
            let bottomDiff = 1;
            while ((y+bottomDiff < height) && (input[y+bottomDiff][x] < tree)) {
                bottomScore += 1;
                bottomDiff += 1;
            }
            // are we not over the bottom?
            if (y+bottomDiff < height) {
                bottomScore += 1;
            }

            // count left
            let leftScore = 0;
            let leftDiff = 1;
            while ((x-leftDiff >= 0) && (input[y][x-leftDiff] < tree)) {
                leftScore += 1;
                leftDiff += 1;
            }
            // are we not over the left?
            if (x-leftDiff >= 0) {
                leftScore += 1;
            }

            // count right
            let rightScore = 0;
            let rightDiff = 1;
            while ((x+rightDiff < width) && (input[y][x+rightDiff] < tree)) {
                rightScore += 1;
                rightDiff += 1;
            }
            // are we not over the right?
            if (x+rightDiff < width) {
                rightScore += 1;
            }

            const score = topScore * bottomScore * leftScore * rightScore;
            if (score > maxScore) {
                //console.log(`Found a scenic one at ${x},${y} with score ${score}`)
                maxScore = score;
            }

        }
    }
    return maxScore;
};

const resultOne = (_: number[][], result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: number[][], result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: number[][]) => {
    console.log(input);
};

const test = (_: number[][]) => {
    console.log("----Test-----");
};

export const solutionEight: Puzzle<number[][], number> = {
    day: 8,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
