import { readInputLines } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { lcm } from "../extra/num-helpers";

class Point {
    constructor(public x: number, public y: number, public z: number) { }

    static fromString(source: string) {
        const [x, y, z] = source.split(":").map(c => Number(c));
        return new Point(x, y, z);
    }
}

const copyPoint = (point) => new Point(point.x, point.y, point.z);

interface Moon {
    position: Point,
    velocity: Point
};

type JovianMoons = [Moon, Moon, Moon, Moon];

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const moons = lines.map(line => {
        const match = line.match(/^<x=(-?\d+), y=(-?\d+), z=(-?\d+)>$/);
        return {
            position: new Point(Number(match[1]), Number(match[2]), Number(match[3])),
            velocity: new Point(0, 0, 0)
        }
    });
    return moons as JovianMoons;
};

const printMoon = (moon: Moon) => `pos=<x=${moon.position.x}, y=${moon.position.y}, z=${moon.position.z}>, vel=<x=${moon.velocity.x}, y=${moon.velocity.y}, z=${moon.velocity.z}>`;

const pairs = [[1, 2, 3], [0, 2, 3], [0, 1, 3], [0, 1, 2]];

const moveMoons = (moons: JovianMoons) => {
    const result: JovianMoons = moons.map(moon => ({
        position: copyPoint(moon.position),
        velocity: copyPoint(moon.velocity)
    })) as JovianMoons;

    for (let index = 0; index < moons.length; index++) {
        const moon = moons[index];
        const copy = result[index];
        for (const oindex of pairs[index]) {
            const other = moons[oindex];
            if (moon.position.x > other.position.x) {
                copy.velocity.x -= 1;
            }
            if (moon.position.y > other.position.y) {
                copy.velocity.y -= 1;
            }
            if (moon.position.z > other.position.z) {
                copy.velocity.z -= 1;
            }
            if (moon.position.x < other.position.x) {
                copy.velocity.x += 1;
            }
            if (moon.position.y < other.position.y) {
                copy.velocity.y += 1;
            }
            if (moon.position.z < other.position.z) {
                copy.velocity.z += 1;
            }
        }

    }

    for (const moon of result) {
        moon.position.x += moon.velocity.x;
        moon.position.y += moon.velocity.y;
        moon.position.z += moon.velocity.z;
    }

    return result;
}

const calcEnergy = (moons: JovianMoons) => {
    return moons.map(moon => ({
        potential: Math.abs(moon.position.x) + Math.abs(moon.position.y) + Math.abs(moon.position.z),
        kinetic: Math.abs(moon.velocity.x) + Math.abs(moon.velocity.y) + Math.abs(moon.velocity.z)
    })).sum(energy => energy.kinetic * energy.potential);
}

const partOne = (moons: JovianMoons, debug: boolean) => {
    if (debug) {
        console.log("------------");
    }

    let step = 0;
    const target = 1000;
    while (step < target) {
        step += 1;
        moons = moveMoons(moons);
        if (debug) {
            console.log(`Step #${step}`);
            showInput(moons);
        }
    }
    return calcEnergy(moons);
};

const moveMoonsDir = (moons: JovianMoons, dimension: keyof Point) => {
    const result: JovianMoons = moons.map(moon => ({
        position: copyPoint(moon.position),
        velocity: copyPoint(moon.velocity)
    })) as JovianMoons;

    for (let index = 0; index < moons.length; index++) {
        const moon = moons[index];
        const copy = result[index];
        for (const oindex of pairs[index]) {
            const other = moons[oindex];
            if (moon.position[dimension] > other.position[dimension]) {
                copy.velocity[dimension] -= 1;
            }
            if (moon.position[dimension]< other.position[dimension]) {
                copy.velocity[dimension] += 1;
            }
        }
    }

    for (const moon of result) {
        moon.position[dimension] += moon.velocity[dimension];
    }

    return result;
};

const compareState = (first: JovianMoons, second: JovianMoons, dimension: keyof Point) => {
    for (let index = 0; index < first.length; index++) {
        const fmoon = first[index];
        const smoon = second[index];
        if (fmoon.position[dimension] !== smoon.position[dimension]) {
            return false;
        }
        if (fmoon.velocity[dimension] !== smoon.velocity[dimension]) {
            return false;
        }
    }
    return true;
};

const partTwo = (moons: JovianMoons, debug: boolean) => {
    let moved = moons.slice() as JovianMoons;
    let movesx = 0;
    do {
        movesx += 1;
        moved = moveMoonsDir(moved, "x");
    } while (!compareState(moons, moved, "x"));

    let movesy = 0;
    do {
        movesy += 1;
        moved = moveMoonsDir(moved, "y");
    } while (!compareState(moons, moved, "y"));

    let movesz = 0;
    do {
        movesz += 1;
        moved = moveMoonsDir(moved, "z");
    } while (!compareState(moons, moved, "z"));

    const result = lcm(movesx,lcm(movesy, movesz));
    return result;
};

const resultOne = (_: any, result: number) => {
    return `Total system energy is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The period of the orbit is ${result}`;
};

const showInput = (moons: JovianMoons) => {
    moons.map(printMoon).map(ms => console.log(ms));
};

const test = (moons: JovianMoons) => {
};

export const solutionTwelve: Puzzle<JovianMoons, number> = {
    day: 12,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
