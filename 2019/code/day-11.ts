import { readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { printMatrix } from "../extra/terminal-helper";
import { IntcodeSimulator } from "../extra/intcode-simulator";

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

const processInput = async (day: number) => {
    const input = await readInput(day);
    const numbers = input.split(",").map(c => parseInt(c, 10));
    return numbers;
};


type Facing = "up" | "down" | "left" | "right";

const facings: {[key in Facing]:{left: Facing, right:Facing}} = {
    up: {
        left: "left",
        right: "right"
    },
    left: {
        left: "down",
        right: "up"
    },
    down: {
        left: "right",
        right: "left"
    },
    right: {
        left: "up",
        right: "down"
    }
};


const moveRobot = (facing: Facing, location: Point, direction: "left" | "right") : {facing: Facing, location: Point} => {
    const rfacing: Facing = facings[facing][direction];

    const x = (rfacing === "left") ? location.x - 1 : (rfacing === "right") ? location.x + 1 : location.x;
    const y = (rfacing === "up") ? location.y + 1 : (rfacing === "down") ? location.y - 1 : location.y;

    const rlocation = new Point(x, y);

    const result = {
        facing : rfacing,
        location: rlocation
    };
    return result;
}

function runSimulation(instructions: number[], debug: boolean, startInput: number) {
    let location = new Point(0, 0);
    let facing: Facing = "up";
    let robotOp: "paint" | "move" = "paint";
    const input = [startInput];
    const simulation = new IntcodeSimulator(instructions.slice(0), input, debug);
    const outputs = [];
    const painted = {};
    simulation.output = (value) => {
        if (robotOp === "paint") {
            if (debug) {
                console.log(`Painting ${location} ${value ? "black" : "white"}`);
            }
            painted[location.toString()] = value;
            robotOp = "move";
        }
        else {
            const moveResult = moveRobot(facing, location, (value === 0) ? "left" : "right");
            if (debug) {
                console.log(`Moving ${facing} from ${location} to ${moveResult.location}, facing ${moveResult.facing}`);
            }
            facing = moveResult.facing;
            location = moveResult.location;
            input.push(painted[location.toString()] || 0);
            robotOp = "paint";
        }
        outputs.push(value);
    };
    simulation.run();
    return painted;
}

const partOne = (instructions: number[], debug: boolean) => {
    const painted = runSimulation(instructions, debug, 0);
    return Object.keys(painted).length;
};

const partTwo = (instructions: number[], debug: boolean) => {
    const painted = runSimulation(instructions, debug, 1);
    const points = Object.keys(painted).map(key => Point.fromString(key));
    const minX = points.min(p => p.x);
    const minY = points.min(p => p.y);
    const maxX = points.max(p => p.x) - minX;
    const maxY = points.max(p => p.y) - minY;
    const image = Array(maxY+1).fill(0).map(_ => Array(maxX+1).fill(0));
    for (const point of points) {
        image[maxY - (point.y - minY)][point.x -minX]= painted[point.toString()];
    }

    printMatrix(image, item => (item === 1) ? "#" : " ");

    return -1;
};

const resultOne = (_: any, result: number) => {
    return `Total number of painted squares is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `See above`;
};

const showInput = (input: number[]) => {
    console.log(input);
};

const test = (input: number[]) => {
    const src = "104,1125899906842624,99";
    const simulator = new IntcodeSimulator(src.split(",").map(c => parseInt(c, 10)), []);
    simulator.run();
};

export const solutionEleven: Puzzle<number[], number> = {
    day: 11,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
