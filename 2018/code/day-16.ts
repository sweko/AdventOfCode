import { performance } from "perf_hooks";
import "../extra/array-helpers";
import { readInputLines } from "../extra/aoc-helper";

type Registers = [number, number, number, number];

interface Instruction {
    opcode: number;
    a: number,
    b: number,
    c: number;
}

interface Sample {
    before: Registers;
    after: Registers;
    instruction: Instruction
}

interface Input {
    samples: Sample[];
    program: Instruction[];
}

interface Operation {
    mnemonic: string,
    operation: (state: Registers, a: number, b: number, c: number) => Registers,
    opcode?: number;
}

async function main() {
    const startInput = performance.now();

    const lines = await readInputLines();
    const { samples, program } = processLines(lines);

    const endInput = performance.now();
    console.log(`Running time for input is ${Math.round(endInput - startInput)}ms`);

    const startOne = performance.now();
    const triPlus = processPartOne(samples);
    const endOne = performance.now();

    console.log(`Part 1: Opcodes with 3+ interpretations: ${triPlus}`);
    console.log(`Running time for part 1 is ${Math.round(endOne - startOne)}ms`);

    const startTwo = performance.now();
    const regZero = processPartTwo(samples, program);
    const endTwo = performance.now();

    console.log(`Part 2: Register zero has value of ${regZero}`);
    console.log(`Running time for part 2 is ${Math.round(endOne - startOne)}ms`);
}



function processLines(lines: string[]): Input {
    const result = {
        samples: [],
        program: []
    };
    let index = 0;
    for (; index < lines.length; index += 4) {
        if (lines[index] === "") {
            break;
        }
        const before = lines[index].match(/^Before: \[(\d), (\d), (\d), (\d)]$/).slice(1, 5).map(el => Number(el));
        const instruction = lines[index + 1].match(/^(\d+) (\d) (\d) (\d)$/).slice(1, 5).map(el => Number(el));
        const after = lines[index + 2].match(/^After:  \[(\d), (\d), (\d), (\d)]$/).slice(1, 5).map(el => Number(el))


        const sample: Sample = {
            before: [before[0], before[1], before[2], before[3]],
            after: [after[0], after[1], after[2], after[3]],
            instruction: {
                opcode: instruction[0],
                a: instruction[1],
                b: instruction[2],
                c: instruction[3]
            }
        }
        result.samples.push(sample);

    }

    while (lines[index] === "") { index += 1; }

    for (; index < lines.length; index += 1) {
        const instruction = lines[index].match(/^(\d+) (\d) (\d) (\d)$/).slice(1, 5).map(el => Number(el));
        result.program.push({
            opcode: instruction[0],
            a: instruction[1],
            b: instruction[2],
            c: instruction[3]
        });
    }

    return result;
}

const opcodes: Operation[] = [
    {
        mnemonic: "addr",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] + result[b];
            return result;
        }
    },
    {
        mnemonic: "addi",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] + b;
            return result;
        }
    },
    {
        mnemonic: "mulr",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] * result[b];
            return result;
        }
    },
    {
        mnemonic: "muli",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] * b;
            return result;
        }
    },
    {
        mnemonic: "banr",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] & result[b];
            return result;
        }
    },
    {
        mnemonic: "bani",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] & b;
            return result;
        }
    },
    {
        mnemonic: "borr",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] | result[b];
            return result;
        }
    },
    {
        mnemonic: "bori",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] | b;
            return result;
        }
    },
    {
        mnemonic: "setr",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a];
            return result;
        }
    },
    {
        mnemonic: "seti",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = a;
            return result;
        }
    },
    {
        mnemonic: "gtir",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = a > result[b] ? 1 : 0;
            return result;
        }
    },
    {
        mnemonic: "gtri",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] > b ? 1 : 0;
            return result;
        }
    },
    {
        mnemonic: "gtrr",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] > result[b] ? 1 : 0;
            return result;
        }
    },
    {
        mnemonic: "eqir",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = a === result[b] ? 1 : 0;
            return result;
        }
    },
    {
        mnemonic: "eqri",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] === b ? 1 : 0;
            return result;
        }
    },
    {
        mnemonic: "eqrr",
        operation: (state: Registers, a: number, b: number, c: number) => {
            const result = [...state] as Registers;
            result[c] = result[a] === result[b] ? 1 : 0;
            return result;
        }
    }
]

function testOpcode(sample: Sample, operation: Operation) {
    const result = operation.operation(sample.before, sample.instruction.a, sample.instruction.b, sample.instruction.c);
    if (result[0] !== sample.after[0]) { return false; }
    if (result[1] !== sample.after[1]) { return false; }
    if (result[2] !== sample.after[2]) { return false; }
    if (result[3] !== sample.after[3]) { return false; }
    return true;
}

function countPossibleOpcodes(sample: Sample): number {
    return opcodes.filter(opcode => testOpcode(sample, opcode)).length;
}

function processPartOne(samples: Sample[]): number {
    return samples
        .map(sample => countPossibleOpcodes(sample))
        .filter(count => count >= 3)
        .length;
}

function processPartTwo(samples: Sample[], program: Instruction[]): number {
    // should not work, but does
    for (const sample of samples) {
        const matches = opcodes.filter(opcode => (opcode.opcode === undefined) && testOpcode(sample, opcode));
        if (matches.length === 1) {
            matches[0].opcode = sample.instruction.opcode;
        }
    }

    let state: Registers = [0, 0, 0, 0];
    for (const instruction of program) {
        const operation = opcodes.find(opcode => opcode.opcode === instruction.opcode);
        state = operation.operation(state, instruction.a, instruction.b, instruction.c);
    }
    return state[0];
}

main();