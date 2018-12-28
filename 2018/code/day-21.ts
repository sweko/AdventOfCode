import { performance } from "perf_hooks";
import "../extra/array-helpers";
import { readInputLines } from "../extra/aoc-helper";
import { generateModuloPrinter, printRow } from "../extra/terminal-helper";
import { terminal } from "terminal-kit";

type Registers = [number, number, number, number, number, number];

interface Instruction {
    opcode: String;
    a: number,
    b: number,
    c: number;
}

type Program = {
    ipIndex: number;
    instructions: Instruction[]
}

interface Operation {
    mnemonic: string,
    operation: (state: Registers, a: number, b: number, c: number) => Registers,
    rewrite: (a: number, b: number, c: number) => string;
}

async function main() {
    const startInput = performance.now();

    const lines = await readInputLines();
    const program = processLines(lines);

    const endInput = performance.now();
    console.log(`Running time for input is ${Math.round(endInput - startInput)}ms`);

    const startOne = performance.now();
    let regZero = processPartOne(program);
    const endOne = performance.now();

    console.log(`Part 1: Register zero has value of ${regZero}`);
    console.log(`Running time for part 1 is ${Math.round(endOne - startOne)}ms`);

    const startTwo = performance.now();
    regZero = processPartTwo(program);
    const endTwo = performance.now();

    console.log(`Part 2: Register zero has value of ${regZero}`);
    console.log(`Running time for part 2 is ${Math.round(endTwo - startTwo)}ms`);
}

function processLines(lines: string[]): Program {
    const ipIndex = Number(lines.shift().slice(4, 5));

    const instructions = lines.map(line => line.match(/^(\w{4}) (\d+) (\d+) (\d+)$/)).map(command => ({
        opcode: command[1],
        a: Number(command[2]),
        b: Number(command[3]),
        c: Number(command[4])
    }));

    return {
        ipIndex,
        instructions
    }
}

const opcodes: Operation[] = [
    {
        mnemonic: "addr",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] + result[b];
            return result;
        },
        rewrite: (a: number, b: number, c: number) => {
            if (a === c) {
                return `r${c} += r${b}`;
            }
            if (b === c) {
                return `r${c} += r${a}`;
            }
            return `r${c} = r${a} + r${b}`;
        }
    },
    {
        mnemonic: "addi",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] + b;
            return result;
        },
        rewrite: (a: number, b: number, c: number) => {
            if (a === c) {
                return `r${c} += ${b}`;
            }
            return `r${c} = r${a} + r${b}`;
        }
    },
    {
        mnemonic: "mulr",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] * result[b];
            return result;
        },
        rewrite: (a: number, b: number, c: number) => {
            if (a === c) {
                return `r${c} *= r${b}`;
            }
            if (b === c) {
                return `r${c} *= r${a}`;
            }
            return `r${c} = r${a} * r${b}`;
        }
    },
    {
        mnemonic: "muli",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] * b;
            return result;
        },
        rewrite: (a: number, b: number, c: number) => {
            if (a === c) {
                return `r${c} *= ${b}`;
            }
            return `r${c} = r${a} * r${b}`;
        }
    },
    {
        mnemonic: "banr",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] & result[b];
            return result;
        },
        rewrite: (a: number, b: number, c: number) => {
            return "NOT IMPLEMENTED";
        }
    },
    {
        mnemonic: "bani",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] & b;
            return result;
        },
        rewrite: (a: number, b: number, c: number) => {
            return "NOT IMPLEMENTED";
        }
    },
    {
        mnemonic: "borr",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] | result[b];
            return result;
        },
        rewrite: (a: number, b: number, c: number) => {
            return "NOT IMPLEMENTED";
        }
    },
    {
        mnemonic: "bori",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] | b;
            return result;
        },
        rewrite: (a: number, b: number, c: number) => {
            return "NOT IMPLEMENTED";
        }
    },
    {
        mnemonic: "setr",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a];
            return result;
        },
        rewrite: (a: number, b: number, c: number) => {
            return `r${c} = r${a}`;
        }
    },
    {
        mnemonic: "seti",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = a;
            return result;
        },
        rewrite: (a: number, b: number, c: number) => {
            return `r${c} = ${a}`;
        }
    },
    {
        mnemonic: "gtir",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = a > result[b] ? 1 : 0;
            return result;
        },
        rewrite: (a: number, b: number, c: number) => {
            return "NOT IMPLEMENTED";
        }
    },
    {
        mnemonic: "gtri",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] > b ? 1 : 0;
            return result;
        },
        rewrite: (a: number, b: number, c: number) => {
            return "NOT IMPLEMENTED";
        }
    },
    {
        mnemonic: "gtrr",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] > result[b] ? 1 : 0;
            return result;
        },
        rewrite: (a: number, b: number, c: number) => {
            return `r${c} = r${a} > r${b} ? 1 : 0;`;
        }
    },
    {
        mnemonic: "eqir",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = a === result[b] ? 1 : 0;
            return result;
        },
        rewrite: (a: number, b: number, c: number) => {
            return "NOT IMPLEMENTED";
        }
    },
    {
        mnemonic: "eqri",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] === b ? 1 : 0;
            return result;
        },
        rewrite: (a: number, b: number, c: number) => {
            return "NOT IMPLEMENTED";
        }
    },
    {
        mnemonic: "eqrr",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] === result[b] ? 1 : 0;
            return result;
        },
        rewrite: (a: number, b: number, c: number) => {
            return `r${c} = r${a} === r${b} ? 1 : 0`
        }
    }
]

