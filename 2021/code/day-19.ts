import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Scanner {
    id: number;
    beacons: Point[];
}
interface Point {
    x: number;
    y: number;
    z: number;
}

const toKey = (point: Point) => `${point.x},${point.y},${point.z}`;

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const rx = /--- scanner (\d+) ---/;

    const scanners: Scanner[] = [];
    let index = 0;
    while (true) {
        let line = lines[index];
        if (!line) {
            break;
        }
        const match = line.match(rx);
        const id = parseInt(match[1], 10);
        index +=1;
        line = lines[index];
        const beacons: Point[] = [];
        while (line) {
            const [x, y, z] = line.split(",").map(s => parseInt(s, 10));
            beacons.push({ x, y, z });
            index +=1;
            line = lines[index];
        }
        index +=1;
        scanners.push({ id, beacons });
    }
    return scanners;
};

const rotations: ((point:Point)=>Point)[] = [
    (point: Point) => ({ x: +point.x, y: +point.y, z: +point.z }),
    (point: Point) => ({ x: -point.x, y: -point.y, z: +point.z }),
    (point: Point) => ({ x: +point.x, y: -point.y, z: -point.z }),
    (point: Point) => ({ x: -point.x, y: +point.y, z: -point.z }),
    (point: Point) => ({ x: -point.x, y: +point.z, z: +point.y }),
    (point: Point) => ({ x: +point.x, y: -point.z, z: +point.y }),
    (point: Point) => ({ x: -point.x, y: -point.z, z: -point.y }),
    (point: Point) => ({ x: +point.x, y: +point.z, z: -point.y }),
    (point: Point) => ({ x: -point.y, y: +point.x, z: +point.z }),
    (point: Point) => ({ x: +point.y, y: -point.x, z: +point.z }),
    (point: Point) => ({ x: -point.y, y: -point.x, z: -point.z }),
    (point: Point) => ({ x: +point.y, y: +point.x, z: -point.z }),
    (point: Point) => ({ x: +point.y, y: +point.z, z: +point.x }),
    (point: Point) => ({ x: -point.y, y: -point.z, z: +point.x }),
    (point: Point) => ({ x: +point.y, y: -point.z, z: -point.x }),
    (point: Point) => ({ x: -point.y, y: +point.z, z: -point.x }),
    (point: Point) => ({ x: +point.z, y: +point.x, z: +point.y }),
    (point: Point) => ({ x: -point.z, y: -point.x, z: +point.y }),
    (point: Point) => ({ x: +point.z, y: -point.x, z: -point.y }),
    (point: Point) => ({ x: -point.z, y: +point.x, z: -point.y }),
    (point: Point) => ({ x: -point.z, y: +point.y, z: +point.x }),
    (point: Point) => ({ x: +point.z, y: -point.y, z: +point.x }),
    (point: Point) => ({ x: -point.z, y: -point.y, z: -point.x }),
    (point: Point) => ({ x: +point.z, y: +point.y, z: -point.x })
]

const partOne = (input: Scanner[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    return 0;

    const reference = input[0].beacons.map(p => p);
    const rest = [...input.slice(1)];

    let index = 0;

    while (rest.length != 0) {
        const target = rest[index];
        console.log(`Remaining: ${rest.length}, Current: ${target.id}, References: ${reference.length}`);

        for (const rotation of rotations) {
            const beacons = target.beacons.map(p => rotation(p));
            const diffs: Point[] = [];
            for (const rbeacon of reference) {
                for (const tbeacon of beacons) {
                    const diff = {
                        x: rbeacon.x - tbeacon.x,
                        y: rbeacon.y - tbeacon.y,
                        z: rbeacon.z - tbeacon.z
                    }
                    diffs.push(diff);
                }
            }
            const grouped = diffs.groupBy(d => toKey(d)).filter(g => g.items.length >= 12);
            if (grouped.length === 0) {
                continue;
            }
            if (grouped.length > 1) {
                throw new Error("More than one group");
            }
            console.log(`Found a match for ${target.id}`);
            const scannerDiff = grouped[0].items[0];

            const translated = beacons.map(p => ({
                x: p.x + scannerDiff.x,
                y: p.y + scannerDiff.y,
                z: p.z + scannerDiff.z
            }));

            const refkeys = reference.map(p => toKey(p));
            for (const point of translated) {
                const key = toKey(point);
                if (!refkeys.includes(key)) {
                    reference.push(point);
                }
            }
            rest.splice(index, 1);
            index -=1;
            break;
        }

        index += 1;
        if (index === rest.length) {
            index = 0;
        }
    }
    return reference.length;
};

const partTwo = (input: Scanner[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const reference = input[0].beacons.map(p => p);
    const rest = [...input.slice(1)];
    const scanners: Point[] = [{x: 0, y:0, z:0}];

    let index = 0;

    while (rest.length != 0) {
        const target = rest[index];
        console.log(`Remaining: ${rest.length}, Current: ${target.id}, References: ${reference.length}`);

        for (const rotation of rotations) {
            const beacons = target.beacons.map(p => rotation(p));
            const diffs: Point[] = [];
            for (const rbeacon of reference) {
                for (const tbeacon of beacons) {
                    const diff = {
                        x: rbeacon.x - tbeacon.x,
                        y: rbeacon.y - tbeacon.y,
                        z: rbeacon.z - tbeacon.z
                    }
                    diffs.push(diff);
                }
            }
            const grouped = diffs.groupBy(d => toKey(d)).filter(g => g.items.length >= 12);
            if (grouped.length === 0) {
                continue;
            }
            if (grouped.length > 1) {
                throw new Error("More than one group");
            }
            console.log(`Found a match for ${target.id}`);
            const scannerDiff = grouped[0].items[0];

            const translated = beacons.map(p => ({
                x: p.x + scannerDiff.x,
                y: p.y + scannerDiff.y,
                z: p.z + scannerDiff.z
            }));

            const refkeys = reference.map(p => toKey(p));
            for (const point of translated) {
                const key = toKey(point);
                if (!refkeys.includes(key)) {
                    reference.push(point);
                }
            }
            scanners.push(scannerDiff);
            rest.splice(index, 1);
            index -=1;
            break;
        }

        index += 1;
        if (index === rest.length) {
            index = 0;
        }
    }

    let max = 0;
    for (let i1 = 0; i1 < scanners.length; i1++) {
        const sc1 = scanners[i1];
        for (let i2 = i1 + 1; i2 < scanners.length; i2++) {
            const sc2 = scanners[i2];
            const dist = Math.abs(sc1.x - sc2.x) + Math.abs(sc1.y - sc2.y) + Math.abs(sc1.z - sc2.z);
            if (dist > max) {
                max = dist;
            }
        }
    }
    return max;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Scanner[]) => {
    for (const scanner of input) {
        console.log(scanner);
    }
};

const test = (_: Scanner[]) => {
    console.log("----Test-----");

    const point = {x: 1, y:2, z: 3};
    console.log(rotations.map(r => r(point)));
};

export const solutionNineteen: Puzzle<Scanner[], number> = {
    day: 19,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
