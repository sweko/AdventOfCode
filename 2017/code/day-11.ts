import { readInput, readInputLines } from "../extra/aoc-helper";
import { listenerCount } from "cluster";

async function main() {
    let input = await readInput();

    let directions = input.split(",");

    let distance = processPartOne(directions);
    console.log(`Part 1: total distance = ${distance}`);

    // distance = processPartTwo(directions);
    // console.log(`Part 2: furthest distance = ${distance}`);

}

function processPartOne(directions: string[]) {
    return getDistance(directions);
}

function getDistance(directions: string[]) {
    const groups = { sw: 0, s: 0, se: 0, nw: 0, n: 0, ne: 0 };
    directions.forEach(d => groups[d] += 1);
    const diffs = {
        southwest: groups["sw"] - groups["ne"],
        south: groups["s"] - groups["n"],
        southeast: groups["se"] - groups["nw"],
        northeast: groups["ne"] - groups["sw"],
        north: groups["n"] - groups["s"],
        northwest: groups["nw"] - groups["se"],
    };
    console.log(diffs);

    if (diffs.southwest >= 0) {
        if (diffs.south >= 0) {
            if (diffs.southeast >= 0) {
                // southwest, south, southeast
                return diffs.south + Math.max(diffs.southwest, diffs.southeast);
            } else {
                // southwest, south, northwest
                return diffs.southwest + Math.max(diffs.south, diffs.northwest);
            }
        } else {
            if (diffs.southeast >= 0) {
                // southwest, north, southeast
                const min = Math.min(diffs.southwest, diffs.north, diffs.southeast);
                return Math.max(diffs.southwest - min, diffs.north - min, diffs.southeast - min);
            } else {
                // southwest, north, northwest
                return diffs.northwest + Math.max(diffs.north, diffs.southwest);
            }
        }
    } else {
        if (diffs.south >= 0) {
            if (diffs.southeast >= 0) {
                // northeast, south, southeast
                return diffs.southeast + Math.max(diffs.northeast, diffs.south);
            } else {
                // northeast, south, northwest
                const min = Math.min(diffs.northeast, diffs.south, diffs.northwest);
                return Math.max(diffs.northeast - min, diffs.south - min, diffs.northwest - min);
            }
        } else {
            if (diffs.southeast >= 0) {
                // northeast, north, southeast
                return diffs.northeast + Math.max(diffs.north, diffs.southeast);
            } else {
                // northeast, north, northwest
                return diffs.north + Math.max(diffs.northwest, diffs.northeast);
            }
        }
    }
}

function processPartTwo(directions: string[]) {
    return Array(directions.length)
        .fill(null)
        .map((_, i) => getDistance(directions.slice(0, i + 1)))
        .reduce((a, b) => Math.max(a, b));
}


main();