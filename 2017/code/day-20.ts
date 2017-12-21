import { readInput, readInputLines } from "../extra/aoc-helper";
import { terminal } from "terminal-kit";
import "../extra/group-by";

interface Point {
    x: number;
    y: number;
    z: number;
}

interface Particle {
    id: number;
    position: Point;
    velocity: Point;
    acceleration: Point;
}

async function main() {
    const lines = await readInputLines();

    const particles = lines.map((line, index) => processLine(line, index));
    let result = processPartOne(particles);
    console.log(`Part 1: closest particle is ${result}`);
    let particleCount = processPartTwo(particles);
    console.log(`Part 2: total number of particles left is ${particleCount}`);
}

function processLine(line: string, index: number): Particle {
    let match = line
        .match(/^p=<(-?\d+),(-?\d+),(-?\d+)>, v=<(-?\d+),(-?\d+),(-?\d+)>, a=<(-?\d+),(-?\d+),(-?\d+)>$/)
        .slice(1)
        .map(n => parseInt(n));

    return {
        id: index,
        position: {
            x: match[0],
            y: match[1],
            z: match[2]
        },
        velocity: {
            x: match[3],
            y: match[4],
            z: match[5]
        },
        acceleration: {
            x: match[6],
            y: match[7],
            z: match[8]
        }
    };
}

function processPartOne(particles: Particle[], debug = false) {
    let index = -1;
    let minAcc = Infinity;
    let minVel = Infinity;
    particles.forEach(p => {
        let acc = Math.abs(p.acceleration.x) + Math.abs(p.acceleration.y) + Math.abs(p.acceleration.z);
        let vel = Math.abs(p.velocity.x) + Math.abs(p.velocity.y) + Math.abs(p.velocity.z);
        if ((acc < minAcc) || (acc === minAcc && vel < minVel)) {
            if (debug) {
                console.log(`minimal index: ${index}, current point ${p.id}`);
                console.log(p);
                console.log(`current acceleration: ${acc}, current velocity ${vel}`);
                console.log(`minimal acceleration: ${minAcc}, minimal velocity ${minVel}`);
            }
            minAcc = acc;
            index = p.id;
            minVel = vel;
        }
    });
    return index;
}

function checkParticles(particles: Particle[]) {
    const groups = particles
        .groupBy(p => JSON.stringify(p.position))
        .filter(g => g.items.length === 1)
        .map(g => g.items);

    const result = (<Particle[]>[]).concat(...groups);
    return result;
}

function moveParticles(particles: Particle[]): Particle[] {
    return particles.map(p => {
        const velocity = {
            x: p.velocity.x + p.acceleration.x,
            y: p.velocity.y + p.acceleration.y,
            z: p.velocity.z + p.acceleration.z
        };
        const position = {
            x: p.position.x + velocity.x,
            y: p.position.y + velocity.y,
            z: p.position.z + velocity.z
        };
        return {
            id: p.id,
            position: position,
            velocity: velocity,
            acceleration: p.acceleration
        }
    });
}


function processPartTwo(particles: Particle[]) {
    const limit = 100; // empirical
    for (let index = 0; index < limit; index++) {
        particles = checkParticles(particles);
        particles = moveParticles(particles);
    }
    return particles.length;
}

main();