import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { printMatrix } from "../extra/terminal-helper";
import { Puzzle } from "./model";

type ElfMap = (0 | 1)[][];

type Coordinate = { x: number, y: number };

type WorldSides = "north" | "south" | "east" | "west" | "north-east" | "north-west" | "south-east" | "south-west";

type North = "north" | "north-east" | "north-west";
type South = "south" | "south-east" | "south-west";
type East = "east" | "north-east" | "south-east";
type West = "west" | "north-west" | "south-west";

type Direction = "north" | "south" | "east" | "west";

type Neighbours = {
    [key in WorldSides]: Coordinate;
};

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    return lines.map(line => line.split("").map(c => c === "#" ? 1 : 0));
};

const isEmpty = (input: ElfMap, { x, y }: Coordinate) => {
    return input[x][y] === 0;
}

const isDirectionEmpty = (input: ElfMap, neighbours: Neighbours, direction: Direction) => {
    switch (direction) {
        case "north":
            return isEmpty(input, neighbours["north"]) && isEmpty(input, neighbours["north-east"]) && isEmpty(input, neighbours["north-west"]);
        case "south":
            return isEmpty(input, neighbours["south"]) && isEmpty(input, neighbours["south-east"]) && isEmpty(input, neighbours["south-west"]);
        case "east":
            return isEmpty(input, neighbours["east"]) && isEmpty(input, neighbours["north-east"]) && isEmpty(input, neighbours["south-east"]);
        case "west":
            return isEmpty(input, neighbours["west"]) && isEmpty(input, neighbours["north-west"]) && isEmpty(input, neighbours["south-west"]);
    }
}

type NextDirection = (elfMap: ElfMap, neighbours: Neighbours, coordinate: Coordinate) => Coordinate | undefined;

const getNextFunction = (direction: Direction, transform: (coordinate: Coordinate) => Coordinate): NextDirection => (elfMap, neighbours, coordinate) => {
    if (isDirectionEmpty(elfMap, neighbours, direction)) {
        const next = transform(coordinate);
        return next;
    }
    return undefined;
}

const nextNorth = getNextFunction("north", ({x, y}) => ({x: x - 1, y}));
const nextSouth = getNextFunction("south", ({x, y}) => ({x: x + 1, y}));
const nextEast = getNextFunction("east", ({x, y}) => ({x, y: y + 1}));
const nextWest = getNextFunction("west", ({x, y}) => ({x, y: y - 1}));

const getNeighbours = ({ x, y }: Coordinate): Neighbours => ({
    "north-west": { x: x - 1, y: y - 1 },
    "north": { x: x - 1, y },
    "north-east": { x: x - 1, y: y + 1 },
    "west": { x, y: y - 1 },
    "east": { x, y: y + 1 },
    "south-west": { x: x + 1, y: y - 1 },
    "south": { x: x + 1, y },
    "south-east": { x: x + 1, y: y + 1 },
});


const partOne = (input: ElfMap, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let elves: Coordinate[] = [];
    for (let x = 0; x < input.length; x++) {
        for (let y = 0; y < input[x].length; y++) {
            if (input[x][y] === 1) {
                elves.push({ x: x+1, y: y+1 });
            }
        }
    }

    const directions = [nextNorth, nextSouth, nextWest, nextEast];
    let dirIndex = 0;

    let round = 0;
    const limit = 10;
    while (round++ < limit) {
        const maxx = Math.max(...elves.map(e => e.x));
        const maxy = Math.max(...elves.map(e => e.y));

        const elfMap = Array(maxx + 2).fill(0).map(() => Array(maxy + 2).fill(0));

        for (const { x, y } of elves) {
            elfMap[x][y] = 1;
        }

        let nextElves = [];

        for (const elf of elves) {
            const neighbours: Neighbours = getNeighbours(elf);

            const fullNeighbours = Object.values(neighbours).filter(n => elfMap[n.x][n.y] === 1).length;

            if (fullNeighbours === 0) {
                nextElves.push(elf);
                continue;
            }

            const nextFunctions = [
                 directions[dirIndex % directions.length],
                 directions[(dirIndex + 1) % directions.length],
                 directions[(dirIndex + 2) % directions.length],
                 directions[(dirIndex + 3) % directions.length]
            ]

            const nextElf = nextFunctions.reduce((acc, next) => {
                if (acc) {
                    return acc;
                }
                return next(elfMap, neighbours, elf);
            }, undefined) as Coordinate | undefined;

            nextElves.push(nextElf || elf);
        }

        const nextElfDuplicates = new Map<string, number[]>();

        for (let index = 0; index < nextElves.length; index++) {
            const { x, y } = nextElves[index];
            const key = `${x},${y}`;
            if (nextElfDuplicates.has(key)) {
                nextElfDuplicates.get(key).push(index);
            } else {
                nextElfDuplicates.set(key, [index]);
            }
        }

        for (const [_, value] of nextElfDuplicates) {
            if (value.length > 1) {
                for (let index = 0; index < value.length; index++) {
                    const elfIndex = value[index];
                    nextElves[elfIndex] = elves[elfIndex];
                }
            }
        }

        const minx = Math.min(...nextElves.map(e => e.x));
        const miny = Math.min(...nextElves.map(e => e.y));

        const movex = 1 - minx;
        const movey = 1 - miny;

        elves = nextElves.map(({ x, y }) => ({ x: x + movex, y: y + movey }));
        dirIndex += 1;
    }

    const maxx = Math.max(...elves.map(e => e.x));
    const maxy = Math.max(...elves.map(e => e.y));
    const area = maxx * maxy;
    const result = area - elves.length;

    return result;
};

