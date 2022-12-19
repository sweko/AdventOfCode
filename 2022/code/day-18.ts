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

    const maxx = input.max(point => point.x);
    const maxy = input.max(point => point.y);
    const maxz = input.max(point => point.z);

    // console.log(`minx: ${minx}, maxx: ${maxx}, miny: ${miny}, maxy: ${maxy}, minz: ${minz}, maxz: ${maxz}`)

    const allSpace: number[][][] = Array(maxx + 2).fill(0)
        .map(_ => Array(maxy + 2).fill(0)
        .map(_ => Array(maxz + 2).fill(0)));

    for (const droplet of input) {
        allSpace[droplet.x][droplet.y][droplet.z] = 1000;
    }

    const queue = [{x: 0, y: 0, z: 0}];

    while (queue.length > 0) {
        const current = queue.shift();

        if (allSpace[current.x][current.y][current.z] !== 0) {
            continue;
        }
        //console.log(`Current: ${current.x}, ${current.y}, ${current.z}, total queue: ${queue.length}`);

        allSpace[current.x][current.y][current.z] = 1;
        const neighbours = [
            {x: current.x + 1, y: current.y, z: current.z},
            {x: current.x - 1, y: current.y, z: current.z},
            {x: current.x, y: current.y + 1, z: current.z},
            {x: current.x, y: current.y - 1, z: current.z},
            {x: current.x, y: current.y, z: current.z + 1},
            {x: current.x, y: current.y, z: current.z - 1},
        ];

        for (const neighbour of neighbours) {

            if (neighbour.x < 0 || neighbour.x > maxx+1) {
                continue;
            }
            if (neighbour.y < 0 || neighbour.y > maxy+1) {
                continue;
            }
            if (neighbour.z < 0 || neighbour.z > maxz+1) {
                continue;
            }

            if (allSpace[neighbour.x][neighbour.y][neighbour.z] === 0) {
                queue.push(neighbour);
            }
        }
    }

    const zeroes = new Set<string>();
    for (let xindex = 0; xindex < allSpace.length; xindex++) {
        const xplane = allSpace[xindex];
        for (let yindex = 0; yindex < xplane.length; yindex++) {
            const yline = xplane[yindex];
            for (let zindex = 0; zindex < yline.length; zindex++) {
                const zpoint = yline[zindex];
                if (zpoint === 0) {
                    zeroes.add(`${xindex},${yindex},${zindex}`);
                }
            }
        }
    }

    const droplets = new Map<string, { 
        top: boolean,
        bottom: boolean,
        left: boolean,
        right: boolean,
        front: boolean,
        back: boolean,
    }>();
    for (const droplet of input) {
        droplets.set(toKey(droplet), { 
            front: true,
            back: true,
            left: true,
            right: true,
            top: true,
            bottom: true,
        } );
    }

    for (let i = 0; i < input.length; i++) {
        const first = input[i];
        const firstSides = droplets.get(toKey(first));

        const topKey = `${first.x},${first.y},${first.z+1}`;
        if (zeroes.has(topKey)) {
            firstSides.top = false;
        }
        const bottomKey = `${first.x},${first.y},${first.z-1}`;
        if (zeroes.has(bottomKey)) {
            firstSides.bottom = false;
        }
        const leftKey = `${first.x-1},${first.y},${first.z}`;
        if (zeroes.has(leftKey)) {
            firstSides.left = false;
        }
        const rightKey = `${first.x+1},${first.y},${first.z}`;
        if (zeroes.has(rightKey)) {
            firstSides.right = false;
        }
        const frontKey = `${first.x},${first.y+1},${first.z}`;
        if (zeroes.has(frontKey)) {
            firstSides.front = false;
        }
        const backKey = `${first.x},${first.y-1},${first.z}`;
        if (zeroes.has(backKey)) {
            firstSides.back = false;
        }

        for (let j = i + 1; j < input.length; j++) {
            const second = input[j];
            const secondSides = droplets.get(toKey(second));

            if (first.x === second.x) {
                if (first.y === second.y) {
                    // same x and y
                    if (first.z-second.z === 1) {
                        firstSides.bottom = false;
                        secondSides.top = false;
                    } else if (first.z-second.z === -1) {
                        firstSides.top = false;
                        secondSides.bottom = false;
                    }
                } else if (first.z === second.z) {
                    // same x and z
                    if (first.y-second.y === 1) {
                        firstSides.back = false;
                        secondSides.front = false;
                    } else if (first.y-second.y === -1) {
                        firstSides.front = false;
                        secondSides.back = false;
                    }
                }
            } else if (first.y === second.y) {
                if (first.z === second.z) {
                    // same y and z
                    if (first.x-second.x === 1) {
                        firstSides.left = false;
                        secondSides.right = false;
                    } else if (first.x-second.x === -1) {
                        firstSides.right = false;
                        secondSides.left = false;
                    }
                }
            }
        }
    }

    const result = [...droplets.values()].map(({front, back, bottom, left, right, top}) => [front,back, left, right, top, bottom].sum()).sum();

    return result;
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
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
