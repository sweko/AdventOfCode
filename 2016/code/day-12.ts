import { readInput, readInputLines } from "../extra/aoc-helper";
import { isNumber } from "util";

type Command = ["cpy" | "inc" | "dec" | "jnz", any[]];

class Machine {
    a: number = 0;
    b: number = 0;
    c: number = 0;
    d: number = 0;
    ip: number = 0;

    commands: Command[] = [];

    debug: boolean;

    runCopy(source: string | number, destination: string) {
        if (isNumber(source)) {
            this[destination] = source;
        } else {
            this[destination] = this[source]
        }
    }

    runInc(register: string) {
        this[register] += 1;
    }

    runDec(register: string) {
        this[register] -= 1;
    }

    runJumpNonZero(source: string | number, jump: number) {
        const value = (isNumber(source)) ? source : this[source];
        if (value !== 0)
            this.ip += jump - 1;
    }

    runProgram() {
        while (this.ip < this.commands.length) {
            const command = this.commands[this.ip];
            if (command[0] === "cpy") {
                this.runCopy(command[1][0], command[1][1])
            } else if (command[0] === "inc"){
                this.runInc(command[1][0]);
            } else if (command[0] === "dec") {
                this.runDec(command[1][0]);
            } else {
                this.runJumpNonZero(command[1][0], command[1][1]);
            }
            this.ip += 1;
        }
        //this.print();
    }

    print() {
        console.log(`a: ${this.a}`)
        console.log(`b: ${this.b}`)
        console.log(`c: ${this.c}`)
        console.log(`d: ${this.d}`)
        console.log(`ip: ${this.ip}`)
    }
}

async function main() {
    let lines = await readInputLines();

    let instructions = lines.map(cmd => parseInstruction(cmd))

    let avalue = processPartOne(instructions);
    console.log(`Part 1: value of register a is ${avalue}`);

    avalue = processPartTwo(instructions);
    console.log(`Part 2: value of register a is ${avalue}`);
}

function parseInstruction(instruction: string): Command {
    const cpyRegex = /^cpy (\d+|[abcd]) ([abcd])$/;
    const incRegex = /^inc ([abcd])$/
    const decRegex = /^dec ([abcd])$/
    const jnzRegex = /^jnz ([abcd]|\d) (-?\d+)$/

    let match;
    if (match = instruction.match(cpyRegex)) {
        let first = parseInt(match[1]);
        if (isNaN(first)) first = match[1];
        return ["cpy", [first, match[2]]];
    }
    if (match = instruction.match(incRegex)) {
        return ["inc", [match[1]]];
    }
    if (match = instruction.match(decRegex)) {
        return ["dec", [match[1]]];
    }
    if (match = instruction.match(jnzRegex)) {
        let first = parseInt(match[1]);
        if (isNaN(first)) first = match[1];
        let second = parseInt(match[2]);
        return ["jnz", [first, second]];
    }
    throw Error("invalid command");
}

function processPartOne(instructions: Command[]) {
    const machine = new Machine()
    machine.commands = instructions;
    machine.runProgram();
    return machine.a;
}

function processPartTwo(instructions: Command[]) {
    const machine = new Machine()
    machine.c = 1;
    machine.commands = instructions;
    machine.runProgram();
    return machine.a;
}

main();