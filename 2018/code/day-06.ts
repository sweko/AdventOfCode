import { readInputLines, loopMatrix } from "../extra/aoc-helper";
import { performance } from "perf_hooks";
import "../extra/array-helpers";

interface Point {
    x: number,
    y: number,
    index: number;
    isInfinite: boolean;
    countPoints: number;
}

async function main() {
    const lines = await readInputLines();

    const points = lines.map((line, index) => {
        const lineItems = line.split(",").map(item => Number(item));
        return {
            x: lineItems[1],
            y: lineItems[0],
            index: index + 1,
            isInfinite: false,
            countPoints: 0
        };
    })

    const startOne = performance.now();
    let finiteArea = processPartOne(points);
    const endOne = performance.now();

    console.log(`Part 1: Maximum finite area is ${finiteArea} units`);
    console.log(`Running time for part 1 is ${Math.round(endOne - startOne)}ms`);

    const startTwo = performance.now();
    let safeArea = processPartTwo(points);
    const endTwo = performance.now();

    console.log(`Part 2: Safe area contains ${safeArea} units`);
    console.log(`Running time for part 2 is ${Math.round(endTwo - startTwo)}ms`);
}

function makeFrame(points: Point[]) {
    const maxX = points.reduce((max, point) => point.x > max ? point.x : max, Number.NEGATIVE_INFINITY);
    const maxY = points.reduce((max, point) => point.y > max ? point.y : max, Number.NEGATIVE_INFINITY);
    const frame = Array(maxX + 2).fill(0).map(row => Array(maxY + 2).fill(0));
    for (const point of points) {
        frame[point.x][point.y] = String.fromCharCode("A".charCodeAt(0) + point.index - 1);
    }
    return frame;
}

function processPartOne(points: Point[]): number {
    const frame = makeFrame(points);

    loopMatrix(frame, (row, column) => {
        const distances = points
            .map(point => ({
                distance: Math.abs(row - point.x) + Math.abs(column - point.y),
                index: point.index
            }))
            .groupBy(item => item.distance)
            .sort((f, s) => f.key - s.key);

        const minDistance = distances[0];

        if (minDistance.items.length !== 1) {
            return;
        }

        const minPoint = points.find(point => point.index === minDistance.items[0].index);

        if ((row === 0) || (column === 0) || (row === frame.length - 1) || (column === frame[0].length - 1)) {
            minPoint.isInfinite = true;
        }
        minPoint.countPoints += 1;
    });

    return points
        .filter(point => !point.isInfinite)
        .reduce((max, point) => max > point.countPoints ? max : point.countPoints, Number.NEGATIVE_INFINITY)
}


function processPartTwo(points: Point[]): number {
    const frame = makeFrame(points);

    const cutoff = 10000;
    let count = 0;

    loopMatrix(frame, (row, column) => {
        const totalDistance = points
            .map(point => Math.abs(row - point.x) + Math.abs(column - point.y))
            .sum();

        if (totalDistance < cutoff) {
            count ++;
        }
    });

    return count;
}

main();