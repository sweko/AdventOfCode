// Solution for day 16 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";

type Cell = "." | "/" | "\\" | "-" | "|";
type Direction = "up" | "down" | "left" | "right";

interface Point {
    x: number;
    y: number;
}

interface Beam extends Point {
    direction: Direction;
}

interface DataCell {
    cell: Cell;
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    energized: boolean;
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const cells = lines.map(line => line.split("") as Cell[]);
    return cells;
};

const getNextLocation = (beam: Beam, dataCells: any[][]) => {
    if (beam.direction === "up") {
        if (beam.y === 0) {
            return null;
        }
        return {
            x: beam.x,
            y: beam.y - 1
        };
    }
    if (beam.direction === "down") {
        if (beam.y === dataCells.length - 1) {
            return null;
        }
        return {
            x: beam.x,
            y: beam.y + 1
        };
    }
    if (beam.direction === "left") {
        if (beam.x === 0) {
            return null;
        }
        return {
            x: beam.x - 1,
            y: beam.y
        };
    }
    if (beam.direction !== "right") {
        throw Error(`Unknown direction ${beam.direction}`);
    }
    if (beam.x === dataCells[beam.y].length - 1) {
        return null;
    }
    return {
        x: beam.x + 1,
        y: beam.y
    };
};

function getEnergizedCount(input: Cell[][], startBeam: Beam) {
    const dataCells: DataCell[][] = input.map((row, y) => row.map((cell, x) => ({
        cell,
        left: false,
        right: false,
        up: false,
        down: false,
        energized: false,
    })));

    const queue: Beam[] = [startBeam];
    while (queue.length > 0) {
        const beam = queue.shift()!;
        const point = getNextLocation(beam, dataCells);
        if (point === null) {
            continue;
        }

        const nextCell = dataCells[point.y][point.x];
        if (nextCell[beam.direction]) {
            continue;
        }

        nextCell[beam.direction] = true;
        nextCell.energized = true;
        if (nextCell.cell === ".") {
            beam.x = point.x;
            beam.y = point.y;
            queue.push(beam);
            continue;
        }

        if (nextCell.cell === "/") {
            if (beam.direction === "up") {
                beam.direction = "right";
            } else if (beam.direction === "down") {
                beam.direction = "left";
            } else if (beam.direction === "left") {
                beam.direction = "down";
            } else if (beam.direction === "right") {
                beam.direction = "up";
            }
            beam.x = point.x;
            beam.y = point.y;
            queue.push(beam);
            continue;
        }

        if (nextCell.cell === "\\") {
            if (beam.direction === "up") {
                beam.direction = "left";
            } else if (beam.direction === "down") {
                beam.direction = "right";
            } else if (beam.direction === "left") {
                beam.direction = "up";
            } else if (beam.direction === "right") {
                beam.direction = "down";
            }
            beam.x = point.x;
            beam.y = point.y;
            queue.push(beam);
            continue;
        }

        if (nextCell.cell === "|") {
            if ((beam.direction === "up") || (beam.direction === "down")) {
                beam.x = point.x;
                beam.y = point.y;
                queue.push(beam);
                continue;
            }
            const upBeam: Beam = {
                x: point.x,
                y: point.y,
                direction: "up"
            };
            const downBeam: Beam = {
                x: point.x,
                y: point.y,
                direction: "down"
            };
            queue.push(upBeam);
            queue.push(downBeam);
            continue;
        }

        if (nextCell.cell === "-") {
            if ((beam.direction === "left") || (beam.direction === "right")) {
                beam.x = point.x;
                beam.y = point.y;
                queue.push(beam);
                continue;
            }
            const leftBeam: Beam = {
                x: point.x,
                y: point.y,
                direction: "left"
            };
            const rightBeam: Beam = {
                x: point.x,
                y: point.y,
                direction: "right"
            };
            queue.push(leftBeam);
            queue.push(rightBeam);
            continue;
        }

        throw Error(`Unknown cell ${nextCell.cell}`);
    }

    const energized = dataCells.sum((row) => row.filter(cell => cell.energized).length);
    return energized;
}

const partOne = (input: Cell[][], debug: boolean) => {
    const startBeam: Beam = {
        x: -1,
        y: 0,
        direction: "right",
    };

    const energized = getEnergizedCount(input, startBeam);
    return energized;
};

const partTwo = (input: Cell[][], debug: boolean) => {
    let max = Number.NEGATIVE_INFINITY;
    for (let y = 0; y < input.length; y++) {
        const leftBeam: Beam = {
            x: -1,
            y,
            direction: "right",
        };
        const leftEnergized = getEnergizedCount(input, leftBeam);

        const rightBeam: Beam = {
            x: input[y].length,
            y,
            direction: "left",
        };
        const rightEnergized = getEnergizedCount(input, rightBeam);

        if (leftEnergized > max) {
            //console.log(`Left beam at ${y} has ${leftEnergized} energized cells`)
            max = leftEnergized;
        }
        if (rightEnergized > max) {
            //console.log(`Right beam at ${y} has ${rightEnergized} energized cells`)
            max = rightEnergized;
        }
    }
    for (let x = 0; x < input[0].length; x++) {
        const upBeam: Beam = {
            x,
            y: -1,
            direction: "down",
        };
        const upEnergized = getEnergizedCount(input, upBeam);

        const downBeam: Beam = {
            x,
            y: input.length,
            direction: "up",
        };
        const downEnergized = getEnergizedCount(input, downBeam);

        if (upEnergized > max) {
            //console.log(`Up beam at ${x} has ${upEnergized} energized cells`)
            max = upEnergized;
        }
        if (downEnergized > max) {
            //console.log(`Down beam at ${x} has ${downEnergized} energized cells`)
            max = downEnergized;
        }
    }

    return max;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Cell[][]) => {
    console.log(input);
};

const test = (_: Cell[][]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Cell[][], number> = {
    day: 16,
    input: () => processInput(16),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
