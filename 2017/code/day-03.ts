import { readInput, readInputLines } from "../extra/aoc-helper";

async function main() {
    const input = 325489;

    let pathlen = processPartOne(input);
    console.log(`Part 1: Minimal path length = ${pathlen}`);

    let minvalue = processPartTwo(input);
    console.log(`Part 2: Minimal value = ${minvalue}`);

}

function generateMatrix(limit: number) {
    let side = Math.sqrt(limit) | 0;
    side += (side % 2 == 0) ? 1 : 2;
    let center = (side / 2) | 0

    let matrix = new Array(side);
    for (let index = 0; index < matrix.length; index++) {
        matrix[index] = new Array(side).fill(0);
    }

    matrix[center][center] = 1;
    let value = 2;
    let currentX = center;
    let currentY = center;

    for (let index = 1; index <= center; index += 1) {
        let dindex = (2 * index - 1);
        let start = dindex * dindex + 1;
        for (let i = 0; i <= dindex; i++) {
            matrix[center + index - 1 - i][center + index] = start++;
        }
        for (let i = 0; i <= dindex; i++) {
            matrix[center - index][center + index - i - 1] = start++;
        }
        for (let i = 0; i <= dindex; i++) {
            matrix[center - index + i + 1][center - index] = start++;
        }
        for (let i = 0; i <= dindex; i++) {
            matrix[center + index][center - index + i + 1] = start++;
        }
    }
    return matrix;
}

function processPartOne(input: number) {
    let side = Math.sqrt(input) | 0;
    if (side % 2 == 0) side++;
    let center = (side / 2) | 0;

    const matrix = generateMatrix(input);

    let rindex, cindex;
    for (rindex = 0; rindex < matrix.length; rindex++) {
        const row = matrix[rindex];
        cindex = row.indexOf(input);
        if (cindex !== -1) {
            break;
        }
    }
    return Math.abs(rindex - center) + Math.abs(cindex - center);
}

function getCellValue(matrix: number[][], width: number, height: number) {
    let sum = 0;
    sum += matrix[width - 1][height - 1];
    sum += matrix[width - 1][height];
    sum += matrix[width - 1][height + 1];
    sum += matrix[width][height - 1];
    sum += matrix[width][height + 1];
    sum += matrix[width + 1][height - 1]
    sum += matrix[width + 1][height]
    sum += matrix[width + 1][height + 1];
    return sum;
}

function generateSumMatrix(limit: number) {
    let side = Math.sqrt(limit) | 0;
    side += (side % 2 == 0) ? 1 : 2;
    let center = (side / 2) | 0

    let matrix = new Array(side);
    for (let index = 0; index < matrix.length; index++) {
        matrix[index] = new Array(side).fill(0);
    }

    matrix[center][center] = 1;
    let value = 2;
    let currentX = center;
    let currentY = center;

    for (let index = 1; index <= center; index += 1) {
        let dindex = (2 * index - 1);
        for (let i = 0; i <= dindex; i++) {
            const value = getCellValue(matrix, center + index - 1 - i, center + index);
            if (value > limit)
                return value;
            matrix[center + index - 1 - i][center + index] = value;
        }
        for (let i = 0; i <= dindex; i++) {
            const value = getCellValue(matrix, center - index, center + index - i - 1);
            if (value > limit)
                return value;
            matrix[center - index][center + index - i - 1] = value;
        }
        for (let i = 0; i <= dindex; i++) {
            const value = getCellValue(matrix, center - index + i + 1, center - index);
            if (value > limit)
                return value;
            matrix[center - index + i + 1][center - index] = value;
        }
        for (let i = 0; i <= dindex; i++) {
            const value = getCellValue(matrix, center + index, center - index + i + 1);
            if (value > limit)
                return value;
            matrix[center + index][center - index + i + 1] = value;
        }
    }
    return matrix;
}

function processPartTwo(input: number) {
    const minValue = generateSumMatrix(input);
    return minValue;
}


main();