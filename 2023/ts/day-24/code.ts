// Solution for day 24 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

interface Point {
    x: number;
    y: number;
    z: number;
}

interface Particle {
    position: Point;
    velocity: Point;
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const lineRegex = /^(\d+),\s+(\d+),\s+(\d+)\s+@\s+(-?\d+),\s+(-?\d+),\s+(-?\d+)$/;
    const particles = lines.map(line => {
        const match = line.match(lineRegex);
        if (match) {
            const [_, px, py, pz, vx, vy, vz] = match;
            return {
                position: {
                    x: parseInt(px, 10),
                    y: parseInt(py, 10),
                    z: parseInt(pz, 10)
                },
                velocity: {
                    x: parseInt(vx, 10),
                    y: parseInt(vy, 10),
                    z: parseInt(vz, 10)
                }
            }
        }
        throw Error(`Invalid input line ${line}`);
    });
    return particles;
};

const getLineParameters = (particle: Particle) => {
    // k = vy / vx
    // m = (py - px*vy/vx) 
    const k = particle.velocity.y / particle.velocity.x;
    const m = particle.position.y - particle.position.x * k;
    return {
        slope: k,
        intercept: m,
        isFuture: particle.velocity.y > 0 
            ?  (y: number) => y > particle.position.y
            :  (y: number) => y < particle.position.y
    }
};

const partOne = (input: Particle[], debug: boolean) => {
    const params = input.map(particle => getLineParameters(particle));
    const min = 200_000_000_000_000;
    const max = 400_000_000_000_000;
    let intersections = 0;
    for (let findex = 0; findex < params.length; findex++) {
        const first = params[findex];
        for (let sindex = findex + 1; sindex < params.length; sindex++) {
            const second = params[sindex];
            if (first.slope === second.slope) {
                // console.log(`Parallel lines ${findex} and ${sindex}`);
                continue;
            }
            const intx = (second.intercept - first.intercept) / (first.slope - second.slope);
            const inty = first.slope * intx + first.intercept;
            if (!first.isFuture(inty)) {
                // console.log(`The point is in the past for ${findex}`);
                continue;
            }
            if (!second.isFuture(inty)) {
                // console.log(`The point is in the past for ${sindex}`);
                continue;
            }
            // console.log(`Intersection between ${findex} and ${sindex} is at ${intx},${inty}`);
            if (intx >= min && intx <= max && inty >= min && inty <= max) {
                // console.log(`   Intersection is in the box`);
                intersections += 1;
            }
        }
    }

    return intersections;
};

const partTwo = (input: Particle[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    return input.length;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Particle[]) => {
    console.log(input);
};

const test = (_: Particle[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Particle[], number> = {
    day: 24,
    input: () => processInput(24),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}