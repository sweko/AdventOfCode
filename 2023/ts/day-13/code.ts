// Solution for day 13 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type Floor = "." | "#";

type FloorMatrix = Floor[][];

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const result = [] as FloorMatrix[];
    let line = lines.shift()!;
    while (lines.length > 0) {
        const floorMatrix = [] as FloorMatrix;
        while (line) {
            const row = line.split("") as Floor[];
            floorMatrix.push(row);
            line = lines.shift()!;
        }
        line = lines.shift()!;
        result.push(floorMatrix);
    }
    return result;
};

const getMirrorNumber = (floorMatrix: FloorMatrix) => {
    // process vertically
    const vmirroringPoints = Array(floorMatrix[0].length-1).fill(0).map((_, i) => i+1);
    for (let rindex = 0; rindex < floorMatrix.length; rindex++) {
        const row = floorMatrix[rindex];
        // find mirroring points
        for (let mindex = 0; mindex < vmirroringPoints.length; mindex++) {
            const mpoint = vmirroringPoints[mindex];
            // check if mirroring point is valid
            let left = mpoint - 1;
            let right = mpoint;

            while (left >= 0 && right < row.length) {
                if (row[left] !== row[right]) {
                    vmirroringPoints.splice(mindex, 1);
                    mindex--;
                    break;
                }
                left -= 1;
                right += 1;
            }
        }
    }

    if (vmirroringPoints.length === 1) {
        return vmirroringPoints[0];
    }

    // process column-wise
    const hmirroringPoints = Array(floorMatrix.length-1).fill(0).map((_, i) => i+1);
    for (let cindex = 0; cindex < floorMatrix[0].length; cindex++) {
        const column = floorMatrix.map(row => row[cindex]);
        // find mirroring points
        for (let mindex = 0; mindex < hmirroringPoints.length; mindex++) {
            const mpoint = hmirroringPoints[mindex];
            // check if mirroring point is valid
            let left = mpoint - 1;
            let right = mpoint;

            while (left >= 0 && right < column.length) {
                if (column[left] !== column[right]) {
                    hmirroringPoints.splice(mindex, 1);
                    mindex--;
                    break;
                }
                left -= 1;
                right += 1;
            }
        }
    }

    const hresult = (hmirroringPoints[0] || 0) * 100;
    return hresult;
};

const partOne = (input: FloorMatrix[], debug: boolean) => {
    const mirrorCount = input.sum((floorMatrix) => getMirrorNumber(floorMatrix));
    return mirrorCount;
};

const getAllMirrorNumber = (floorMatrix: FloorMatrix) => {
    // process vertically
    const vmirroringPoints = Array(floorMatrix[0].length-1).fill(0).map((_, i) => i+1);
    for (let rindex = 0; rindex < floorMatrix.length; rindex++) {
        const row = floorMatrix[rindex];
        // find mirroring points
        for (let mindex = 0; mindex < vmirroringPoints.length; mindex++) {
            const mpoint = vmirroringPoints[mindex];
            // check if mirroring point is valid
            let left = mpoint - 1;
            let right = mpoint;

            while (left >= 0 && right < row.length) {
                if (row[left] !== row[right]) {
                    vmirroringPoints.splice(mindex, 1);
                    mindex--;
                    break;
                }
                left -= 1;
                right += 1;
            }
        }
    }

    // process column-wise
    const hmirroringPoints = Array(floorMatrix.length-1).fill(0).map((_, i) => i+1);
    for (let cindex = 0; cindex < floorMatrix[0].length; cindex++) {
        const column = floorMatrix.map(row => row[cindex]);
        // find mirroring points
        for (let mindex = 0; mindex < hmirroringPoints.length; mindex++) {
            const mpoint = hmirroringPoints[mindex];
            // check if mirroring point is valid
            let left = mpoint - 1;
            let right = mpoint;

            while (left >= 0 && right < column.length) {
                if (column[left] !== column[right]) {
                    hmirroringPoints.splice(mindex, 1);
                    mindex--;
                    break;
                }
                left -= 1;
                right += 1;
            }
        }
    }

    return [...vmirroringPoints, ...hmirroringPoints.map(h => h * 100)];

};

const copyMatrixWith = (floorMatrix: FloorMatrix, x: number, y: number): FloorMatrix => {
    const copy = floorMatrix.map(row => row.slice());
    copy[x][y] = (copy[x][y] === ".") ? "#" : ".";
    return copy;
}

const getUnsmudgedFloors = (floorMatrix: FloorMatrix): FloorMatrix[] => {
    const floors = [] as FloorMatrix[];
    for (let x = 0; x < floorMatrix.length; x++) {
        for (let y = 0; y < floorMatrix[0].length; y++) {
            floors.push(copyMatrixWith(floorMatrix, x, y));
        }
    }
    return floors;
};

const getSmudgeMirrorNumber = (floorMatrix: FloorMatrix) => {
    const originalLine = getMirrorNumber(floorMatrix);
    const floors = getUnsmudgedFloors(floorMatrix);
    const mirrors = floors
        .map(floor => getAllMirrorNumber(floor))
        .map(mirror => mirror.filter(m => m !== originalLine))
        .filter(mirror => mirror.length !== 0)
        .flatMap(mirror => mirror);

    const differentLines = [...new Set(mirrors)];
    if (differentLines.length !== 1) {
        // this line should never be reached
        // it will be reached if the input is not valid
        console.log("Houston, we have a problem");
    }

    return differentLines[0];
};

const partTwo = (input: FloorMatrix[], debug: boolean) => {
    const mirrorCount = input.sum((floorMatrix) => getSmudgeMirrorNumber(floorMatrix));
    return mirrorCount;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: FloorMatrix[]) => {
    console.log(input);
};

const test = (_: FloorMatrix[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<FloorMatrix[], number> = {
    day: 13,
    input: () => processInput(13),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}