const partTwo = (input: ElfMap, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let elves: Coordinate[] = [];
    for (let x = 0; x < input.length; x++) {
        for (let y = 0; y < input[x].length; y++) {
            if (input[x][y] === 1) {
                elves.push({ x: x+1, y: y+1 });
            }
        }
    }

    const directions = [nextNorth, nextSouth, nextWest, nextEast];
    let dirIndex = 0;

    let round = 0;
    let moving = true;
    while (moving) {
        round += 1;
        moving = false;
        const maxx = Math.max(...elves.map(e => e.x));
        const maxy = Math.max(...elves.map(e => e.y));

        const elfMap = Array(maxx + 2).fill(0).map(() => Array(maxy + 2).fill(0));
        //console.log(maxx+2, maxy+2);

        for (const { x, y } of elves) {
            elfMap[x][y] = 1;
        }

        let nextElves = [];

        for (const elf of elves) {
            const neighbours: Neighbours = getNeighbours(elf);

            const fullNeighbours = Object.values(neighbours).filter(n => elfMap[n.x][n.y] === 1).length;

            if (fullNeighbours === 0) {
                nextElves.push(elf);
                continue;
            }

            const nextFunctions = [
                 directions[dirIndex % directions.length],
                 directions[(dirIndex + 1) % directions.length],
                 directions[(dirIndex + 2) % directions.length],
                 directions[(dirIndex + 3) % directions.length]
            ]

            const nextElf = nextFunctions.reduce((acc, next) => {
                if (acc) {
                    return acc;
                }
                return next(elfMap, neighbours, elf);
            }, undefined) as Coordinate | undefined;

            if (nextElf) {
                moving = true;
            }

            nextElves.push(nextElf || elf);
        }

        const nextElfDuplicates = new Map<string, number[]>();

        for (let index = 0; index < nextElves.length; index++) {
            const { x, y } = nextElves[index];
            const key = `${x},${y}`;
            if (nextElfDuplicates.has(key)) {
                nextElfDuplicates.get(key).push(index);
            } else {
                nextElfDuplicates.set(key, [index]);
            }
        }

        for (const [_, value] of nextElfDuplicates) {
            if (value.length > 1) {
                for (let index = 0; index < value.length; index++) {
                    const elfIndex = value[index];
                    nextElves[elfIndex] = elves[elfIndex];
                }
            }
        }

        const minx = Math.min(...nextElves.map(e => e.x));
        const miny = Math.min(...nextElves.map(e => e.y));

        const movex = 1 - minx;
        const movey = 1 - miny;

        elves = nextElves.map(({ x, y }) => ({ x: x + movex, y: y + movey }));
        dirIndex += 1;
    }

    return round;
};

const resultOne = (_: ElfMap, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: ElfMap, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: ElfMap) => {
    console.log(input);
};

const test = (_: ElfMap) => {
    console.log("----Test-----");
};

export const solutionTwentyThree: Puzzle<ElfMap, number> = {
    day: 23,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}


