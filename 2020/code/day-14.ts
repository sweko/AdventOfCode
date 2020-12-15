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
    state: {[key: number] : number},
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

const processCommandOne = (computer: Computer, command: Command): Computer => {
    const result = {
        state: {...computer.state},
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
        state: {},
        mask: new Array(36).fill("X")
    };
    
    for (const command of input) {
        computer = processCommandOne(computer, command);
        // showComputer(computer);
    }

    return Object.keys(computer.state).map(key => computer.state[key]).sum();
};

const processCommandTwo = (computer: Computer, command: Command): Computer => {
    const result = {
        state: computer.state,
        mask: computer.mask.slice()
    }

    if (command.kind === "mask") {
        result.mask = command.mask.slice();
    } else {
        const bits = command.address.toString(2).padStart(36, "0").split("")
            .map((bit, index) => result.mask[index] === "0" ? bit :result.mask[index]);

        const addresses = [bits];
        while (addresses[0].indexOf("X") !== -1) {
            const target = addresses.shift();
            const xloc = target.indexOf("X");
            addresses.push(
                [...target.slice(0,xloc), "0", ...target.slice(xloc+1)],
                [...target.slice(0,xloc), "1", ...target.slice(xloc+1)]
            );
        }

        for (const address of addresses) {
            result.state[parseInt(address.join(""), 2)] = command.value;
        }
    }

    return result;
}


const partTwo = (input: Command[], debug: boolean) => {
    let computer: Computer = {
        state: {},
        mask: new Array(36).fill("X")
    };
    
    for (const command of input) {
        computer = processCommandTwo(computer, command);
        // showComputer(computer);
    }

    const sum =  Object.keys(computer.state).map(key => computer.state[key]).sum();
    return sum;
};

const result = (_: any, result: number) => {
    return `The sum of all addresses is ${result}`;
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
