import { access } from "fs";
import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Hash } from "../extra/hash-helpers";
import { Puzzle } from "./model";

type Command = "acc" | "jmp" | "nop";

interface Instruction {
    command: Command,
    argument: number;
}

interface GameBoy {
    ip: number;
    acc: number;
}

const engine: {[key: string]: (gb: GameBoy, argument: number) => GameBoy} = {
    "acc": (gb, argument) => {
        return {
            ...gb,
            ip: gb.ip + 1,
            acc: gb.acc + argument,
        }
    },
    "jmp": (gb, argument) => {
        return {
            ...gb,
            ip: gb.ip + argument,
        }
    },
    "nop": (gb, _argument) => {
        return {
            ...gb,
            ip: gb.ip + 1,
        }
    },
}

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    const regex = /^(\w+) (\+\d+|-\d+)$/;
    const result: Instruction[] = input.map(line => {
        const match = line.match(regex);
        return {
            command: match[1] as Command,
            argument: Number(match[2])
        }
    });
    return result;
};

function runGameBoy(input: Instruction[]) {
    let gameBoy: GameBoy = {
        acc: 0,
        ip: 0
    };

    const linesRun: Hash<boolean> = {};

    while (!linesRun[gameBoy.ip]) {

        if (gameBoy.ip >= input.length) {
            return {
                accumulator: gameBoy.acc,
                loop: false
            };
        }

        const inst = input[gameBoy.ip];
        linesRun[gameBoy.ip] = true;
        gameBoy = engine[inst.command](gameBoy, inst.argument);
    }

    return { 
        accumulator: gameBoy.acc,
        loop: true
    };
}

const partOne = (input: Instruction[], debug: boolean) => {
    return runGameBoy(input).accumulator;
};

const explode = (input: Instruction[]): Instruction[][] => {
    const result = [];
    for (let i=0; i <input.length; i+=1) {
        const command = input[i];
        if (command.command === "acc") {
            continue;
        }
        if (command.command === "jmp") {
            const changed = input.map(inst => ({...inst}));
            changed[i].command = "nop";
            result.push(changed);
        }
        if (command.command === "nop") {
            const changed = input.map(inst => ({...inst}));
            changed[i].command = "jmp";
            result.push(changed);
        }
    }
    return result;
}

const partTwo = (input: Instruction[], debug: boolean) => {
    const inputs = explode(input);
    return inputs.map(runGameBoy).find(out => !out.loop).accumulator;
};

const resultOne = (_: any, result: number) => {
    return `The value of the accumulator is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The value of the accumulator is ${result}`;
};

const showInput = (input: Instruction[]) => {
    console.log(input);
};

const test = (_: Instruction[]) => {
    console.log("----Test-----");
};

export const solutionEight: Puzzle<Instruction[], number> = {
    day: 8,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}


