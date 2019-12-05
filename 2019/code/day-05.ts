import { readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const input = await readInput(day);
    const numbers = input.split(",").map(c => parseInt(c, 10));
    return numbers;
};

const partOne = (instructions: number[], debug: boolean) => {
    const memory = instructions.slice();
    const simulator = new IntcodeSimulator(memory, [1]);
    const outputs = [];
    if (!debug) {
        simulator.output = (value: any) => outputs.push(value);
    }
    simulator.run();
    return outputs[outputs.length-1];    
};

const partTwo = (instructions: number[], debug: boolean) => {
    const memory = instructions.slice();
    const simulator = new IntcodeSimulator(memory, [5]);
    const outputs = [];
    if (!debug) {
        simulator.output = (value: any) => outputs.push(value);
    }
    simulator.run();
    return outputs[outputs.length-1];
};

const resultMessage = (_: any, result: number) => {
    return `The diagnostic code is ${result}`;
};

const showInput = (input: number[]) => {
    console.log(input);
};

const test = (input: number[]) => {
    showInput(input);
    // const simulators = [
    //     new IntcodeSimulator([1,0,0,3,99], true),
    //     new IntcodeSimulator([1,0,0,0,99], true),
    //     new IntcodeSimulator([2,3,0,3,99], true),
    //     new IntcodeSimulator([2,4,4,5,99,0], true),
    //     new IntcodeSimulator([1,1,1,4,99,5,6,0,99], true),
    // ]
    // for (const simulator of simulators) {
    //     simulator.run();
    // }
};

export const solutionFive: Puzzle<number[], number> = {
    day: 5,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultMessage,
    resultTwo: resultMessage,
    showInput,
    test,
}

type Mode = "register" | "immediate";

interface Modes {
    first: Mode;
    second: Mode;
}

interface Instruction {
    op: (modes: Modes) => void,
    len: number
}

class IntcodeSimulator {
    private ip = 0;
    private inputIndex = 0;
    private executing = true;
    
    public output = console.log;

    private instructionsDict: { [key: number]: Instruction } = {
        1: {
            op: this.add.bind(this),
            len: 4
        },
        2: {
            op: this.mul.bind(this),
            len: 4
        },
        3: {
            op: this.read.bind(this),
            len: 2
        },
        4: {
            op: this.write.bind(this),
            len: 2
        },
        5: {
            op: this.jumpTrue.bind(this),
            len: 3
        },
        6: {
            op: this.jumpFalse.bind(this),
            len: 3
        },
        7: {
            op: this.lessThan.bind(this),
            len: 4
        },
        8: {
            op: this.equals.bind(this),
            len: 4
        },
        99: {
            op: this.halt.bind(this),
            len: 1
        }
    }


    constructor(private instructions: number[], private inputs: number[], private debug = false) {
    }

    public getInstructionAt(index: number) {
        return this.instructions[index];
    }

    public showState() {
        console.log("----state----")
        console.log(`IP = ${this.ip}`);
        console.log(this.instructions[this.ip]);
        console.log(this.instructions);
    }

    public run() {
        while (this.executing) {
            this.executeStep();
        }
    }

    private parseInstruction(instruction: number) {
        const mode = instruction / 100 | 0;
        const modes: Modes = {
            first: mode % 10 === 1 ? "immediate" : "register",
            second: mode >= 10 ? "immediate" : "register"
        }
        const opcode = instruction % 100;
        return { modes, opcode };
    }

    public executeStep() {
        if (this.debug) {
            this.showState();
        }
        const { modes, opcode } = this.parseInstruction(this.instructions[this.ip]);
        const instruction = this.instructionsDict[opcode];
        instruction.op(modes);
        this.ip += instruction.len;
    }

    private add(modes: Modes) {
        const { first, second } = this.getParamValues(modes);
        const resaddr = this.instructions[this.ip + 3];
        const result = first + second;
        this.instructions[resaddr] = result;
    }

    private mul(modes: Modes) {
        const { first, second } = this.getParamValues(modes);
        const resaddr = this.instructions[this.ip + 3];
        const result = first * second;
        this.instructions[resaddr] = result;
    }

    private getParamValues(modes: Modes) {
        const faddr = this.instructions[this.ip + 1];
        const saddr = this.instructions[this.ip + 2];
        const first = (modes.first === "immediate") ? faddr : this.instructions[faddr];
        const second = (modes.second === "immediate") ? saddr : this.instructions[saddr];
        return { first, second };
    }

    private read(modes: Modes) {
        const to = this.instructions[this.ip + 1];
        const inputValue = this.inputs[this.inputIndex];
        this.inputIndex += 1;
        this.instructions[to] = inputValue;
    }

    private write(modes: Modes) {
        const from = this.instructions[this.ip + 1];
        const value = (modes.first === "immediate") ? from : this.instructions[from];
        this.output(value);
    }

    private jumpTrue(modes: Modes) {
        const { first, second } = this.getParamValues(modes);
        if (first !== 0) {
            this.ip = second - 3;
        }
    }

    private jumpFalse(modes: Modes) {
        const { first, second } = this.getParamValues(modes);
        if (first === 0) {
            this.ip = second - 3;
        }
    }

    private lessThan(modes: Modes) {
        const { first, second } = this.getParamValues(modes);
        const resaddr = this.instructions[this.ip + 3];
        const result = (first < second) ? 1 : 0;
        this.instructions[resaddr] = result;
    }

    private equals(modes: Modes) {
        const { first, second } = this.getParamValues(modes);
        const resaddr = this.instructions[this.ip + 3];
        const result = (first === second) ? 1 : 0;
        this.instructions[resaddr] = result;
    }

    private halt(modes: Modes) {
        this.executing = false;
        if (this.debug) {
            console.log("----Halted----");
        }
    }

}