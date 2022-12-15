import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { printMatrix } from "../extra/terminal-helper";
import { Puzzle } from "./model";

type Point = { x: number, y: number };
type Edge = { from: Point, to: Point };

const cornerToPoint = (corner: string) => {
    const parts = corner.split(",");
    return { x: parseInt(parts[0]), y: parseInt(parts[1]) };
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const edges = lines.flatMap(line => {
        const corners = line.split(" -> ").map(cornerToPoint);
        const result: Edge[] = [];
        for (let index = 1; index < corners.length; index++) {
            const from = corners[index-1];
            const to = corners[index];
            result.push({ from, to });
        }
        return result;
    })
    
    return edges;
};

enum Tile {
    Air = 0,
    Rock = 1,
    Sand = 2,
    Source = 100
}


const partOne = (input: Edge[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const minx = input.map(edge => Math.min(edge.from.x, edge.to.x)).min()-1;
    const miny = 0; // input.map(edge => Math.min(edge.from.y, edge.to.y)).min()-1;

    const moved = input.map(edge => ({
        from: {x : edge.from.x - minx, y: edge.from.y - miny},
        to: {x : edge.to.x - minx, y: edge.to.y - miny}
    }))

    // air = 0, rock = 1, sand = 2, source = 100;

    // 500, 0

    const maxx = moved.map(edge => Math.max(edge.from.x, edge.to.x)).max();
    const maxy = moved.map(edge => Math.max(edge.from.y, edge.to.y)).max();

    const matrix = Array.from({length: maxy + 1}, () => Array.from({length: maxx + 2}, () => 0));

    for (const edge of moved) {
        for (let xindex = edge.from.x; xindex <= edge.to.x; xindex++) {
            for (let yindex = edge.from.y; yindex <= edge.to.y; yindex++) {
                matrix[yindex][xindex] = Tile.Rock;
            }
            for (let yindex = edge.to.y; yindex <= edge.from.y; yindex++) {
                matrix[yindex][xindex] = Tile.Rock;
            }
        }
        for (let xindex = edge.to.x; xindex <= edge.from.x; xindex++) {
            for (let yindex = edge.from.y; yindex <= edge.to.y; yindex++) {
                matrix[yindex][xindex] = Tile.Rock;
            }
            for (let yindex = edge.to.y; yindex <= edge.from.y; yindex++) {
                matrix[yindex][xindex] = Tile.Rock;
            }
        }
    }
    const origin = { x: 500 - minx, y: 0 };
    matrix[origin.y][origin.x] = Tile.Source;

    let counter = 0;
    while (true) {
        counter += 1;
        const sandPosition = { ...origin };
        let atRest = false;
        while (!atRest) {
            if (sandPosition.x === 0 || sandPosition.x === matrix[0].length-1 || sandPosition.y === matrix.length-1) {
                matrix[sandPosition.y][sandPosition.x] = Tile.Sand;
                //printMatrix(matrix, (value) => value === 0 ? "." : value === 1 ? "#" : value === 2 ? "o" : "+");
                return counter-1;
            }
            if (matrix[sandPosition.y+1][sandPosition.x] === Tile.Air) {
                sandPosition.y += 1;
            } else if (matrix[sandPosition.y+1][sandPosition.x-1] === Tile.Air) {
                sandPosition.y += 1;
                sandPosition.x -= 1;
            } else if (matrix[sandPosition.y+1][sandPosition.x+1] === Tile.Air) {
                sandPosition.y += 1;
                sandPosition.x += 1;
            } else {
                //at rest
                atRest = true;
                matrix[sandPosition.y][sandPosition.x] = Tile.Sand;
            }
        }
    }
};

const partTwo = (input: Edge[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const maxy = input.map(edge => Math.max(edge.from.y, edge.to.y)).max()+2;
    const minx = 500-maxy-5; // the 5 is a guess

    const moved = input.map(edge => ({
        from: {x : edge.from.x - minx, y: edge.from.y},
        to: {x : edge.to.x - minx, y: edge.to.y}
    }))


    // air = 0, rock = 1, sand = 2, source = 100;

    const maxx = moved.map(edge => Math.max(edge.from.x, edge.to.x)).max()+maxy;
    moved.push({from: {x: 0, y: maxy}, to: {x: maxx, y: maxy}});

    const matrix = Array.from({length: maxy + 1}, () => Array.from({length: maxx + 1}, () => 0));

    for (const edge of moved) {
        for (let xindex = edge.from.x; xindex <= edge.to.x; xindex++) {
            for (let yindex = edge.from.y; yindex <= edge.to.y; yindex++) {
                matrix[yindex][xindex] = Tile.Rock;
            }
            for (let yindex = edge.to.y; yindex <= edge.from.y; yindex++) {
                matrix[yindex][xindex] = Tile.Rock;
            }
        }
        for (let xindex = edge.to.x; xindex <= edge.from.x; xindex++) {
            for (let yindex = edge.from.y; yindex <= edge.to.y; yindex++) {
                matrix[yindex][xindex] = Tile.Rock;
            }
            for (let yindex = edge.to.y; yindex <= edge.from.y; yindex++) {
                matrix[yindex][xindex] = Tile.Rock;
            }
        }
    }
    const origin = { x: 500 - minx, y: 0 };
    matrix[origin.y][origin.x] = Tile.Source;

    let counter = 0;
    while (matrix[origin.y][origin.x] === Tile.Source) {
        counter += 1;
        const sandPosition = { ...origin };
        let atRest = false;
        while (!atRest) {
            if (matrix[sandPosition.y+1][sandPosition.x] === Tile.Air) {
                sandPosition.y += 1;
            } else if (matrix[sandPosition.y+1][sandPosition.x-1] === Tile.Air) {
                sandPosition.y += 1;
                sandPosition.x -= 1;
            } else if (matrix[sandPosition.y+1][sandPosition.x+1] === Tile.Air) {
                sandPosition.y += 1;
                sandPosition.x += 1;
            } else {
                //at rest
                atRest = true;
                matrix[sandPosition.y][sandPosition.x] = Tile.Sand;
            }
        }
    }

    //printMatrix(matrix, (value) => value === 0 ? "." : value === 1 ? "#" : value === 2 ? "o" : "+");

    return counter;
};

const resultOne = (_: Edge[], result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: Edge[], result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Edge[]) => {
    console.log(input);
};

const test = (_: Edge[]) => {
    console.log("----Test-----");
};

export const solutionFourteen: Puzzle<Edge[], number> = {
    day: 14,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}

