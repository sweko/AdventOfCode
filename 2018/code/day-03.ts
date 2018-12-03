import { readInput, readInputLines } from "../extra/aoc-helper";
import "../extra/array-helpers";

interface Claim {
    index: number;
    left: number;
    top: number;
    width: number;
    height: number;
    isOverlapping?: boolean;
}

async function main() {
    const lines = await readInputLines();

    const claims = lines.map(line => {
        const match = line.match(/#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/);
        const [, index, left, top, width, height] = match.map(m => Number(m));
        return { index, left, top, width, height, isOverlapping: false };
    })

    let overlaps = processPartOne(claims);
    console.log(`Part 1: Overlaping square count = ${overlaps}`);

    let nonOverlaps = processPartTwo(claims);
    console.log(`Part 2: Non Overlaping claim = ${nonOverlaps.index}`);

}

function generateMatrix(limit: number) {
    const matrix = new Array(limit);
    for (let index = 0; index < matrix.length; index++) {
        matrix[index] = new Array(limit).fill(0);
    }
    return matrix;
}

function processPartOne(claims: Claim[]) {
    const matrix = generateMatrix(1000);
    for (const claim of claims) {
        for (let cindex = 0; cindex < claim.width; cindex++) {
            for (let rindex = 0; rindex < claim.height; rindex++) {
                matrix[claim.top + rindex][claim.left + cindex] += 1;
            }
        }
    }
    const result = matrix.sum(row => row.sum(col => col > 1 ? 1 : 0));
    return result;
}


function processPartTwo(claims: Claim[]) {
    const matrix = generateMatrix(1000);
    for (const claim of claims) {
        for (let cindex = 0; cindex < claim.width; cindex++) {
            for (let rindex = 0; rindex < claim.height; rindex++) {
                const element = matrix[claim.top + rindex][claim.left + cindex];
                if (element) {
                    claims[element - 1].isOverlapping = true;
                    claim.isOverlapping = true;
                } else {
                    matrix[claim.top + rindex][claim.left + cindex] = claim.index;
                }
            }
        }
    }
    return claims.find(claim => !claim.isOverlapping);
}


main();