import { readInput, debugLog } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { printMatrix } from "../extra/terminal-helper";
import { IntcodeSimulator } from "../extra/intcode-simulator";

interface Point {
    x: number;
    y: number;
    d: number;
}

interface Point2 {
    x: number;
    y: number;
    v: "." | "#";
}


const pointToString = (p: Point) => `${p.x}:${p.y}`;

const processInput = async (day: number) => {
    const input = await readInput(day);
    const numbers = input.split(",").map(c => parseInt(c, 10));
    return numbers;
};

const draw = (points: Point2[]) => {
    const minx = points.min(p => p.x);
    const miny = points.min(p => p.y);
    const maxx = points.max(p => p.x);
    const maxy = points.max(p => p.y);

    const image = Array(maxy - miny + 1).fill([]).map(_ => Array(maxx - minx + 1).fill(" "));

    for (const point of points) {
        image[point.y - miny][point.x - minx] = point.v;
    }

    printMatrix(image);

}

const sides = [{ name: "INVALID", move: () => { throw Error("invalid") } }, {
    name: "north",
    move: (point: Point): Point => ({
        x: point.x,
        y: point.y - 1,
        d: point.d + 1
    })
}, {
    name: "south",
    move: (point: Point): Point => ({
        x: point.x,
        y: point.y + 1,
        d: point.d + 1
    })
}, {
    name: "west",
    move: (point: Point): Point => ({
        x: point.x - 1,
        y: point.y,
        d: point.d + 1
    })
}, {
    name: "east",
    move: (point: Point): Point => ({
        x: point.x + 1,
        y: point.y,
        d: point.d + 1
    })
}];

const partOne = (instructions: number[], debug: boolean) => {
    const inputs = [1];
    const processed = [];
    const simulator = new IntcodeSimulator(instructions.slice(), inputs, false);

    let current = [{ x: 0, y: 0, d: 0 }];
    let next = [];
    let all: Point2[] = [{ x: 0, y: 0, v: "." }];

    let active = 0; // what is the active box we're checking
    let side = 1; // what is the next side to check
    let moving = true;
    // north (1), south (2), west (3), and east (4)
    simulator.output = (value) => {
        // we're getting a result;
        if (moving) {
            if (value === 0) {
                debugLog(debug, "Gotten 0 from", current[active], "going", sides[side].name);
                const nextPoint = sides[side].move(current[active]);
                all.push({ x: nextPoint.x, y: nextPoint.y, v: "#" });
            }
            // debugLog(debug, `[TASK] Moved ${sides[side].name} from `, current[active], ` result: ${value}`);
            // we can ignore the zeroes completely
            if (value === 1) {
                debugLog(debug, "Gotten 1 from", current[active], "going", sides[side].name);
                //go back
                if (side === 1) inputs.push(2);
                if (side === 2) inputs.push(1);
                if (side === 3) inputs.push(4);
                if (side === 4) inputs.push(3);
                moving = false;
                const nextPoint = sides[side].move(current[active]);
                next.push(nextPoint);
                all.push({ x: nextPoint.x, y: nextPoint.y, v: "." });
                // debugLog(debug, `[TASK] Next tiles: `, next.length);
            }
            if (value === 2) {
                // found it, we're done;
                return current[active].d;
            }
        }

        while (true) {
            if (side < 4) {
                side += 1;
                const target = sides[side].move(current[active]);
                if (processed.includes(pointToString(target))) {
                    debugLog(debug, `[TASK] Skipping `, target, "going", sides[side].name);
                    continue;
                }
                moving = true;
                // debugLog(debug, `[TASK] Moving ${sides[side].name} from `, current[active], ` to `, target);
                inputs.push(side);
                return;
            } else {
                debugLog(true, `[TASK] Finished with`, current[active], `. Proceeding.`)
                processed.push(pointToString(current[active]));
                active += 1;
                if (active === current.length) {
                    debugLog(debug, `[TASK] Finished with depth ${current[active - 1].d}. Processed ${current.length} items. Increasing searh radius`);
                    debugLog(debug, "[TASK] Next points:", next);
                    draw(all);
                    current = next;
                    next = [];
                    active = 0;
                    if (current[0].d === 4) {
                        process.exit();
                    }
                }
                side = 1;
                moving = true;
                inputs.push(side);
                return;
            }
        }
    }

    simulator.run();
    return 0;
};

const partTwo = (instructions: number[], debug: boolean) => {
    return 0;
};

const resultOne = (_: any, result: number) => {
    return `Total number of blocks is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Total score is ${result}`;
};

const showInput = (input: number[]) => {
    console.log(input);
};

const test = (input: number[]) => {
    const src = "104,1125899906842624,99";
    const simulator = new IntcodeSimulator(src.split(",").map(c => parseInt(c, 10)), []);
    simulator.run();
};

export const solution15: Puzzle<number[], number> = {
    day: 15,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
