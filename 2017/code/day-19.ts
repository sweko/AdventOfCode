import { readInput, readInputLines } from "../extra/aoc-helper";
import { terminal } from "terminal-kit";

enum Direction {
    Down = "down",
    Up = "up",
    Left = "left",
    Right = "right"
}

async function main() {
    const lines = await readInputLines();

    const maze = lines.map(line => processLine(line));

    let result = processPartOne(maze);
    console.log(`Part 1: Letter Sequence is ${result}`);
    let stepCount = processPartTwo(maze);
    console.log(`Part 2: total number of steps is ${stepCount}`);
}

function processLine(line: string): number[] {
    return line.split("").map(c => {
        if (c === " ") {
            return 0;
        };
        if (["-", "+", "|"].includes(c)) {
            return 1;
        };
        return c.charCodeAt(0);
    })
}

function processPartOne(maze: number[][]) {
    let row = 0;
    let column = maze[0].findIndex(c => !!c);
    let result = "";
    let direction = Direction.Down;
    while (true) {
        [row, column, direction] = getNext(maze, [row, column, direction]);
        if (!direction) {
            return result;
        }
        if (maze[row][column] !== 1) {
            result += String.fromCharCode(maze[row][column]);
        }
    }
}

function getNext(maze: number[][], point: [number, number, Direction]): [number, number, Direction] {
    let [row, column, direction] = point;
    if (direction === Direction.Down) {
        if (maze[row + 1][column]) {
            return [row + 1, column, Direction.Down];
        }
        if (maze[row][column - 1]) {
            return [row, column - 1, Direction.Left];
        }
        if (maze[row][column + 1]) {
            return [row, column + 1, Direction.Right];
        }
    }
    if (direction === Direction.Up) {
        if (maze[row - 1][column]) {
            return [row - 1, column, Direction.Up];
        }
        if (maze[row][column - 1]) {
            return [row, column - 1, Direction.Left];
        }
        if (maze[row][column + 1]) {
            return [row, column + 1, Direction.Right];
        }
    }
    if (direction === Direction.Left) {
        if (maze[row][column - 1]) {
            return [row, column - 1, Direction.Left];
        }
        if (maze[row - 1][column]) {
            return [row - 1, column, Direction.Up];
        }
        if (maze[row + 1][column]) {
            return [row + 1, column, Direction.Down];
        }
    }
    if (direction === Direction.Right) {
        if (maze[row][column + 1]) {
            return [row, column + 1, Direction.Right];
        }
        if (maze[row - 1][column]) {
            return [row - 1, column, Direction.Up];
        }
        if (maze[row + 1][column]) {
            return [row + 1, column, Direction.Down];
        }
    }
    return [null, null, null];
}

function processPartTwo(maze: number[][]) {
    let row = 0;
    let column = maze[0].findIndex(c => !!c);
    let result = 1;
    let direction = Direction.Down;
    while (true) {
        [row, column, direction] = getNext(maze, [row, column, direction]);
        if (!direction) {
            return result;
        }
        result += 1;
    }
}

main();