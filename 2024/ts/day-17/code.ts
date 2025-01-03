// Solution for day 17 of advent of code 2024

import { readInputLines, readInput, dlog } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { register } from "module";

type Computer = {
    registers: {
        A: number,
        B: number,
        C: number
    },
    pointer: number,
    program: number[],
    output: number[]
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const registerRegex = /^Register (A|B|C): (\d+)$/;
    const programRegex = /^Program: ((?:\d+,)+\d+)$/;
    const areg = parseInt(lines[0].match(registerRegex)![2], 10);
    const breg = parseInt(lines[1].match(registerRegex)![2], 10);
    const creg = parseInt(lines[2].match(registerRegex)![2], 10);
    const program = lines[4].match(programRegex)![1].split(",").map(x => parseInt(x, 10));

    return {
        registers: {
            A: areg,
            B: breg,
            C: creg
        },
        pointer: 0,
        program: program,
        output: []
    }
};

type InstructionExecution = (input: Computer, parameter: number) => Computer;

const copyComputer = (input: Computer) => {
    return {
        registers: {
            ...input.registers
        },
        pointer: input.pointer,
        program: [...input.program],
        output: [...input.output]
    };
}

const getComboValue = (computer: Computer, parameter: number) => {
    switch (parameter) {
        case 0: 
        case 1: 
        case 2: 
        case 3:
            return parameter;
        case 4:
            return computer.registers.A;
        case 5:
            return computer.registers.B;
        case 6:
            return computer.registers.C;
        default: throw new Error(`Invalid combo parameter ${parameter}`);
    }
}

const xor = (first: number, second: number) => {
    const safeLimit = 2 << 29;
    if (first <= safeLimit && second <= safeLimit) {
        return first ^ second;
    }
    const biga = BigInt(first);
    const bigb = BigInt(second);
    return Number(biga ^ bigb);
}

const instructionSet: Record<number, InstructionExecution>  = {
    0: (input, parameter) => { // adv
        const result = copyComputer(input);
        const first = input.registers.A;
        const second = 2 ** getComboValue(input, parameter);

        const value = Math.floor(first / second);

        result.registers.A = value;
        result.pointer += 2;
        return result;
    },
    1: (input, parameter) => { // bxl
        const result = copyComputer(input);
        const first = input.registers.B;
        const second = parameter;

        const value = xor(first, second);

        result.registers.B = value;
        result.pointer += 2;
        return result;
    },
    2: (input, parameter) => { // bst
        const result = copyComputer(input);
        const value = getComboValue(input, parameter) % 8;

        result.registers.B = value;
        result.pointer += 2;
        return result;
    },
    3: (input, parameter) => { // jnz
        const result = copyComputer(input);

        if (input.registers.A === 0) {
            result.pointer += 2;
            return result;
        }

        result.pointer = parameter;
        return result;
    },
    4: (input, _parameter) => { // bxc
        const result = copyComputer(input);
        const first = input.registers.B;
        const second = input.registers.C;

        const value = xor(first, second);

        result.registers.B = value;
        result.pointer += 2;
        return result;
    },
    5: (input, parameter) => { // out
        const result = copyComputer(input);
        const value = getComboValue(input, parameter) % 8;

        result.output.push(value);

        result.pointer += 2;
        return result;
    },
    6: (input, parameter) => { // bdv
        const result = copyComputer(input);
        const first = input.registers.A;
        const second = 2 ** getComboValue(input, parameter);

        const value = Math.floor(first / second);

        result.registers.B = value;
        result.pointer += 2;
        return result;
    },
    7: (input, parameter) => { // cdv
        const result = copyComputer(input);
        const first = input.registers.A;
        const second = 2 ** getComboValue(input, parameter);

        const value = Math.floor(first / second);

        result.registers.C = value;
        result.pointer += 2;
        return result;
    },
}

const runProgram = (input: Computer) => {
    let computer: Computer = copyComputer(input);
    while (computer.pointer < computer.program.length) {
        const instruction = computer.program[computer.pointer];
        const parameter = computer.program[computer.pointer + 1];

        const process = instructionSet[instruction];
        if (!process) {
            console.error(`Unknown instruction ${instruction} at ${computer.pointer}`);
            return [];
        }
        computer = process(computer, parameter);
    }
    return computer.output;
}

const partOne = (input: Computer, debug: boolean) => {
    return runProgram(input).join(",");
};

const findQuineValue = (input: Computer, targets: number[], candidate: number):number => {
    if (targets.length === 0) {
        return candidate;
    }
    const target = targets[targets.length-1];

    const start = 0o0;
    const end = 0o7;

    for (let i = start; i <= end; i++) {
        const newCandidate = candidate * 8 + i;
        const computer = copyComputer(input);
        computer.registers.A = newCandidate;
        const output = runProgram(computer);
        if (output[0] === target) {
            dlog(`Found candidate ${newCandidate} for ${target} (target ${targets.length})`);
            const result = findQuineValue(input, targets.slice(0, -1), newCandidate);
            if (result > 0) {
                dlog(`Found ${result} for ${target}`);
                return result;
            }
        }
    }

    return 0;
}

const partTwo = (input: Computer, debug: boolean) => {
    const targets = input.program.slice();

    const result = findQuineValue(input, targets, 0);

    return result.toString();
};

const resultOne = (_: any, result: string) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: string) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Computer) => {
    console.log(input);
};

const test = (_: Computer) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Computer, string> = {
    day: 17,
    input: () => processInput(17),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}