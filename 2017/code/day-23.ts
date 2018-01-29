import { readInput, readInputLines } from "../extra/aoc-helper";
import { isNumber } from "util";
import { terminal } from "terminal-kit";

type Command = ["set" | "sub" | "mul" | "jnz", any[]];

class Machine {
    commands: Command[] = [];
    registers: { [key: string]: number } = {};
    ip: number = 0;

    mulCount = 0;

    debug: boolean;
    halt: boolean = false;

    constructor() {
    }

    getRegister(name: string) {
        if (this.registers[name] === undefined)
            this.registers[name] = 0;
        return this.registers[name];
    }

    private calcs = {
        "sub": (a, b) => a - b,
        "set": (a, b) => b,
        "mul": (a, b) => a * b
    }

    runCalc(operation: string, register: string, value: string | number) {
        if (operation === "mul") {
            this.mulCount += 1;
        }
        const realvalue = (isNumber(value)) ? value : this.getRegister(value);
        this.registers[register] = this.calcs[operation](this.getRegister(register), realvalue);
    }

    runJumpNonZero(source: string | number, jump: number) {
        const value = (isNumber(source)) ? source : this.getRegister(source);
        const jumpValue = (isNumber(jump)) ? jump : this.getRegister(jump);
        if (value !== 0)
            this.ip += jump - 1;
    }

    runProgram() {
        while (this.ip < this.commands.length) {
            if (this.halt) {
                return;
            }
            const command = this.commands[this.ip];
            if (["sub", "set", "mul"].includes(command[0])) {
                this.runCalc(command[0], command[1][0], command[1][1]);
            } else if (command[0] === "jnz") {
                this.runJumpNonZero(command[1][0], command[1][1]);
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
        console.log(`ip: ${this.ip}`)
    }
}

async function main() {
    let lines = await readInputLines();

    let instructions = lines.map(cmd => parseInstruction(cmd))

    let mulCount = processPartOne(instructions);
    console.log(`Part 1: mul count is ${mulCount}`);

    let hValue = processPartTwo(instructions);
    console.log(`Part 2: value of register h is ${hValue}`);
}

function parseInstruction(instruction: string): Command {
    const calcRegex = /^(mul|set|sub) ([a-z]) (-?\d+|[a-z])$/;
    const jumpRegex = /^jnz (\d+|[a-z]) (-?\d+|[a-z])$/

    let match;
    if (match = instruction.match(calcRegex)) {
        let command: "mul" | "set" | "sub" = match[1];
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
        return ["jnz", [first, second]];
    }
    throw Error(`invalid command  ${instruction}`);
}

function processPartOne(instructions: Command[]) {
    const machine = new Machine();
    machine.debug = false;
    machine.commands = instructions;
    machine.runProgram();

    return machine.mulCount;
}

function isPrime(number) {
    if (number % 2 === 0) return false;
    const limit = Math.sqrt(number);
    let index = 3;
    while (index <= limit) {
        if (number % index === 0)
            return false;
        index += 2;
    }
    return true;
}

function processPartTwo(instructions: Command[]) {

    let b = 106700;
    const c = b + 17000;
    let h = 0;
    while (b <= c + 1) {
        b += 17;
        if (!isPrime(b)) h++;
    }
    return h;
}

main();