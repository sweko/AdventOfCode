import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { IntcodeSimulator } from "../extra/intcode-simulator";

const processInput = async (day: number) => {
    const input = await readInput(day);
    return input.split(",").map(c => Number(c));
};

const fromAscii = (command: string) => (command + "\n").split("").map(c => c.charCodeAt(0));

const getInstructionsOne = () => {
    const commands = ["NOT", "AND", "OR"];
    const xregs = ["A", "B", "C", "D", "T", "J"];
    const yregs = ["T", "J"];
    const results = [];

    for (const command of commands) {
        for (const xreg of xregs) {
            for (const yreg of yregs) {
                results.push(`${command} ${xreg} ${yreg}`);
            }
        }
    }
    return results;
}

const getPrograms = (length: number, commandSet: string[]) => {
    if (length === 1) {
        return commandSet.slice();
    }
    return getPrograms(length - 1, commandSet).flatMap(c1 => commandSet.map(c2 => c1 + "\n" + c2));
}

const partOneBruteForce = (instructions: number[], debug: boolean) => {
    let lines = 1;
    let run = 0;
    const commandSet: string[] = getInstructionsOne();
    let result: number;

    while (true) {
        let programs = getPrograms(lines, commandSet);
        for (const program of programs) {
            const input = [];
            input.push(...fromAscii(program));
            input.push(...fromAscii("WALK"));
            run += 1;
            if (run % 1237 === 0) {
                console.log(`Executing simulator run #${run} for \n${program}`);
            }

            const simulator = new IntcodeSimulator(instructions.slice(), input);
            simulator.output = value => {
                if (value > 255) {
                    result = value;
                    return;
                }
                if (false) {
                    var char = String.fromCharCode(value);
                    process.stdout.write(char);
                }
            };

            simulator.run();
            if (result) {
                console.log(`Got result at simulator run #${run} for \n${program}`);
                return result;
            }
        }
        lines += 1;
    }

    return result;
};

const partOne = (instructions: number[], debug: boolean) => {
    const input = [];
    input.push(...fromAscii("NOT A J"));
    input.push(...fromAscii("NOT B T"));
    input.push(...fromAscii("OR T J"));
    input.push(...fromAscii("NOT C T"));
    input.push(...fromAscii("OR T J"));
    input.push(...fromAscii("AND D J"));
    input.push(...fromAscii("WALK"));

    let result;

    const simulator = new IntcodeSimulator(instructions.slice(), input);
    simulator.output = value => {
        if (value > 255) {
            result = value;
            return;
        }
        if (debug) {
            var char = String.fromCharCode(value);
            process.stdout.write(char);
        }
    };

    simulator.run();
    if (result) {
        return result;
    }
};

const getInstructionsTwo = () => {
    const commands = ["NOT", "AND", "OR"];
    const xregs = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "T", "J"];
    const yregs = ["T", "J"];
    const results = [];

    for (const command of commands) {
        for (const xreg of xregs) {
            for (const yreg of yregs) {
                results.push(`${command} ${xreg} ${yreg}`);
            }
        }
    }
    return results;
}

const partTwo = (instructions: number[], debug: boolean) => {
    const input = [];
    //(!A  OR !B OR !C) AND D
    input.push(...fromAscii("NOT A J"));
    input.push(...fromAscii("NOT B T"));
    input.push(...fromAscii("OR T J"));
    input.push(...fromAscii("NOT C T"));
    input.push(...fromAscii("OR T J"));
    input.push(...fromAscii("AND D J"));

    // ... AND (H OR (E AND (I OR F)))
    input.push(...fromAscii("OR I T"));
    input.push(...fromAscii("OR F T"));
    input.push(...fromAscii("AND E T"));
    input.push(...fromAscii("OR H T"));
    input.push(...fromAscii("AND T J"));

    input.push(...fromAscii("RUN"));

    let result;

    const simulator = new IntcodeSimulator(instructions.slice(), input);
    simulator.output = value => {
        if (value > 255) {
            result = value;
            return;
        }
        if (debug) {
            var char = String.fromCharCode(value);
            process.stdout.write(char);
        }
    };

    simulator.run();
    if (result) {
        return result;
    }
};



const partTwoBruteForce = (instructions: number[], debug: boolean) => {
    let lines = 1;
    let run = 0;
    const commandSet: string[] = getInstructionsTwo();
    let result: number;

    while (true) {
        let programs = getPrograms(lines, commandSet);
        for (const program of programs) {
            const input = [];
            input.push(...fromAscii(program));
            input.push(...fromAscii("RUN"));
            run += 1;
            if (run % 1237 === 0) {
                console.log(`Executing simulator run #${run} for \n${program}`);
            }

            const simulator = new IntcodeSimulator(instructions.slice(), input);
            simulator.output = value => {
                if (value > 255) {
                    result = value;
                    return;
                }
                if (false) {
                    var char = String.fromCharCode(value);
                    process.stdout.write(char);
                }
            };

            simulator.run();
            if (result) {
                console.log(`Got result at simulator run #${run} for \n${program}`);
                return result;
            }
        }
        lines += 1;
    }

    return result;
};

const resultOne = (_: any, result: number) => {
    return `Total amount of damage to the hull is ${result}`;
};

const showInput = (input: number[]) => {
    console.log(input);
};

const test = (_: number[]) => {
    console.log("----Test-----");
};

export const solution21: Puzzle<number[], number> = {
    day: 21,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultOne,
    showInput,
    test,
}
