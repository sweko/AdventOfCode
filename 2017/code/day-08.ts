import { readInput, readInputLines } from "../extra/aoc-helper";
import { isNumber } from "util";

//type Command = ["cpy" | "inc" | "dec" | "jnz", any[]];

type Operator = "<" | ">" | "<=" | ">=" | "!=" | "==";

interface Command {
    register: string;
    type: "inc" | "dec";
    setValue: number;
    compare: string;
    operator: Operator;
    cmpValue: number;
}

class Machine {
    state: { [key: string]: number } = {};
    ip: number = 0;
    maxRegisterValue: number = 0;

    getState(regName: string) {
        return this.state[regName] || 0;
    };

    setState(regName: string, value: number, type: "inc" | "dec") {
        const current = this.getState(regName);
        const mul = type === "inc" ? +1 : -1;
        this.state[regName] = current + mul * value;
    }

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

    static operations: { [key: string]: (a: number, b: number) => boolean } = {
        "<": (a: number, b: number) => a < b,
        "<=": (a: number, b: number) => a <= b,
        ">": (a: number, b: number) => a > b,
        ">=": (a: number, b: number) => a >= b,
        "==": (a: number, b: number) => a === b,
        "!=": (a: number, b: number) => a !== b
    }

    runCommand(command: Command) {
        const compareValue = this.getState(command.compare);
        if (Machine.operations[command.operator](compareValue, command.cmpValue)) {
            this.setState(command.register, command.setValue, command.type);
        }
        this.maxRegisterValue = Math.max(this.maxRegisterValue, ...Object.keys(this.state).map(key => this.state[key]));
    }

    runProgram() {
        while (this.ip < this.commands.length) {
            const command = this.commands[this.ip];
            this.runCommand(command)
            this.ip += 1;
        }
    }

    print() {
        Object.keys(this.state).forEach(key => console.log(`${key}: ${this.state[key]}`))
        console.log(`ip: ${this.ip}`);
    }
}

async function main() {
    let lines = await readInputLines();

    let instructions = lines.map(cmd => parseInstruction(cmd));

    console.time("Part 1");
    let avalue = processPartOne(instructions);
    console.timeEnd("Part 1");
    console.log(`Part 1: Max register value at completion is ${avalue}`);

    console.time("Part 2");
    avalue = processPartTwo(instructions);
    console.timeEnd("Part 2");
    console.log(`Part 2: max register value in execution is ${avalue}`);
}

function parseInstruction(instruction: string): Command {
    const cmdRegex = /^(\w+) (dec|inc) (-?\d+) if (\w+) ([><=!]=?) (-?\d+)$/;

    let match;
    if (match = instruction.match(cmdRegex)) {
        const register = match[1];
        const type = match[2];
        const setValue = parseInt(match[3]);
        const compare = match[4];
        const operator = match[5];
        const cmpValue = parseInt(match[6]);;
        return <Command>{
            register: register,
            type: type,
            setValue: setValue,
            compare: compare,
            operator: operator,
            cmpValue: cmpValue
        };
    }
    throw Error("invalid command");
}

function processPartOne(instructions: Command[]) {
    const machine = new Machine()
    machine.commands = instructions;
    machine.runProgram();
    return Math.max(...Object.keys(machine.state).map(key => machine.state[key]));
}

function processPartTwo(instructions: Command[]) {
    const machine = new Machine()
    machine.commands = instructions;
    machine.runProgram();
    return machine.maxRegisterValue;
}

main();