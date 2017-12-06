import { readInput, readInputLines } from "../extra/aoc-helper";
import { isNumber, debug } from "util";
import { terminal } from "terminal-kit";
import { setTimeout } from "timers";

type Command = ["cpy" | "inc" | "dec" | "jnz" | "tgl" | "noop", any[]];

class Machine {
    a: number = 0;
    b: number = 0;
    c: number = 0;
    d: number = 0;
    ip: number = 0;
    totalCalls: number = 0;

    commands: Command[] = [];

    debug: boolean;

    runCopy(source: string | number, destination: string | number) {
        if (isNumber(destination))
            return;
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

    runJumpNonZero(source: string | number, jump: string | number) {
        const value = (isNumber(source)) ? source : this[source];
        const distance = (isNumber(jump)) ? jump : this[jump];
        if (value !== 0)
            this.ip += distance - 1;
    }

    runToggle(source: string | number) {

        const value = (isNumber(source)) ? source : this[source];
        const command = this.commands[this.ip + value];
        if (!command) {
            console.log("toggling out of bound command", source, value);
            this.print();
            return;
        }
        console.log("toggling command", command, value)
        this.print();
        if (["tgl", "dec"].includes(command[0])) {
            command[0] = "inc";
        } else if (command[0] === "inc") {
            command[0] = "dec"
        } else if (command[0] === "jnz") {
            command[0] = "cpy"
        } else if (command[0] === "cpy") {
            command[0] = "jnz"
        }
        console.log("toggled  command", command, value)
    }

    runNoop() { }

    async runProgram() {
        this.totalCalls = 0;
        this.ip = 0;
        while (this.ip < this.commands.length) {
            const command = this.commands[this.ip];
            if (command[0] === "cpy") {
                this.runCopy(command[1][0], command[1][1])
            } else if (command[0] === "inc") {
                this.runInc(command[1][0]);
            } else if (command[0] === "dec") {
                this.runDec(command[1][0]);
            } else if (command[0] === "jnz") {
                this.runJumpNonZero(command[1][0], command[1][1]);
            } else if (command[0] === "tgl") {
                this.runToggle(command[1][0])
            } else if (command[0] === "noop") {
                this.runNoop();
            }
            if (this.debug){
                console.log(command, "                               ");
                this.print();
                terminal.previousLine(7);
                await delay();
            }
            this.ip += 1;
            this.totalCalls += 1;
            if (this.totalCalls % 123457 === 0) {
                console.log(`calls so far: ${this.totalCalls}`)
                terminal.previousLine();
            }
        }
    }

    print() {
        console.log(`a: ${this.a}      `)
        console.log(`b: ${this.b}      `)
        console.log(`c: ${this.c}      `)
        console.log(`d: ${this.d}      `)
        console.log(`ip: ${this.ip}      `)
        console.log(`totalCalls: ${this.totalCalls}`)
    }
}

async function main() {
    let lines = await readInputLines();

    let instructions = lines.map(cmd => parseInstruction(cmd))

    let avalue = await processPartOne(instructions);
    console.log(`Part 1: value of register a is ${avalue}`);

    instructions = lines.map(cmd => parseInstruction(cmd))
    avalue = await processPartTwo(instructions);
    console.log(`Part 2: value of register a is ${avalue}`);
}

async function delay(ms: number = 100) {
    return new Promise(r => {
        setTimeout(() => {
            r();
        }, ms);
    })
}

function parseInstruction(instruction: string): Command {
    const cpyRegex = /^cpy (-?\d+|[abcd]) ([abcd])$/;
    const incRegex = /^inc ([abcd])$/
    const decRegex = /^dec ([abcd])$/
    const jnzRegex = /^jnz ([abcd]|\d+) (-?\d+|[abcd])$/
    const tglRegex = /^tgl ([abcd])$/
    const noopRegex = /^noop/

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
        if (isNaN(second)) second = match[2];
        return ["jnz", [first, second]];
    }
    if (match = instruction.match(tglRegex)) {
        return ["tgl", [match[1]]];
    }
    if (match = instruction.match(noopRegex)) {
        return ["noop", []];
    }
    throw Error(`invalid command ${instruction}`);
}

async function processPartOne(instructions: Command[]) {
    const machine = new Machine();
    machine.a = 7;
    machine.commands = instructions;
    //machine.debug = true;
    await machine.runProgram();
    machine.print();
    return machine.a;
}

async function processPartTwo(instructions: Command[]) {
    const machine = new Machine();
    machine.a = 12;
    machine.commands = instructions;
    //machine.debug = true;
    await machine.runProgram();
    machine.print();
    return machine.a;
}

main();