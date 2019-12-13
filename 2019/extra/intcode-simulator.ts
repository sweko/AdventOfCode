export type Mode = "register" | "immediate" | "relative";
export type State = "running" | "suspended" | "halted";

interface Modes {
    first: Mode;
    second: Mode;
    third: Mode;
}

interface Instruction {
    name: string;
    op: (modes: Modes) => void;
    len: number;
}

export class IntcodeSimulator {
    private ip = 0;
    private inputIndex = 0;
    private state: State = "running";
    private relativeBase = 0;

    public output: (value: number) => void = console.log;

    private instructionsDict: { [key: number]: Instruction } = {
        1: {
            name: "add",
            op: this.add.bind(this),
            len: 4
        },
        2: {
            name: "mul",
            op: this.mul.bind(this),
            len: 4
        },
        3: {
            name: "rdi",
            op: this.read.bind(this),
            len: 2
        },
        4: {
            name: "out",
            op: this.write.bind(this),
            len: 2
        },
        5: {
            name: "jmt",
            op: this.jumpTrue.bind(this),
            len: 3
        },
        6: {
            name: "jmf",
            op: this.jumpFalse.bind(this),
            len: 3
        },
        7: {
            name: "ltn",
            op: this.lessThan.bind(this),
            len: 4
        },
        8: {
            name: "eql",
            op: this.equals.bind(this),
            len: 4
        },
        9: {
            name: "rlb",
            op: this.setBase.bind(this),
            len: 2
        },
        99: {
            name: "hlt",
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
        if (this.state === "suspended") {
            if (this.debug) {
                console.log("----Resuming----");
            }
            this.state = "running";
        }
    }

    public run() {
        while (this.state === "running") {
            this.executeStep();
        }
    }

    private modes: Mode[] = ["register", "immediate", "relative"];

    private parseInstruction(instruction: number) {
        const mode = instruction / 100 | 0;

        const modes: Modes = {
            first: this.modes[mode % 10],
            second: this.modes[(mode / 10 | 0) % 10],
            third: this.modes[mode / 100 | 0]
        }
        const opcode = instruction % 100;
        return { modes, opcode };
    }

    public executeStep() {
        const { modes, opcode } = this.parseInstruction(this.instructions[this.ip]);
        const instruction = this.instructionsDict[opcode];
        if (this.debug) {
            console.log(`IP: ${this.ip} - Executing ${instruction.name} with mode ${JSON.stringify(modes)} - ${this.instructions[this.ip]}`);
        }
        instruction.op(modes);
        this.ip += instruction.len;
    }


    private getParamValue(mode: Mode, value: number) {
        if (mode === "immediate") {
            return value;
        } else if (mode === "register") {
            return this.instructions[value] || 0;
        } else {
            return this.instructions[value + this.relativeBase] || 0;
        }
    }

    private getParamValues(modes: Modes) {
        const first = this.getParamValue(modes.first, this.instructions[this.ip + 1]);
        const second = this.getParamValue(modes.second, this.instructions[this.ip + 2]);
        return { first, second };
    }

    private getResultLocation(mode: Mode, offset: number) {
        if (mode === "immediate") {
            throw Error("Result must not be immediate");
        };
        const value = this.instructions[this.ip + offset];
        if (mode === "register") {
            return value;
        } else {
            return this.relativeBase + value;
        }
    }

    private add(modes: Modes) {
        const { first, second } = this.getParamValues(modes);
        const resaddr = this.getResultLocation(modes.third, 3);
        const result = first + second;
        this.instructions[resaddr] = result;
    }

    private mul(modes: Modes) {
        const { first, second } = this.getParamValues(modes);
        const resaddr = this.getResultLocation(modes.third, 3);
        const result = first * second;
        this.instructions[resaddr] = result;
    }

    private read(modes: Modes) {
        if (this.debug) {
            //slow it up
            let sum: number;
            for (let i = 0; i < 40000000; i++) {
                sum += i;
            }
            if (sum === 0) {
                return;
            }
        }

        const to = this.getResultLocation(modes.first, 1);
        if (this.inputIndex === this.inputs.length) {
            this.state = "suspended";
            if (this.debug) {
                console.log("----Suspended----");
            }
            this.ip -= 2;
            return;
        }
        const inputValue = this.inputs[this.inputIndex];
        this.inputIndex += 1;
        this.instructions[to] = inputValue;
    }

    private write(modes: Modes) {
        const { first } = this.getParamValues(modes);
        this.output(first);
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
        const resaddr = this.getResultLocation(modes.third, 3);
        const result = (first < second) ? 1 : 0;
        this.instructions[resaddr] = result;
    }

    private equals(modes: Modes) {
        const { first, second } = this.getParamValues(modes);
        const resaddr = this.getResultLocation(modes.third, 3);
        const result = (first === second) ? 1 : 0;
        this.instructions[resaddr] = result;
    }

    private setBase(modes: Modes) {
        const { first } = this.getParamValues(modes);
        this.relativeBase += first;
    }

    private halt(modes: Modes) {
        this.state = "halted";
        if (this.debug) {
            console.log("----Halted----");
        }
    }

}