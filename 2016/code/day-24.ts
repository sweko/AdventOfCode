import { readInput, readInputLines } from "../extra/aoc-helper";
import { isNumber } from "util";
import { terminal } from "terminal-kit";

interface Cell {
    x: number,
    y: number;
    isWall: boolean;
    isSpecial: boolean;
    specialName?: number;
    specialDistances: number[];
}

class Maze extends Array<Cell[]> {

    unflooded: number[] = [];

    specials: Cell[] = [];

}

function floodCell(maze: Maze, index: number, x: number, y: number, value: number) {
    const cell = maze[x][y];
    if (cell.isWall)
        return;
    if (cell.specialDistances[index] === undefined) {
        cell.specialDistances[index] = value;
        maze.unflooded[index] -= 1;
    }
}

function floodNeighbours(maze: Maze, index: number, x: number, y: number, value: number) {
    floodCell(maze, index, x - 1, y, value);
    floodCell(maze, index, x + 1, y, value);
    floodCell(maze, index, x, y + 1, value);
    floodCell(maze, index, x, y - 1, value);
}

function flood(maze: Maze, index: number) {
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            const element = maze[i][j];
            if (element.specialDistances[index] !== undefined) {
                floodNeighbours(maze, index, i, j, element.specialDistances[index] + 1);
            }
        }
    }
    return maze.unflooded[index];
}

async function main() {

    let lines = (await readInputLines()).map(line => line.split(""));

    let minPath = processPartOne(lines);
    console.log(`Part 1: minimal path to all cells is ${minPath}`);

    minPath = processPartTwo(lines);
    console.log(`Part 2: minimal path with return is ${minPath}`);
}

function getMaze(lines: string[][]): Maze {
    const result: Maze = new Maze();
    let openCount = 0;
    for (let i = 0; i < lines.length; i++) {
        result.push([])
        for (let j = 0; j < lines[i].length; j++) {
            const item: Cell = {
                x: i,
                y: j,
                isWall: lines[i][j] === "#",
                isSpecial: lines[i][j] !== "#" && lines[i][j] !== ".",
                specialDistances: []
            };
            result[i].push(item);

            if (item.isSpecial) {
                item.specialName = parseInt(lines[i][j]);
                item.specialDistances[item.specialName] = 0;
                result.specials.push(item);
            }
            if (!item.isWall) {
                openCount += 1;
            }
        }
    }
    result.specials.sort((a, b) => a.specialName - b.specialName);
    result.unflooded = new Array(result.specials.length).fill(openCount - 1);
    return result;
}

function getPermutations<T>(input: T[]): T[][] {
    if (input.length < 2)
        return [input];

    return [].concat(...input.map((char, index) => getPermutations([...input.slice(0, index), ...input.slice(index + 1)]).map(perm => [char].concat(perm))));
}

function processPartOne(lines: string[][]) {
    const maze = getMaze(lines);

    let floodcount = 0;
    maze.specials.forEach(element => {
        let unflooded = - 1;
        while (unflooded !== maze.unflooded[element.specialName]) {
            unflooded = maze.unflooded[element.specialName];
            flood(maze, element.specialName);
            floodcount++;
        }
    });

    let shortPath = Infinity;
    getPermutations([1, 2, 3, 4, 5, 6, 7]).forEach(perm => {
        let pathLength = 0;
        let lastIndex = 0;
        for (let index = 0; index < perm.length; index++) {
            pathLength += maze.specials[lastIndex].specialDistances[perm[index]];
            lastIndex = perm[index];
        }
        if (pathLength < shortPath) {
            shortPath = pathLength;
        }
    });
    return shortPath;
}

function processPartTwo(lines: string[][]) {
    const maze = getMaze(lines);

    let floodcount = 0;
    maze.specials.forEach(element => {
        let unflooded = - 1;
        while (unflooded !== maze.unflooded[element.specialName]) {
            unflooded = maze.unflooded[element.specialName];
            flood(maze, element.specialName);
            floodcount++;
        }
    });

    let shortPath = Infinity;
    getPermutations([1, 2, 3, 4, 5, 6, 7]).forEach(perm => {
        let pathLength = 0;
        let lastIndex = 0;
        for (let index = 0; index < perm.length; index++) {
            pathLength += maze.specials[lastIndex].specialDistances[perm[index]];
            lastIndex = perm[index];
        }
        pathLength += maze.specials[lastIndex].specialDistances[0];
        
        if (pathLength < shortPath) {
            shortPath = pathLength;
        }
    });
    return shortPath;
}

main();