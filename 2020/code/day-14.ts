import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface SetCommand {
    kind: 'set'
    address: number;
    value: number;
}

type MaskState = "0" | "1" | "X";

interface MaskCommand {
    kind: 'mask'
    mask: MaskState[]
}

type Command = SetCommand | MaskCommand;

interface Computer {
    state: number[],
    mask: MaskState[]
}

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    const memRegex = /^mem\[(\d+)\] = (\d+)$/;
    return input.map(line => {
        if (line.startsWith("mask")) {
            return { 
                kind: 'mask',
                mask: line.slice(7).split("") 
            }
        } else {
            const match = line.match(memRegex);
            return {
                kind: 'set',
                address: +match[1],
                value: +match[2]
            }
        }
    }) as Command[];
};

const processCommand = (computer: Computer, command: Command): Computer => {
    const result = {
        state: computer.state.slice(),
        mask: computer.mask.slice()
    }
    if (command.kind === "mask") {
        result.mask = command.mask.slice();
    } else {
        const bits = command.value.toString(2).padStart(36, "0").split("").map((bit, index) => result.mask[index] === "X" ? bit :result.mask[index]);
        const value = parseInt(bits.join(""), 2);
        result.state[command.address] = value;
    }

    return result;
}

const showComputer = ({mask, state}: Computer) => {
    console.log("MASK: ", mask.join(""));
    console.log("STATE:");
    for (const key of Object.keys(state)) {
        console.log(`${key}: ${state[key]}`);
    };
}



const partOne = (input: Command[], debug: boolean) => {
    let computer: Computer = {
        state: [],
        mask: new Array(36).fill("X")
    };
    
    for (const command of input) {
        computer = processCommand(computer, command);
        // showComputer(computer);
    }

    return Object.keys(computer.state).map(key => computer.state[key]).sum();
};


const partTwo = (input: Command[], debug: boolean) => {
    for (const command of input) {
        if (command.kind === "mask") {
            console.log(command.mask.join(""));
            console.log(command.mask.filter(bit => bit === "X").length);
            
        }
    }
    return 0;
};

const result = (_: any, result: number) => {
    return `The wait time by the line number is ${result}`;
};

const showInput = (input: Command[]) => {
    console.log(input);
};

const test = (_: Command[]) => {
    console.log("----Test-----");
};

export const solutionFourteen: Puzzle<Command[], number> = {
    day: 14,
    input: processInput,
    partOne,
    partTwo: partTwo,
    resultOne: result,
    resultTwo: result,
    showInput,
    test,
}
