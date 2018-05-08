import { readInput, readInputLines } from "../extra/aoc-helper";
import { isNumber } from "util";
import { terminal } from "terminal-kit";

type Command = ["snd" | "set" | "add" | "mul" | "mod" | "rcv" | "jgz", any[]];

class Machine {
    commands: Command[] = [];
    registers: { [key: string]: number } = {};
    ip: number = 0;
    mode: "easy" | "hard";

    // easy mode properties
    sound: number;
    recoverCallback: (value: number) => void;

    // hard mode properties
    programId: number;
    sendCount: number = 0;
    receiveCount: number = 0;
    sendBuffer: number[];
    receiveBuffer: number[];
    suspended: boolean = false;

    debug: boolean;
    halt: boolean = false;

    constructor(options: { mode: "easy" | "hard", id?: number, sendBuffer?: number[], receiveBuffer?: number[] }) {
        this.mode = options.mode;
        if (options.id !== undefined) {
            this.programId = options.id;
            this.registers["p"] = this.programId;
            this.sendBuffer = options.sendBuffer,
                this.receiveBuffer = options.receiveBuffer
        }
    }

    getRegister(name: string) {
        if (this.registers[name] === undefined)
            this.registers[name] = 0;
        return this.registers[name];
    }

    private calcs = {
        "mul": (a, b) => a * b,
        "set": (a, b) => b,
        "add": (a, b) => a + b,
        "mod": (a, b) => a % b
    }

    runCalc(operation: string, register: string, value: string | number) {
        const realvalue = (isNumber(value)) ? value : this.getRegister(value);
        this.registers[register] = this.calcs[operation](this.getRegister(register), realvalue);
    }


    runJumpGreaterZero(source: string | number, jump: string | number) {
        const value = (isNumber(source)) ? source : this.getRegister(source);
        const jumpValue = (isNumber(jump)) ? jump : this.getRegister(jump);
        if (value > 0)
            this.ip += jumpValue - 1;
    }

    runSnd(value: string | number) {
        const realvalue = (isNumber(value)) ? value : this.getRegister(value);
        if (this.mode === "easy") {
            this.sound = realvalue;
        } else {
            // send message
            this.sendCount++;
            this.sendBuffer.push(realvalue);
        }
    }

    runRcv(source: string | number) {
        if (this.mode === "easy") {
            if (this.recoverCallback) {
                const value = (isNumber(source)) ? source : this.getRegister(source);
                if (value !== 0)
                    this.recoverCallback(this.sound);
            }
        } else {
            // receive message
            if (this.receiveBuffer.length <= this.receiveCount) {
                this.suspended = true;
            } else {
                this.suspended = false;
                const message = this.receiveBuffer[this.receiveCount];
                this.receiveCount += 1;
                this.registers[source] = message;
            }
        }
    }

    runProgram() {
        while (this.ip < this.commands.length) {
            if (this.halt) {
                return;
            }
            const command = this.commands[this.ip];
            if (["mul", "set", "add", "mod"].includes(command[0])) {
                this.runCalc(command[0], command[1][0], command[1][1]);
            } else if (command[0] === "jgz") {
                this.runJumpGreaterZero(command[1][0], command[1][1]);
            } else if (command[0] === "snd") {
                this.runSnd(command[1][0]);
            } else if (command[0] === "rcv") {
                this.runRcv(command[1][0]);
            }
            if (this.suspended) {
                return;
            }
            this.ip += 1;
            if (this.debug) {
                this.print(command);
            }
        }
        //this.print();
    }

    print(command?: Command) {
        if (command) {
            console.log("command: ", command);
        }
        console.log(`registers: `, this.registers)
        console.log(`sound: ${this.sound}`)
        console.log(`ip: ${this.ip}`)
    }
}

async function main() {
    let lines = await readInputLines();

    let instructions = lines.map(cmd => parseInstruction(cmd))

    let rcvValue = processPartOne(instructions);
    console.log(`Part 1: recovered sound value is ${rcvValue}`);

    let messageCount = processPartTwo(instructions);
    console.log(`Part 2: program 1 sent ${messageCount} messages`);
}

function parseInstruction(instruction: string): Command {
    const calcRegex = /^(mul|set|add|mod) ([a-z]) (-?\d+|[a-z])$/;
    const jumpRegex = /^jgz (\d+|[a-z]) (-?\d+|[a-z])$/
    const actRegex = /^(snd|rcv) (\d+|[a-z])$/

    let match;
    if (match = instruction.match(calcRegex)) {
        let command: "mul" | "set" | "add" | "mod" = match[1];
        let first = match[2];
        let second = parseInt(match[3]);
        if (isNaN(second)) second = match[3];
        return [command, [first, second]];
    }
    if (match = instruction.match(jumpRegex)) {
        let first = parseInt(match[1]);
        if (isNaN(first)) first = match[1];
        let second = parseInt(match[2]);
        if (isNaN(second)) second = match[2];
        return ["jgz", [first, second]];
    }
    if (match = instruction.match(actRegex)) {
        let second = parseInt(match[2]);
        if (isNaN(second)) second = match[2];
        return [match[1], [second]];
    }
    throw Error(`invalid command  ${instruction}`);
}

function processPartOne(instructions: Command[]) {
    const machine = new Machine({ mode: "easy" });
    let recovered: number;
    machine.debug = false;
    machine.commands = instructions;
    machine.recoverCallback = (sound: number) => {
        recovered = sound;
        machine.halt = true;
    }
    machine.runProgram();

    return recovered;
}

function processPartTwo(instructions: Command[]) {
    const zeroBuffer = [];
    const oneBuffer = [];
    const zero = new Machine({ mode: "hard", id: 0, sendBuffer: zeroBuffer, receiveBuffer: oneBuffer })
    const one = new Machine({ mode: "hard", id: 1, sendBuffer: oneBuffer, receiveBuffer: zeroBuffer });
    zero.commands = instructions;
    one.commands = instructions;
    let stalled = false;
    while (!stalled) {
        const zsc = zero.sendCount;
        zero.runProgram();
        if (zsc === zero.sendCount) {
            console.log(zsc, zero.sendCount);
            stalled = true;
        }
        const osc = one.sendCount;
        one.runProgram();
        if (osc === one.sendCount) {
            stalled = true;
        }
    }

    return one.sendCount;
}

main();