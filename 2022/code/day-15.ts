import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { printMatrix } from "../extra/terminal-helper";
import { Puzzle } from "./model";

interface Point {
    x: number;
    y: number;
}

interface Sensor {
    location: Point;
    beacon: Point;
}


const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const input = lines.map(line => {
        const match = line.match(/^Sensor at x=(\d+), y=(\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/);
        return {
            location : { x: parseInt(match[1]), y: parseInt(match[2]) },
            beacon : { x: parseInt(match[3]), y: parseInt(match[4]) }
        }
    });
    return input;
};

const partOne = (input: Sensor[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const targetRow = 10;

    const covereds = new Set<number>();
    for (const sensor of input) {
        const radius = Math.abs(sensor.location.x - sensor.beacon.x) + Math.abs(sensor.location.y - sensor.beacon.y);
        if ((sensor.location.y + radius < targetRow) || (sensor.location.y - radius > targetRow)) {
            continue;
        }
        const rowDistance = Math.abs(sensor.location.y - targetRow);
        const reach = radius - rowDistance;

        for (let index = sensor.location.x - reach; index <= sensor.location.x + reach; index++) {
            covereds.add(index);
        }
    }
    for (const sensor of input) {
        if ((sensor.beacon.y === targetRow) && (covereds.has(sensor.beacon.x))) {
            covereds.delete(sensor.beacon.x);
        }
    }

    return covereds.size;
};


type Chunk = { start: number, end: number };

const partTwo = (input: Sensor[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const gridSize = 4_000_000;

    const chunkMap: Chunk[][] = Array.from({ length: gridSize + 1 }, () => []);

    for (const sensor of input) {
        const radius = Math.abs(sensor.location.x - sensor.beacon.x) + Math.abs(sensor.location.y - sensor.beacon.y);
        for (let y = sensor.location.y - radius; y <= sensor.location.y + radius; y++) {
            if (y < 0 || y > gridSize) {
                continue;
            }
            const rowDistance = Math.abs(sensor.location.y - y);
            const reach = radius - rowDistance;
            const chunk: Chunk = { 
                start: Math.max(0, sensor.location.x - reach), 
                end: Math.min(gridSize, sensor.location.x + reach)
            };
            chunkMap[y].push(chunk);
        }
        console.log(`Finished sensor at ${sensor.location.x},${sensor.location.y}`);
    }

    for (let yindex = 0; yindex < chunkMap.length; yindex++) {
        const chunks = chunkMap[yindex];
        chunks.sort((a, b) => a.start - b.start);
        const xindex = 0;
        while (xindex < chunks.length-1) {
            const first = chunks[xindex];
            const second = chunks[xindex + 1];
            if (first.end >= second.start) {
                first.end = Math.max(first.end, second.end);
                chunks.splice(xindex + 1, 1);
            } else {
                console.log(`Found gap at ${first.end},${second.start} on row ${yindex}`);
                return (first.end + 1) * 4_000_000 + yindex;
            }
        }
    }

    return -1;
};

const resultOne = (_: Sensor[], result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: Sensor[], result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Sensor[]) => {
    console.log(input); 
};

const test = (_: Sensor[]) => {
    console.log("----Test-----");
};

export const solutionFifteen: Puzzle<Sensor[], number> = {
    day: 15,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
