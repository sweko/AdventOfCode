// Solution for day 15 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";

type Cell = '#' | '.' | 'O' | '@';
type Directions = '^' | 'v' | '<' | '>';

type Input = {
    warehouse: Cell[][];
    directions: Directions[];
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    let line = lines.shift()!;
    const warehouse: Cell[][] = [];
    while (line !== "") {
        warehouse.push(line.split('') as Cell[]);
        line = lines.shift()!;
    }
    const directions = lines.flatMap(line => line.split('') as Directions[]);
    return { warehouse, directions };
};

const moves = {
    "^": { x: 0, y: -1 },
    "v": { x: 0, y: 1 },
    "<": { x: -1, y: 0 },
    ">": { x: 1, y: 0 },
}

const findRobot = (warehouse: Cell[][], direction: Directions) => {
    for (let y = 0; y < warehouse.length; y++) {
        for (let x = 0; x < warehouse[y].length; x++) {
            if (warehouse[y][x] === '@') {
                return { x, y };
            }
        }
    }
    throw new Error("Robot not found");
};

const updateWarehouse = (warehouse: Cell[][], direction: Directions) => {
    const result = warehouse.map(row => row.slice());
    const move = moves[direction];

    //find robot
    const robot = findRobot(result, direction);

    const updated = { x: robot.x + move.x, y: robot.y + move.y };
    const current = result[updated.y][updated.x];

    if (current === '.') {
        result[robot.y][robot.x] = '.';
        result[updated.y][updated.x] = '@';
    } else if (current === '#') {
        // do nothing
    } else if (current === '@') {
        throw new Error("Something went horribly wrong");
    } else {
        let next = { ...updated };
        let nextCell = result[next.y][next.x];
        while (nextCell === 'O') {
            next = { x: next.x + move.x, y: next.y + move.y };
            nextCell = result[next.y][next.x];
        }
        // next cell is either empty or wall
        if (nextCell === '#') {
            // do nothing
        } else if (nextCell === '.') {
            result[robot.y][robot.x] = '.';
            result[updated.y][updated.x] = '@';
            result[next.y][next.x] = 'O';
        } else {
            throw new Error("Something else went horribly wrong");
        }
    }



    return result;
};

const partOne = (input: Input, debug: boolean) => {
    let warehouse = input.warehouse.map(row => row.slice());
    const directions = input.directions.slice();

    for (const direction of directions) {
        warehouse = updateWarehouse(warehouse, direction);
    }

    let sum = 0;
    for (let y = 0; y < warehouse.length; y++) {
        for (let x = 0; x < warehouse[y].length; x++) {
            if (warehouse[y][x] === 'O') {
                sum += 100 * y + x;
            }
        }
    }

    return sum;
};

const partTwo = (input: Input, debug: boolean) => {
    return -1;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Input) => {
    console.log(input);
};

const test = (_: Input) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Input, number> = {
    day: 15,
    input: () => processInput(15),
    partOne,
    //partTwo,
    resultOne: resultOne,
    //resultTwo: resultTwo,
    showInput,
    test,
}