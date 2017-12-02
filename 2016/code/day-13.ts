import { readInput, readInputLines } from "../extra/aoc-helper";
import { isNumber } from "util";

const offset = 1350;

type Maze = (number | boolean)[][];

async function main() {

    let minPath = processPartOne();
    console.log(`Part 1: minimal path to cell is ${minPath}`);

    let countCells = processPartTwo();
    console.log(`Part 2: cells reachable in 50 steps are ${countCells}`);
}

function isWall(x: number, y: number) {
    const base = x * x + 3 * x + 2 * x * y + y + y * y;
    const number = base + offset;
    return number.toString(2).split("").filter(c => c === "1").length % 2 === 1;
}

function generateMaze(width: number, height: number): Maze {
    const result = [];
    for (let i = 0; i < width; i++) {
        result.push([])
        for (let j = 0; j < height; j++) {
            result[i].push(isWall(j, i));
        }
    }
    return result;
}

function printMaze(maze: Maze) {
    for (let i = 0; i < maze.length; i++) {
        let line = "";
        for (let j = 0; j < maze[i].length; j++) {
            let char = "!";
            if (maze[i][j] === true)
                char = "#";
            else if (maze[i][j] === false)
                char = ".";
            else if (isNumber(maze[i][j]))
                char = (<number>maze[i][j]).toString(36);
            line += char;
        }
        console.log(line);
    }
    console.log();
}

function checkCells(maze) {
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (maze[i][j] === true)
                continue;
            let minNeighbour = isNumber(maze[i][j]) ? maze[i][j] - 1 : Infinity;
            if (isNumber(maze[i][j - 1]))
                minNeighbour = Math.min(minNeighbour, maze[i][j - 1]);
            if (isNumber(maze[i][j + 1]))
                minNeighbour = Math.min(minNeighbour, maze[i][j + 1]);
            if (i !== 0) {
                if (isNumber(maze[i - 1][j]))
                    minNeighbour = Math.min(minNeighbour, maze[i - 1][j]);
            }
            if (i !== maze.length - 1) {
                if (isNumber(maze[i + 1][j]))
                    minNeighbour = Math.min(minNeighbour, maze[i + 1][j]);
            }
            if (minNeighbour !== Infinity)
                maze[i][j] = minNeighbour + 1;
        }
    }
    return maze;
}

function processPartOne() {
    let maze = generateMaze(200, 200);
    maze[1][1] = 0;
    while (maze[39][31] === false){
        maze = checkCells(maze)
    }
    return maze[39][31]
}

function countMaze(maze: Maze, max: number) {
    let count = 0;
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (isNumber(maze[i][j])){
                if (maze[i][j] <= 50)
                    count++;
            }
        }
    }
    return count;
}

function processPartTwo() {
    let maze = generateMaze(50, 50);
    maze[1][1] = 0;
    for(let i=0; i<50; i++)
        maze = checkCells(maze)
    return countMaze(maze, 50);
}

main();