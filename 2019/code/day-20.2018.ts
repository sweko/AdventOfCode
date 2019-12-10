import { readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Options {
    options: Regex[];
}

type Regex = (string | Options)[];

type Direction = "E" | "N" | "S" | "W";

class Point {
    constructor(public x: number, public y: number) { }

    copy() {
        return new Point(this.x, this.y);
    }

    toString() {
        return `${this.x}:${this.y}`
    };

    static fromString(source: string) {
        const [x, y] = source.split(":").map(c => Number(c));
        return new Point(x, y);
    }
}

const stringToRegex = (regex: string[], startIndex = 0): { value: Regex, index: number } => {
    let index = startIndex;
    const sides = "SNEW".split("");
    const result: Regex = [];
    while (index !== regex.length) {
        const current = regex[index];
        if (sides.includes(current)) {
            result.push(current);
            index += 1;
            continue;
        }
        if (current === "(") {
            // open sub-regex
            index += 1;
            const child = stringToRegex(regex, index);
            result.push({ options: [child.value] });
            index = child.index;
            continue;
        }
        if (current === "|") {
            // we're done, next sibling is up
            regex[index] = "+"
            return {
                value: result,
                index
            };
        }
        if (current === "+") {
            regex[index] = "|";
            // continue with sibling
            index += 1;
            const child = stringToRegex(regex, index);
            (result.last() as Options).options.push(child.value);
            index = child.index;
            continue;
        }
        if (current === ")") {
            // we're done, last sibling
            regex[index] = "}"
            return {
                value: result,
                index
            };
        }
        if (current === "}") {
            regex[index] = ")";
            // continue with next
            index += 1;
            continue;
        }
    }
    return {
        value: result,
        index: regex.length
    };
}

const processInput = async (day: number) => {
    const input = await readInput(day);
    const regex = input.split("").slice(1, input.length - 1);
    return stringToRegex(regex).value;
};

const directionOps = {
    "N": (point: Point) => new Point(point.x, point.y + 1),
    "S": (point: Point) => new Point(point.x, point.y - 1),
    "E": (point: Point) => new Point(point.x + 1, point.y),
    "W": (point: Point) => new Point(point.x - 1, point.y),
}

const go = (origin: Point, direction: Direction) => {
    return directionOps[direction](origin);
}

const walk = (regex: Regex, rooms: { [key: string]: number }, origin = new Point(0, 0)) => {
    let location = origin.copy();
    for (const step of regex) {
        if (typeof step === "string") {
            const locValue = rooms[location.toString()];
            location = go(location, step as Direction);
            if ((rooms[location.toString()] === undefined) || (rooms[location.toString()] > locValue + 1)) {
                rooms[location.toString()] = locValue + 1;
            }
        } else {
            for (const option of step.options) {
                walk(option, rooms, location);
            }
        }
    }
}

const partOne = (regex: Regex, debug = false) => {
    const rooms = {
        "0:0": 0,
    };
    walk(regex, rooms);
    return Object.values(rooms).max();
};

const partTwo = (regex: Regex, debug = false) => {
    const rooms = {
        "0:0": 0,
    };
    walk(regex, rooms);
    return Object.values(rooms).filter(n => n>=1000).length;
};

const resultOne = (_: any, result: number) => {
    return `The largest number of doors is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `There are ${result} rooms distant a 1000 or more doors`;
};

const showInput = (regex: Regex) => {
    console.log(regex);
};

const test = () => {
    const regex = stringToRegex("ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))".split(""));

};

export const solution20_2018: Puzzle<Regex, number> = {
    day: 202018,
    input: processInput,
    partOne,
    partTwo,
    resultOne,
    resultTwo,
    showInput,
    test,
}


