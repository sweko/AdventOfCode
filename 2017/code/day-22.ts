import { readInput, readInputLines } from "../extra/aoc-helper";
import { terminal } from "terminal-kit";
import "../extra/group-by";

async function main() {
    const lines = await readInputLines();

    console.time("Part 1");
    let [infected, center] = getInitState(lines, true);
    let limit = 10000;
    let result = processPartOne(infected, center, limit);
    console.timeEnd("Part 1");
    console.log(`Part 1: total infections after ${limit} bursts is ${result}`);

    console.time("Part 2");
    [infected, center] = getInitState(lines, false);

    //[infected, center] = [{ "1|0": State.Infected, "0|2": State.Infected }, 1];

    limit = 10000000;
    result = processPartTwo(infected, center, limit);
    console.timeEnd("Part 2");
    console.log(`Part 2: total infections after ${limit} bursts is ${result}`);
}

function getKey(x: number, y: number) {
    return `${x}|${y}`;
}

type Side = "east" | "west" | "north" | "south";
type Direction = { right: Side, left: Side, back?: Side, op: () => void };
type Directions = { [key: string]: Direction };

enum State {
    Flagged = 1,
    Weakened = 2,
    Infected = 3
}

function getInitState(lines: string[], useBool: boolean): [{}, number] {
    const infected = {};
    lines.forEach((line, lindex) => {
        line.split("").forEach((char, cindex) => {
            if (char === "#") {
                infected[getKey(lindex, cindex)] = useBool ? true : State.Infected;
            }
        });
    });
    const center = lines.length / 2 | 0;
    return [infected, center];
}

function processPartOne(infected: { [key: string]: boolean }, center: number, limit: number) {

    let direction: Side = "north";
    let latitude = center;
    let longitude = center;
    const directions: Directions = {
        north: { right: "east", left: "west", op: () => latitude -= 1 },
        south: { right: "west", left: "east", op: () => latitude += 1 },
        west: { right: "north", left: "south", op: () => longitude -= 1 },
        east: { right: "south", left: "north", op: () => longitude += 1 },
    }

    let infections = 0;
    for (let i = 0; i < limit; i++) {
        let key = getKey(latitude, longitude);
        if (infected[key]) {
            direction = directions[direction].right;
            delete infected[key];
        } else {
            direction = directions[direction].left;
            infections += 1;
            infected[key] = true;
        }
        directions[direction].op();
    }
    return infections;
}

function processPartTwo(infected: { [key: string]: number }, center: number, limit: number) {

    let direction: Side = "north";
    let latitude = center;
    let longitude = center;
    const directions: Directions = {
        north: { right: "east", left: "west", back: "south", op: () => latitude -= 1 },
        south: { right: "west", left: "east", back: "north", op: () => latitude += 1 },
        west: { right: "north", left: "south", back: "east", op: () => longitude -= 1 },
        east: { right: "south", left: "north", back: "west", op: () => longitude += 1 },
    }

    let infections = 0;
    for (let i = 0; i < limit; i++) {
        let key = getKey(latitude, longitude);
        if (infected[key] === State.Infected) {
            direction = directions[direction].right;
            infected[key] = State.Flagged;
        } else if (infected[key] === State.Flagged) {
            direction = directions[direction].back;
            delete infected[key];
        } else if (infected[key] === State.Weakened) {
            infections += 1;
            infected[key] = State.Infected;
        } else {
            direction = directions[direction].left;
            infected[key] = State.Weakened;
        }
        directions[direction].op();
    }
    console.log(Object.keys(infected).length);
    return infections;
}

main();