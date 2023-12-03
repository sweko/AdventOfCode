// Solution for day 3 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

interface Point {
    x: number;
    y: number;
}

interface Element extends Point {
    value: string;
}

interface PartNumber {
    value: number;
    // start and end have the same x coordinate
    start: Point;
    end: Point;
}

interface Engine {
    elements: Element[];
    parts: PartNumber[];
}

const isDigit = (value: string) => value >= "0" && value <= "9";

const getDigit = (value: string) => parseInt(value, 10);

const processInput = (day: number) => {
    const input = readInputLines(day);
    const result: Engine = {
        elements: [],
        parts: []
    };
    for (let xindex = 0; xindex < input.length; xindex++) {
        const lineChars = input[xindex].split("");
        let partNumber: PartNumber | null = null;
        for (let yindex = 0; yindex < lineChars.length; yindex++) {
            const char = lineChars[yindex];
            if (isDigit(char)) {
                if (partNumber) {
                    partNumber.end = {
                        x: xindex,
                        y: yindex
                    };
                    partNumber.value = partNumber.value * 10 + getDigit(char);
                } else {
                    partNumber = {
                        value: getDigit(char),
                        start: {
                            x: xindex,
                            y: yindex
                        },
                        end: {
                            x: xindex,
                            y: yindex
                        }
                    };
                }
                continue;
            }
            if (partNumber) {
                result.parts.push(partNumber);
                partNumber = null;
            }
            if (char === ".") {
                continue;
            }
            result.elements.push({
                x: xindex,
                y: yindex,
                value: char
            });
        }
        if (partNumber) {
            result.parts.push(partNumber);
            partNumber = null;
        }
    }
    return result;
};

const partOne = (input: Engine, debug: boolean) => {
    const matched = [];
    const unmatched = [];
    for (const { start, end, value } of input.parts) {
        let found = false;
        let ex = start.x - 1;
        let ey = start.y - 1;
        for (ey = start.y - 1; ey <= end.y + 1; ey++) {
            const check = input.elements.find(e => e.x === ex && e.y === ey);
            if (check) {
                found = true;
                matched.push(value);
                break;
            }
        }
        if (found) {
            continue;
        }

        ex = start.x + 1;
        for (ey = start.y - 1; ey <= end.y + 1; ey++) {
            const check = input.elements.find(e => e.x === ex && e.y === ey);
            if (check) {
                found = true;
                matched.push(value);
                break;
            }
        }
        if (found) {
            continue;
        }

        if (input.elements.find(e => e.x === start.x && e.y === start.y - 1)) {
            matched.push(value);
            continue;
        }

        if (input.elements.find(e => e.x === end.x && e.y === end.y + 1)) {
            matched.push(value);
            continue;
        }

        unmatched.push(value);
    }

    //console.log(matched);
    //console.log(unmatched);

    return matched.sum();
};

const findPart = (parts: PartNumber[], x: number, y: number) => {
    return parts.find(p => p.start.x === x && p.start.y <= y && p.end.y >= y);
};

const partTwo = (input: Engine, debug: boolean) => {
    const potGears = input.elements.filter(e => e.value === "*");

    let total = 0;
    for (const gear of potGears) {
        const parts = new Set<PartNumber>();
        // top left
        const tl = findPart(input.parts, gear.x - 1, gear.y - 1);
        if (tl) {
            parts.add(tl);
        }
        // top right
        const tr = findPart(input.parts, gear.x - 1, gear.y + 1);
        if (tr) {
            parts.add(tr);
        }
        // bottom left
        const bl = findPart(input.parts, gear.x + 1, gear.y - 1);
        if (bl) {
            parts.add(bl);
        }
        // bottom right
        const br = findPart(input.parts, gear.x + 1, gear.y + 1);
        if (br) {
            parts.add(br);
        }
        // top
        const t = findPart(input.parts, gear.x - 1, gear.y);
        if (t) {
            parts.add(t);
        }
        // bottom
        const b = findPart(input.parts, gear.x + 1, gear.y);
        if (b) {
            parts.add(b);
        }
        // left
        const l = findPart(input.parts, gear.x, gear.y - 1 );
        if (l) {
            parts.add(l);
        }
        // right
        const r = findPart(input.parts, gear.x, gear.y - 2);
        if (r) {
            parts.add(r);
        }

        if (parts.size === 2) {
            const [f, s] = [...parts.values()].map(p => p.value);
            total += f * s;
        }
    }

    return total;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Engine) => {
    console.log(input);
};

const test = (_: Engine) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Engine, number> = {
    day: 3,
    input: () => processInput(3),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}