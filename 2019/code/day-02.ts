import { readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const input = await readInput(day);
    const numbers = input.split(",").map(c => parseInt(c, 10));
    return numbers;
};

const partOne = (instructions: number[]) => {
    const memory = instructions.slice();
    memory[1]=12;
    memory[2]=2;
    const simulator = new IntcodeSimulator(memory);
    simulator.run();
    return simulator.getInstructionAt(0);
};

const partTwo = (instructions: number[]) => {
    const target = 19690720;
    for (let noun=0; noun<100; noun+=1) {
        for (let verb=0; verb<100; verb+=1) {
            const memory = instructions.slice();
            memory[1]=noun;
            memory[2]=verb;
            const simulator = new IntcodeSimulator(memory);
            simulator.run();
            const result = simulator.getInstructionAt(0);
            //console.log(`Noun: ${noun}, Verb: ${verb}, Result: ${result}`);
            if (result === target) {
                return 100*noun+verb;
            }
        }    
    }
    return -1;
};

const resultOne = (_: any, result: number) => {
    return `Value at position zero is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The noun/verb value is ${result}`;
};


const showInput = (input: number[]) => {
    console.log(input);
};

const test = () => {
    const simulators = [
        new IntcodeSimulator([1,0,0,3,99], true),
        new IntcodeSimulator([1,0,0,0,99], true),
        new IntcodeSimulator([2,3,0,3,99], true),
        new IntcodeSimulator([2,4,4,5,99,0], true),
        new IntcodeSimulator([1,1,1,4,99,5,6,0,99], true),
    ]
    for (const simulator of simulators) {
        simulator.run();
    }
};

export const solutionTwo: Puzzle<number[], number> = {
    day: 2,
    input: processInput,
    partOne,
    partTwo,
    resultOne,
    resultTwo,
    showInput,
    test,
}


class IntcodeSimulator {
    private ip = 0;
    private executing = true;

    private instructionsDict: {[key:number]:() => void} = {
        1: this.add.bind(this),
        2: this.mul.bind(this),
        99: this.halt.bind(this)
    }

    constructor(private instructions: number[], private debug = false) {
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

    public executeStep() {
        if (this.debug) {
            this.showState();
        }
        this.instructionsDict[this.instructions[this.ip]]();
        this.ip +=4;
    }

    private add() {
        const faddr = this.instructions[this.ip+1];
        const saddr = this.instructions[this.ip+2];
        const resaddr = this.instructions[this.ip+3];
        const result = this.instructions[faddr] + this.instructions[saddr]
        this.instructions[resaddr] = result;
    }

    private mul() {
        const faddr = this.instructions[this.ip+1];
        const saddr = this.instructions[this.ip+2];
        const resaddr = this.instructions[this.ip+3];
        const result = this.instructions[faddr] * this.instructions[saddr]
        this.instructions[resaddr] = result;
    }

    private halt() {
        this.executing = false;
        if (this.debug) {
            console.log("----Halted----");
        }
    }

}