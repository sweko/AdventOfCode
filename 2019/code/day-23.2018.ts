import { readInputLines, readInput, debugLog } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Drone {
    x: number;
    y: number;
    z: number;
    r: number;
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const drones: Drone[] = lines.map(line => {
        const match = line.match(/^pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)$/);
        return {
            x: Number(match[1]),
            y: Number(match[2]),
            z: Number(match[3]),
            r: Number(match[4])
        }
    });
    return drones;
};

const getDistance = (first: Drone, second: Drone) => Math.abs(first.x - second.x) + Math.abs(first.y - second.y) + Math.abs(first.z - second.z);

const partOne = (drones: Drone[], debug: boolean) => {
    const strongest = drones.maxFind(d => d.r);

    debugLog(debug, "Drone with maximum range is:", strongest);

    const inRange = drones.filter(drone => getDistance(drone, strongest) <= strongest.r);

    return inRange.length;
};

const partTwo = (drones: Drone[], debug: boolean) => {
    const minx = drones.min(d => d.x);
    const maxx = drones.max(d => d.x);
    const miny = drones.min(d => d.y);
    const maxy = drones.max(d => d.y);
    const minz = drones.min(d => d.z);
    const maxz = drones.max(d => d.z);

    debugLog(debug, "Bounding coordinates:");
    debugLog(debug, ` X: {${minx}, ${maxx}}, size: ${maxx - minx}`);
    debugLog(debug, ` Y: {${miny}, ${maxy}}, size: ${maxy - miny}`);
    debugLog(debug, ` Z: {${minz}, ${maxz}}, size: ${maxz - minz}`);

    const weakest = drones.minFind(d => d.r);

    debugLog(debug, "Drone with minimal range is:", weakest);

    return -1;
}

const resultOne = (_: any, result: number) => {
    return `Total ${result} drones in range`;
};

const resultTwo = (_: any, result: number) => {
    return `The period of the orbit is ${result}`;
};

const showInput = (input: Drone[]) => {
    console.log(input);
};

const test = (_: Drone[]) => {
    console.log("----Test-----");
};

export const solution23_2018: Puzzle<Drone[], number> = {
    day: 232018,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
