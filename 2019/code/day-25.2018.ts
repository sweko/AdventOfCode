import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Point {
    x: number,
    y: number,
    z: number,
    w: number,
    value: string,
    constelation: number
}

const getDistance = (first: Point, second: Point) =>
    Math.abs(first.x - second.x) +
    Math.abs(first.y - second.y) +
    Math.abs(first.z - second.z) +
    Math.abs(first.w - second.w);

const processInput = async (day: number) => {
    const lineRegex = /^(-?\d+),(-?\d),(-?\d),(-?\d)$/;
    const lines = await readInputLines(day);
    return lines
        .map(line => line.match(lineRegex))
        .map(match => ({
            x: parseInt(match[1]),
            y: parseInt(match[2]),
            z: parseInt(match[3]),
            w: parseInt(match[4]),
            value: match[0],
            constelation: Number.POSITIVE_INFINITY
        }));
};

const partOne = (points: Point[], debug: boolean) => {
    let constelationId = 0;
    
    while (points.length > 0) {
        const first = points.shift();
        constelationId +=1;
        const marked = [first];

        while (marked.length > 0) {
            const point = marked.shift();
            point.constelation = constelationId;
            const neighbours = points.filter(p => getDistance(point, p) <= 3 && getDistance(point, p) !==0);
            marked.push(...neighbours);
            points = points.filter(p => p.value !== point.value);
        }
    }

    return constelationId;
};

const result = (_: any, result: number) => {
    return `Total number of constelations is ${result}`;
};

const showInput = (input: Point[]) => {
    console.log(input);
};

const test = (_: Point[]) => {
    console.log("----Test-----");
};

export const solution25_2018: Puzzle<Point[], number> = {
    day: 252018,
    input: processInput,
    partOne,
    resultOne: result,
    showInput,
    test,
}
