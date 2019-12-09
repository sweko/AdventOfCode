import { readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { getAllPermutations, range } from "../extra/num-helpers";

const processInput = async (day: number) => {
    const input = await readInput(day);
    const numbers = input.split(",").map(c => parseInt(c, 10));
    return numbers;
};

const partOne = (instructions: number[], debug: boolean) => {
    const amps = 5;
    const permutations = getAllPermutations(range(amps));
    let maxValue = 0;
    for (const permutation of permutations) {
        let value = 0;
        for (let index = 0; index < 5; index++) {
            const memory = instructions.slice();
            const input = [permutation[index], value];
            const outputs = [];

            const simulator = new IntcodeSimulator(memory, input);
            simulator.output = (value: any) => outputs.push(value);
            simulator.run();

            value = outputs[outputs.length - 1];
        }
        if (value > maxValue) maxValue = value;
    }
    return maxValue;
};

const partTwo = (instructions: number[], debug: boolean) => {
    const amps = 5;
    const permutations = getAllPermutations(range(amps).map(i => i + 5));
    let maxValue = 0;
    for (const permutation of permutations) {
        let value = 0;
        const simulations = permutation.map((phase, index) => {
            const memory = instructions.slice();
            const input = [phase];
            if (index === 0) {
                input.push(0);
            }
            const output = [];
            const simulator = new IntcodeSimulator(memory, input);
            return {
                phase,
                memory,
                input,
                output,
                simulator
            }
        });

        for (let index = 0; index < simulations.length; index++) {
            const simulation = simulations[index];
            const { simulator, output } = simulation;
            const next = (index === simulations.length - 1)
                ? simulations[0]
                : simulations[index + 1];
            simulator.output = (value: any) => {
                output.push(value);
                next.input.push(value);
                next.simulator.resume();
            };
        };
        
        const isHalted = () => {
            return simulations.every(s => s.simulator.getState() === "halted");
        }

        while (!isHalted()) {
            for (const simulation of simulations) {
                simulation.simulator.run();
            }
        }

        value = simulations.last().output.last();
        if (value > maxValue) maxValue = value;
    }
    return maxValue;
};

const resultMessage = (_: any, result: number) => {
    return `Maximum amplification is ${result}`;
};

const showInput = (input: number[]) => {
    console.log(input);
};

const test = (input: number[]) => {
    //const src = "3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10";
    // const src = "3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5";
    // console.log(partTwo(src.split(",").map(c => parseInt(c, 10)), false));
};

export const solutionSeven: Puzzle<number[], number> = {
    day: 7,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultMessage,
    resultTwo: resultMessage,
    showInput,
    test,
}

type Mode = "register" | "immediate";
type State = "running" | "suspended" | "halted";

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
    private state: State = "running";

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

    public getState() {
        return this.state;
    }

    public resume() {
        if (this.state === "suspended")
            this.state = "running";
    }

    public showState() {
        console.log("----state----")
        console.log(`IP = ${this.ip}`);
        console.log(this.instructions[this.ip]);
        console.log(this.instructions);
    }

    public run() {
        while (this.state === "running") {
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
        if (this.inputIndex === this.inputs.length) {
            this.state = "suspended";
            this.ip -= 2;
            return;
        }
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
        this.state = "halted";
        if (this.debug) {
            console.log("----Halted----");
        }
    }

}