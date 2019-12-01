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

    console.log(`Part 1: Register zero should have value of ${regZero} for minimal ops`);
    console.log(`Running time for part 1 is ${Math.round(endOne - startOne)}ms`);

    const startTwo = performance.now();
    regZero = processPartTwo(program);
    const endTwo = performance.now();

    console.log(`Part 2: Register zero should have value of ${regZero} for maximal ops`);
    console.log(`Running time for part 2 is ${Math.round(endTwo - startTwo)}ms`);

    /*
        Running time for input is 14ms
        Part 1: Register zero should have value of 3909249 for minimal ops
        Running time for part 1 is 7ms
        Part 2: Register zero should have value of 12333799 for maximal ops
        Running time for part 2 is 1004687ms    
    */
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
    while (ip < instructions.length) {
        const instruction = instructions[ip];
        state[ipIndex] = ip;
        const operation = opcodes.find(opcode => opcode.mnemonic === instruction.opcode);
        if (operation.mnemonic === "eqrr") {
            // the only place where the register 0 is used is in the command
            // eqrr 3 0 5
            // I'm abusing the fact that it's the only place where the mnemonic "eqrr" is used, 
            // since I don't have an index of the operation
            return state[3];
        }
        state = operation.operation(state, instruction.a, instruction.b, instruction.c);
        ip = state[ipIndex] + 1;
    }
}

// takes a long, long time - the original program needs to be changed to run faster
function processPartTwo(program: Program): number {
    let state: Registers = [0, 0, 0, 0, 0, 0];
    const { ipIndex, instructions } = program;
    let ip = 0;
    const breakers = [];
    while (ip < instructions.length) {
        const instruction = instructions[ip];
        state[ipIndex] = ip;
        const operation = opcodes.find(opcode => opcode.mnemonic === instruction.opcode);
        if (operation.mnemonic === "eqrr") {
            // if the current value of register 3 is in the breakers array, the last added one is the solution
            // otherwise, add the value to the breakers and continue
            if (breakers.includes(state[3])) {
                return breakers[breakers.length-1];
            }
            breakers.push(state[3]);
            console.log(`Adding \t${state[3]} to breakers array, total \t${breakers.length} breakers\t\t`);
            terminal.previousLine();
        }
        state = operation.operation(state, instruction.a, instruction.b, instruction.c);
        ip = state[ipIndex] + 1;
    }
}

main();