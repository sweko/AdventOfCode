import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Point {
    x: number;
    y: number;
    z: number;
}

const toPoint = (key: string) => {
    const coordinates = key.split(",").map(part => parseInt(part, 10));
    return { x: coordinates[0], y: coordinates[1], z: coordinates[2] };
};

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    return lines.map(line => toPoint(line));
};

const toKey = (point: Point) => `${point.x},${point.y},${point.z}`;



const partOne = (input: Point[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const droplets = new Map<string, { sides: number }>();
    for (const droplet of input) {
        droplets.set(toKey(droplet), { sides: 6} );
    }

    for (let i = 0; i < input.length; i++) {
        const first = input[i];
        const firstSides = droplets.get(toKey(first));
        for (let j = i + 1; j < input.length; j++) {
            const second = input[j];
            const distance = Math.abs(first.x - second.x) + Math.abs(first.y - second.y) + Math.abs(first.z - second.z);
            if (distance === 1) {
                const secondSides = droplets.get(toKey(second));
                firstSides.sides -= 1;
                secondSides.sides -= 1;
            }
        }
    }

    return [...droplets.values()].sum(droplet => droplet.sides);
};

const partTwo = (input: Point[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    return 0;
};

const resultOne = (_: Point[], result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: Point[], result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Point[]) => {
    console.log(input);
};

const test = (_: Point[]) => {
    console.log("----Test-----");
};

export const solutionEighteen: Puzzle<Point[], number> = {
    day: 18,
    input: processInput,
    partOne,
    //partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
