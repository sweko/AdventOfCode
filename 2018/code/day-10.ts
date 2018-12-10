import { readInput, readInputLines } from "../extra/aoc-helper";
import { performance } from "perf_hooks";
import "../extra/array-helpers";

interface Coordinate {
    top: number;
    left: number;
}

interface Rectangle extends Coordinate {
    right: number;
    bottom: number;
}

interface Point {
    position: Coordinate;
    velocity: Coordinate;
}


async function main() {
    const lines = await readInputLines();

    const startInput = performance.now();

    const points: Point[] = lines.map(line => {
        const match = line.match(/^position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>$/);
        return {
            position: {
                top: Number(match[2]),
                left: Number(match[1]),
            },
            velocity: {
                top: Number(match[4]),
                left: Number(match[3]),
            }
        }
    });

    const endInput = performance.now();
    console.log(`Running time for input is ${Math.round(endInput - startInput)}ms`);

    const startOne = performance.now();
    let metadataSum = processPartOne(points);
    const endOne = performance.now();

    console.log(`Part 1: total metadata sum is ${metadataSum}`);
    console.log(`Running time for part 1 is ${Math.round(endOne - startOne)}ms`);
    return;

    const startTwo = performance.now();
    let nodeValue = processPartTwo(rootNode);
    const endTwo = performance.now();

    console.log(`Part 2: total node value is ${nodeValue}`);
    console.log(`Running time for part 2 is ${Math.round(endTwo - startTwo)}ms`);
}


function toMatrix(points: Point[], print = false) {
    const rect = getBoundingRectangle(points);
    const area = (rect.left - rect.right) * (rect.top - rect.bottom);
    if (print) {
        for (let rindex = rect.top; rindex <= rect.bottom; rindex++) {
            let line = "";
            for (let cindex = rect.left; cindex <= rect.right; cindex++) {
                const hasPoint = points.find(p => p.position.top === rindex && p.position.left === cindex);
                line += hasPoint ? "#" : ".";
            }
            console.log(line);
        }
    }
    return area;
}

function tick(points: Point[]): Point[] {
    return points.map(point => ({
        velocity: point.velocity,
        position: {
            top: point.position.top + point.velocity.top,
            left: point.position.left + point.velocity.left
        }
    }));
}

function getBoundingRectangle(points: Point[]): Rectangle {
    return {
        top: points.min(point => point.position.top),
        bottom: points.max(point => point.position.top),
        left: points.min(point => point.position.left),
        right: points.max(point => point.position.left),
    }
}

function processPartOne(points: Point[]): number {
    let minArea = Number.POSITIVE_INFINITY;
    let minPoints = null;
    let mindex = -1;

    for (let index = 0; index < 20000; index++) {
        const boundArea = toMatrix(points);
        
        if (boundArea < minArea) {
            minArea = boundArea;
            minPoints = points;
            mindex = index;
            // console.log(`Current min area is ${minArea} on pass ${index}`);
        }
        
        points = tick(points);
    }

    toMatrix(minPoints, true);
    return mindex;
}

function processPartTwo(rootNode: Node): number {
    return getNodeValue(rootNode);
}


main();