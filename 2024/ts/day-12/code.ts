// Solution for day 12 of advent of code 2024

import { readInputLines, readInput, dlog } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";

const processInput = (day: number) => {
    const lines = readInputLines(day);
    return lines.map(line => line.split(""));
};

type Point = {
    x: number;
    y: number;
}

type Plot = Point & {
    type: string
}

type Region = Plot[];

const pointInBounds = (point: Point, width: number, height: number) => {
    return point.x >= 0 && point.x < width && point.y >= 0 && point.y < height;
}


const partOne = (input: string[][], debug: boolean) => {
    const width = input[0].length;
    const height = input.length;

    const plots: Record<string, Plot[]> = {};

    for (let rindex = 0; rindex < height; rindex++) {
        for (let cindex = 0; cindex < width; cindex++) {
            const cell = input[rindex][cindex];

            if (plots[cell] === undefined) {
                plots[cell] = [];
            }

            plots[cell].push({x: cindex, y: rindex, type: cell});
        }
    }

    let price = 0;

    for (const type in plots) {
        const cells = plots[type];

        while (cells.length > 0) {
            const cellQueue = [cells.shift()!];
            const region: Region = [];
            while (cellQueue.length > 0) {
                const currentCell = cellQueue.shift()!;
                region.push(currentCell);
                const neighbors = [
                    {x: currentCell.x - 1, y: currentCell.y},
                    {x: currentCell.x + 1, y: currentCell.y},
                    {x: currentCell.x, y: currentCell.y - 1},
                    {x: currentCell.x, y: currentCell.y + 1},
                ]
                .filter(p => pointInBounds(p, width, height))
                .filter(p => input[p.y][p.x] === currentCell.type);

                for (const neighbor of neighbors) {
                    const nindex = cells.findIndex(c => c.x === neighbor.x && c.y === neighbor.y);
                    if (nindex >= 0) {
                        const ncell = cells[nindex];
                        cells.splice(nindex, 1);
                        cellQueue.push(ncell);
                    }
                }
            }

            const rarea = region.length;
            let rperimeter = 0;
            for (const cell of region) {
                const neighbors = [
                    {x: cell.x - 1, y: cell.y},
                    {x: cell.x + 1, y: cell.y},
                    {x: cell.x, y: cell.y - 1},
                    {x: cell.x, y: cell.y + 1},
                ]
                .filter(p => {
                    if (pointInBounds(p, width, height)) {
                        return input[p.y][p.x] !== cell.type;
                    }
                    return true;
                });

                rperimeter += neighbors.length;
            }

            dlog(`Region of type ${type} has area ${rarea} and perimeter ${rperimeter}`);
            price += rarea * rperimeter;
        }
    }

    return price;
};

const partTwo = (input: string[][], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    return input.length;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: string[][]) => {
    console.log(input);
};

const test = (_: string[][]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<string[][], number> = {
    day: 12,
    input: () => processInput(12),
    partOne,
    //partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}