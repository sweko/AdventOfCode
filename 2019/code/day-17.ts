import { readInput, loopMatrix } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { IntcodeSimulator } from "../extra/intcode-simulator";
import { printMatrix } from "../extra/terminal-helper";

const processInput = async (day: number) => {
    const input = await readInput(day);
    return input.split(",").map(c => Number(c));
};

const partOne = (instructions: number[], debug: boolean) => {
    const input: number[] = [];
    const scaffolding: string[][] = [[]];
    const simulator = new IntcodeSimulator(instructions.slice(), input, false);
    simulator.output = value => {
        var char = String.fromCharCode(value);
        //process.stdout.write(char);
        if (char === "\n") {
            scaffolding.push([]);
        } else {
            scaffolding.last().push(char);
        }
    }
    simulator.run();
    scaffolding.pop();
    scaffolding.pop();
    loopMatrix(scaffolding, (row, column, char) => {
        if (char !== "#") return;
        if (!scaffolding[row - 1]) return;
        if (!scaffolding[row + 1]) return;
        if (scaffolding[row - 1][column] !== "#") return;
        if (scaffolding[row + 1][column] !== "#") return;
        if (scaffolding[row][column - 1] !== "#") return;
        if (scaffolding[row][column + 1] !== "#") return;
        scaffolding[row][column] = "O";
    });
    if (debug) {
        printMatrix(scaffolding);
    }

    const result = scaffolding.sum((row, rindex) => row.sum((item, cindex) => item === "O" ? cindex * rindex : 0));

    return result;
};

const getCommandString = (scaffolding: string[][]): string[] => {
    // find robot
    let robot;
    const result = [];
    loopMatrix(scaffolding, (row, column, item) => {
        if (["^", "v", "<", ">"].includes(item)) {
            robot = { x: row, y: column, d: item };
        }
    });
    // has up?
    if (scaffolding[robot.x - 1][robot.y] === "#") {
        if (robot.d === ">") result.push("L");
        if (robot.d === "<") result.push("R");
        if (robot.d === "v") result.push("LL");
    }
    // has down?
    if (scaffolding[robot.x + 1][robot.y] === "#") {
        if (robot.d === ">") result.push("R");
        if (robot.d === "<") result.push("L");
        if (robot.d === "^") result.push("LL");
    }
    // has left?
    if (scaffolding[robot.x][robot.y - 1] === "#") {
        if (robot.d === ">") result.push("RR");
        if (robot.d === "v") result.push("R");
        if (robot.d === "^") result.push("L");
    }
    // has right?
    if (scaffolding[robot.x][robot.y + 1] === "#") {
        if (robot.d === "<") result.push("RR");
        if (robot.d === "v") result.push("L");
        if (robot.d === "^") result.push("R");
    }
    return result;
}

const fromAscii = (command: string) => (command + "\n").split("").map(c => c.charCodeAt(0));

const partTwo = (instructions: number[], debug: boolean) => {
    instructions[0] = 2;

    const input: number[] = [];
    // totally manually hardcoded
    const main = "A,B,A,B,C,C,B,A,B,C";
    input.push(...fromAscii(main));
    const a = "L,8,R,12,R,12,R,10";
    input.push(...fromAscii(a));
    const b = "R,10,R,12,R,10";
    input.push(...fromAscii(b));
    const c = "L,10,R,10,L,6";
    input.push(...fromAscii(c));
    const video = debug ? "y" : "n";
    input.push(...fromAscii(video));
    let result = -1;

    const scaffolding: string[][] = [[]];
    const simulator = new IntcodeSimulator(instructions.slice(), input, false);
    let preventer = false;
    simulator.output = value => {
        if (value > 255) {
            result = value;
            return;
        }
        var char = String.fromCharCode(value);
        if (debug) {
            process.stdout.write(char);
        }
        if (char === "\n") {
            if (preventer && debug) {
                process.stdout.write("\u001b[f");
            }
            preventer = true;
            scaffolding.push([]);
        } else {
            preventer = false;
            scaffolding.last().push(char);
        }
    }
    simulator.run();
    scaffolding.pop();
    scaffolding.pop();

    return result;
};

const resultOne = (_: any, result: number) => {
    return `The sum of the alignment parameters is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Total ammount of dust collected is ${result}`;
};

const showInput = (input: number[]) => {
    console.log(input);
};

const test = (_: number[]) => {
    console.log("----Test-----");
};

export const solution17: Puzzle<number[], number> = {
    day: 17,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
