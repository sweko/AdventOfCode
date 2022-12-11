import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { printMatrix } from "../extra/terminal-helper";
import { Puzzle } from "./model";

//type Instruction = "add" | "noop";

interface AddCommand {
    instruction: "add";
    value: number;
}

interface NoopCommand {
    instruction: "noop";
}

type Command = AddCommand | NoopCommand;

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const input = lines.map(line => {
        if (line === "noop") {
            return { instruction: "noop" } as NoopCommand;
        }
        const value = parseInt(line.substring(5), 10);
        return { instruction: "add", value } as AddCommand;
    });
    return input;
};

const partOne = (input: Command[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const device = { x: 1 };
    let counter = 0;
    let result = 0;

    const points = [20, 60, 100, 140, 180, 220];
    let point = points.shift();

    for (const command of input) {
        if (command.instruction === "noop") {
            counter += 1;
            continue;
        }
        counter += 2;
        if (counter >= point) {
            //console.log(`During cycle ${counter} the register is at ${device.x}`);
            result += point * device.x;
            point = points.shift();
            if (point === undefined) {
                break;
            }
        }

        device.x += command.value;
    }

    return result;
};

const partTwo = (input: Command[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const result: string[][] = Array(6).fill(0).map(_ => Array(40).fill("."));

    let cycle = 0;

    const values = Array(241).fill(0);
    const device = { x: 1 };

    for (const command of input) {
        if (command.instruction === "noop") {
            cycle += 1;
            values[cycle] = device.x;
        } else {
            cycle += 2;
            values[cycle - 1] = device.x;
            values[cycle] = device.x;
            device.x += command.value;
        }
    }

    for (let index = 1; index < values.length; index++) {
        const row = Math.floor((index-1) / 40);
        const col = (index-1) % 40;
        const char = (Math.abs(col - values[index]) <= 1) ? "#" : " ";
        result[row][col] = char;
    }

    printMatrix(result);

    return 0;
};

const resultOne = (_: Command[], result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: Command[], result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Command[]) => {
    console.log(input);
};

const test = (_: Command[]) => {
    console.log("----Test-----");
};

export const solutionTen: Puzzle<Command[], number> = {
    day: 10,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
