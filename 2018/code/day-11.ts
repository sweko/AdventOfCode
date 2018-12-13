import { readInput, loopMatrix } from "../extra/aoc-helper";
import { performance } from "perf_hooks";
import "../extra/array-helpers";

interface Node {
    value: number;
    prev: Node;
    next: Node;
}

async function main() {
    const startInput = performance.now();

    const serial = 8444;

    const endInput = performance.now();
    console.log(`Running time for input is ${Math.round(endInput - startInput)}ms`);

    const startOne = performance.now();
    const { top, left } = processPartOne(serial);
    const endOne = performance.now();

    console.log(`Part 1: Maximum power gotten from (${top},${left})`);
    console.log(`Running time for part 1 is ${Math.round(endOne - startOne)}ms`);

    const startTwo = performance.now();
    const { top: top2, left: left2, size } = processPartTwo(serial);
    const endTwo = performance.now();

    console.log(`Part 2: Maximum power gotten from (${top2},${left2},${size})`);
    console.log(`Running time for part 2 is ${Math.round(endTwo - startTwo)}ms`);
}

function getCellPowerLevel(row: number, column: number, serial: number) {
    const rackId = row + 10;
    const powerLevel = (rackId * column + serial) * rackId;
    const result = (powerLevel % 1000) / 100 | 0;
    return result - 5;
}

function processPartOne(serial: number): { top: number, left: number } {
    const size = 300;
    const powers = Array(size + 1).fill([]).map(row => Array(size + 1).fill(0));
    for (let row = 1; row <= size; row++) {
        for (let column = 1; column <= size; column++) {
            const level = getCellPowerLevel(row, column, serial);
            (powers[row - 2] || [])[column - 2] += level;
            (powers[row - 2] || [])[column - 1] += level;
            (powers[row - 2] || [])[column] += level;

            (powers[row - 1] || [])[column - 2] += level;
            (powers[row - 1] || [])[column - 1] += level;
            (powers[row - 1] || [])[column] += level;

            powers[row][column - 2] += level;
            powers[row][column - 1] += level;
            powers[row][column] += level;
        }
    }
    let maxPower = Number.NEGATIVE_INFINITY;
    let result = null;
    loopMatrix(powers, (row, column, element) => {
        if (element > maxPower) {
            maxPower = element;
            result = {
                top: row,
                left: column
            }
        }
    })
    return result;
}

function processPartTwo(serial: number): { top: number, left: number, size: number } {
    const size = 300;
    const powers = Array(size + 1).fill([]).map(row => Array(size + 1).fill(0));
    for (let row = 1; row <= size; row++) {
        for (let column = 1; column <= size; column++) {
            powers[row][column] = getCellPowerLevel(row, column, serial);
        }
    }

    let total = {
        maxPower: Number.NEGATIVE_INFINITY,
        top: -1,
        left: -1,
        size: -1
    }

    for (let sqsize = 1; sqsize <= size; sqsize++) {
        const {top, left, maxPower} = processPowers(powers, sqsize);
        if (maxPower > total.maxPower) {
            total = {
                maxPower,
                top,
                left,
                size: sqsize
            }
        }
    }

    return total;
}

function processPowers(powers: number[][], squareSize: number) {
    console.log(`---- ${squareSize}----`);
    let maxPower = Number.NEGATIVE_INFINITY;
    let top, left;
    for (let rowIndex = 1; rowIndex <= powers.length - squareSize; rowIndex++) {
        for (let colIndex = 1; colIndex <= powers.length - squareSize; colIndex++) {
            let power = 0;
            for (let row = 0; row < squareSize; row++) {
                for (let column = 0; column < squareSize; column++) {
                    power += powers[rowIndex + row][colIndex + column];
                }
            }
            if (power > maxPower) {
                maxPower = power;
                top = rowIndex;
                left = colIndex;
            }
        }
    }
    return { top, left, maxPower };
}



main();