import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

type Direction = "R" | "U" | "L" | "D";

interface Input {
    direction: Direction;
    distance: number;
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    return lines.map(line => {
        const match = line.match(/^(R|U|L|D) (\d+)$/);
        return {
            direction: match[1] as Direction,
            distance: parseInt(match[2])
        }
    });
};

const partOne = (input: Input[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const visiteds: Record<number, Set<number>> = { 0 : new Set([0])};

    let headx = 0;
    let heady = 0;
    let tailx = 0;
    let taily = 0;

    for (const { direction, distance } of input) {
        for (let index = 0; index < distance; index++) {
            // move the head
            switch (direction) {
                case "R": headx++; break;
                case "U": heady++; break;
                case "L": headx--; break;
                case "D": heady--; break;
            }

            // move the tail
            // if the tails is touching the head, no movey
            if (Math.abs(headx - tailx)<=1 && Math.abs(heady - taily) <= 1) {
                continue;
            }
            // otherwise
            if (heady > taily) {
                taily++;
            } else if (heady < taily) {
                taily--;
            }

            if (headx > tailx) {
                tailx++;
            } else if (headx < tailx) {
                tailx--;
            }


            if (!visiteds[taily]) {
                visiteds[taily] = new Set();
            }
            visiteds[taily].add(tailx);
        }
    }

    const result = Object.keys(visiteds).map(key => visiteds[key]).sum(set => set.size);

    return result;
};

// evil mutable method
const followKnot = (head: { x: number, y: number }, tail : {x: number, y: number}) => {
    // move the tail
    // if the tails is touching the head, no movey
    if (Math.abs(head.x - tail.x)<=1 && Math.abs(head.y - tail.y) <= 1) {
        return;
    }
    // otherwise
    if (head.y > tail.y) {
        tail.y++;
    } else if (head.y < tail.y) {
        tail.y--;
    }

    if (head.x > tail.x) {
        tail.x++;
    } else if (head.x < tail.x) {
        tail.x--;
    }
}

const partTwo = (input: Input[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const visiteds: Record<number, Set<number>> = { 0 : new Set([0])};

    const knots = [
        { x: 0, y: 0 }, 
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 }
    ];

    for (const { direction, distance } of input) {
        for (let index = 0; index < distance; index++) {
            // move the head
            const head = knots[0];
            switch (direction) {
                case "R": head.x++; break;
                case "U": head.y++; break;
                case "L": head.x--; break;
                case "D": head.y--; break;
            }

            // move the tail
            for (let kindex = 1; kindex < knots.length; kindex++) {
                followKnot(knots[kindex-1], knots[kindex]);
            }

            const tail = knots[knots.length-1];
            if (!visiteds[tail.y]) {
                visiteds[tail.y] = new Set();
            }
            visiteds[tail.y].add(tail.x);
        }
    }

    const result = Object.keys(visiteds).map(key => visiteds[key]).sum(set => set.size);

    return result;
};

const resultOne = (_: Input[], result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: Input[], result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Input[]) => {
    console.log(input);
};

const test = (input: Input[]) => {
    console.log("----Test-----");
    console.log(input.groupReduce(
        item => item.direction,
        (acc, item) => acc + item.distance,
        0
    ));
};

export const solutionNine: Puzzle<Input[], number> = {
    day: 9,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