function processPartOne(program: Program): number {
    let state: Registers = [0, 0, 0, 0, 0, 0];
    const { ipIndex, instructions } = program;
    let ip = 0;
    let runLength = 0;
    const printer = generateModuloPrinter(1000);
    while (ip < instructions.length) {
        const instruction = instructions[ip];
        state[ipIndex] = ip;
        const operation = opcodes.find(opcode => opcode.mnemonic === instruction.opcode);
        state = operation.operation(state, instruction.a, instruction.b, instruction.c);
        ip = state[ipIndex] + 1;
        runLength += 1;
        printer.print(runLength, runLength, state);
    }
    console.log(runLength, state);
    return state[0];
}

function rewrite(program: Program) {
    const { ipIndex, instructions } = program;
    const rewrites = [];
    for (const instruction of instructions) {
        const operation = opcodes.find(opcode => opcode.mnemonic === instruction.opcode);
        const rewritten = operation.rewrite(instruction.a, instruction.b, instruction.c).replace(`r${ipIndex}`, "IP");
        rewrites.push(rewritten);
    }
    return rewrites;
}

function processPartTwo(program: Program): number {
    // this will never end, but the solution is the sum of divisors of the value that ends up in r[1]
    // const rewrites = rewrite(program);
    let state: Registers = [1, 0, 0, 0, 0, 0];
    const { ipIndex, instructions } = program;
    let ip = 0;
    let runLength = 0;
    const histogram = Array(instructions.length).fill(0);
    while (ip < instructions.length) {
        const instruction = instructions[ip];
        histogram[ip] += 1;
        // console.log(`${(ip + 1).toString().padStart(3, " ")}: ${rewrites[ip]}`);
        state[ipIndex] = ip;
        const operation = opcodes.find(opcode => opcode.mnemonic === instruction.opcode);
        state = operation.operation(state, instruction.a, instruction.b, instruction.c);
        ip = state[ipIndex] + 1;
        runLength += 1;
        if (runLength % 100000 === 0) {
            console.log(printRow(state, 10));
            console.log(histogram);
            terminal.previousLine(37);
        }
    }
    console.log(histogram);
    console.log(runLength, state);
    return state[0];
}

main();