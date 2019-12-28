import { readInput, debugLog } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { printMatrix } from "../extra/terminal-helper";
import { IntcodeSimulator } from "../extra/intcode-simulator";
import { mapMatrix } from "../extra/matrix-helpers";

type Marker = "." | "#" | " " | "o" | "s";

interface Point {
    x: number;
    y: number;
}

interface DataPoint extends Point {
    d?: number;
    v: Marker;
}


const pointToString = (p: Point) => `${p.x}:${p.y}`;

const processInput = async (day: number) => {
    const input = await readInput(day);
    const numbers = input.split(",").map(c => parseInt(c, 10));
    return numbers;
};

const generateImage = (pointsObject: { [key: string]: DataPoint }): Marker[][] => {
    const points = Object.values(pointsObject);
    const minx = points.min(p => p.x);
    const miny = points.min(p => p.y);
    const maxx = points.max(p => p.x);
    const maxy = points.max(p => p.y);

    const image = Array(maxy - miny + 1).fill([]).map(_ => Array(maxx - minx + 1).fill("#"));

    for (const point of points) {
        image[point.y - miny][point.x - minx] = point.v;
    }
    return image;
}

const sides = [{ name: "INVALID", move: () => { throw Error("invalid") } }, {
    name: "north",
    move: (point: DataPoint): DataPoint => ({
        x: point.x,
        y: point.y - 1,
        d: point.d + 1,
        v: " "
    })
}, {
    name: "south",
    move: (point: DataPoint): DataPoint => ({
        x: point.x,
        y: point.y + 1,
        d: point.d + 1,
        v: " "
    })
}, {
    name: "west",
    move: (point: DataPoint): DataPoint => ({
        x: point.x - 1,
        y: point.y,
        d: point.d + 1,
        v: " "
    })
}, {
    name: "east",
    move: (point: DataPoint): DataPoint => ({
        x: point.x + 1,
        y: point.y,
        d: point.d + 1,
        v: " "
    })
}];

const turnLeft = (side: number) => {
    if (side === 1) return 3;
    if (side === 3) return 2;
    if (side === 2) return 4;
    if (side === 4) return 1;
    throw Error(`Invalid side: ${side}`);
}

const turnRight = (side: number) => {
    if (side === 1) return 4;
    if (side === 3) return 1;
    if (side === 2) return 3;
    if (side === 4) return 2;
    throw Error(`Invalid side: ${side}`);
}

const getNeighbours = (point: Point) => [
    { x: point.x, y: point.y + 1 },
    { x: point.x, y: point.y - 1 },
    { x: point.x - 1, y: point.y },
    { x: point.x + 1, y: point.y },
];

const floodFill = (maze: Marker[][]) => {
    let finish;
    const pending: Point[] = [];
    const filled = mapMatrix(maze, (item, rindex, cindex) => {
        if (item === "#") return Number.NEGATIVE_INFINITY;
        if (item === "o") {
            pending.push({ x: rindex, y: cindex });
            return 0;
        }
        if (item === "s") finish = { x: rindex, y: cindex };
        return Number.POSITIVE_INFINITY;
    });

    while (filled[finish.x][finish.y] === Number.POSITIVE_INFINITY) {
        const next = pending.shift();
        const neighbours = getNeighbours(next).filter(p => filled[p.x][p.y] === Number.POSITIVE_INFINITY);
        for (const neighbour of neighbours) {
            filled[neighbour.x][neighbour.y] = filled[next.x][next.y] + 1;
            pending.push(neighbour)
        }
    }

    return filled[finish.x][finish.y];
}

const getMazeData = (instructions: number[], debug: boolean) => {
    const inputs = [1];
    const simulator = new IntcodeSimulator(instructions.slice(), inputs, false);

    let current: DataPoint = { x: 0, y: 0, d: 0, v: "o" };
    const processed: { [key: string]: DataPoint } = { "0:0": current };
    let side = 1; // what is the next side to check

    // north (1), south (2), west (3), and east (4)
    simulator.output = (value) => {
        const nextPoint = sides[side].move(current);
        const key = pointToString(nextPoint);
        if (processed[key] && processed[key].v === "o") {
            return;
        }
        if (value === 0) {
            // wall
            debugLog(false, "Gotten 0 from", current, "going", sides[side].name);
            processed[key] = { x: nextPoint.x, y: nextPoint.y, v: "#" };
            // turn and continue
            side = turnRight(side);
            inputs.push(side);
        } else if ((value === 1) || (value === 2)) {
            // passage
            debugLog(false, `Gotten ${value} from`, current, "going", sides[side].name);
            processed[key] = { x: nextPoint.x, y: nextPoint.y, v: value === 1 ? "." : "s" };
            // continue straight
            current = nextPoint;
            side = turnLeft(side);
            inputs.push(side);
        }
    };

    simulator.run();
    return processed;
}

const partOne = (instructions: number[], debug: boolean) => {

    const maze = generateImage(getMazeData(instructions, debug));
    const solved = floodFill(maze);

    return solved;
};

const floodFillPartDeux = (maze: Marker[][]) => {
    let finish;
    const pending: Point[] = [];
    const filled = mapMatrix(maze, (item, rindex, cindex) => {
        if (item === "#") return Number.NEGATIVE_INFINITY;
        if (item === "o") finish = { x: rindex, y: cindex };
        if (item === "s") {
            pending.push({ x: rindex, y: cindex });
            return 0;
        }
        return Number.POSITIVE_INFINITY;
    });

    while (pending.length > 0) {
        const next = pending.shift();
        const neighbours = getNeighbours(next).filter(p => filled[p.x][p.y] === Number.POSITIVE_INFINITY);
        for (const neighbour of neighbours) {
            filled[neighbour.x][neighbour.y] = filled[next.x][next.y] + 1;
            pending.push(neighbour)
        }
    }

    return filled;
}


const partTwo = (instructions: number[], debug: boolean) => {
    const maze = generateImage(getMazeData(instructions, debug));
    const solved = floodFillPartDeux(maze);

    return solved.max(row => row.filter(value => isFinite(value)).max());
};

const resultOne = (_: any, result: number) => {
    return `The fewest number of movements is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Total time to fill the maze with oxygen is ${result}`;
};

const showInput = (input: number[]) => {
    //console.log(input);
};

const test = (input: number[]) => {
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
