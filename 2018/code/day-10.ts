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
    let tickCount = process(points);
    const endOne = performance.now();

    console.log(`Part 1: (see console)`);
    console.log(`Part 2: required number of ticks is ${tickCount}`);
    console.log(`Running time for processing is ${Math.round(endOne - startOne)}ms`);
    return;

}

function getArea(rect: Rectangle) {
    const area = (rect.left - rect.right) * (rect.top - rect.bottom);
    return area;
}

function toMatrix(points: Point[]) {
    const rect = getBoundingRectangle(points);
    for (let rindex = rect.top; rindex <= rect.bottom; rindex++) {
        let line = "";
        for (let cindex = rect.left; cindex <= rect.right; cindex++) {
            const hasPoint = points.find(p => p.position.top === rindex && p.position.left === cindex);
            line += hasPoint ? "#" : ".";
        }
        console.log(line);
    }
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

function untick(points: Point[]): Point[] {
    return points.map(point => ({
        velocity: point.velocity,
        position: {
            top: point.position.top - point.velocity.top,
            left: point.position.left - point.velocity.left
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

function process(points: Point[]): number {
    let area = Number.POSITIVE_INFINITY;
    let index = 0;

    while (true) {
        const oldArea = area;
        points = tick(points);
        area = getArea(getBoundingRectangle(points));
        if (area > oldArea) {
            points = untick(points);
            toMatrix(points);
            return index;
        }
        index++;
    }
}


main();