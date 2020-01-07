import { readInputLines, readInput, debugLog } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { IntcodeSimulator } from "../extra/intcode-simulator";

const processInput = async (day: number) => {
    const input = await readInput(day);
    const numbers = input.split(",").map(c => parseInt(c, 10));
    return numbers;
};

interface Machine {
    simulator: IntcodeSimulator;
    input: number[];
    output: number[];
    index: number;
}

const partOne = (instructions: number[], debug: boolean) => {
    const machinesCount = 50;
    const machines: Machine[] = Array(machinesCount);
    let result: number;
    for (let index = 0; index < machinesCount; index++) {
        const machine = {
            simulator: undefined,
            input: [index, -1],
            output: [],
            index,
        }
        machine.simulator = new IntcodeSimulator(instructions.slice(), machine.input, false);
        machine.simulator.output = value => {
            debugLog(debug,`[${index.toString().padStart(2, "0")}]: ${value}`);
            machine.output.push(value);
            if (machine.output.length % 3 === 0) {
                const destination = machine.output[machine.output.length-3];
                const x = machine.output[machine.output.length-2];
                const y = machine.output[machine.output.length-1];
                if (destination > machinesCount-1) {
                    debugLog(debug,`Destination ${destination} is out of scope`);
                    if (destination === 255) {
                        result = y;
                    }
                } else {
                    debugLog(debug,`sending data {${x},${y}} to destination ${destination}`);
                    machines[destination].input.push(x, y);
                    machines[destination].simulator.resume();
                }
            }
        };
        machines[index] = machine;
    }

    const isHalted = () => {
        return machines.every(m => m.simulator.getState() === "halted");
    }

    while (!isHalted()) {
        for (const machine of machines) {
            machine.simulator.run();
            if (result !== undefined) {
                return result;
            }
        }
    }
};

const partTwo = (instructions: number[], debug: boolean) => {
    const machinesCount = 50;
    const machines: Machine[] = Array(machinesCount);

    let idleCount = 0;
    let nat = [];
    let lasty = Number.NaN;

    for (let index = 0; index < machinesCount; index++) {
        const machine = {
            simulator: undefined,
            input: [index, -1],
            output: [],
            index,
        }
        machine.simulator = new IntcodeSimulator(instructions.slice(), machine.input, false);
        machine.simulator.output = value => {
            idleCount = 0;
            debugLog(debug,`[${index.toString().padStart(2, "0")}]: ${value}`);
            machine.output.push(value);
            if (machine.output.length % 3 === 0) {
                const destination = machine.output[machine.output.length-3];
                const x = machine.output[machine.output.length-2];
                const y = machine.output[machine.output.length-1];
                if (destination > machinesCount-1) {
                    if (destination === 255) {
                        nat = [x, y];
                        return;
                    }
                    debugLog(debug,`Destination ${destination} is out of scope`);
                } else {
                    debugLog(debug,`sending data {${x},${y}} to destination ${destination}`);
                    machines[destination].input.push(x, y);
                    machines[destination].simulator.resume();
                }
            }
        };
        machines[index] = machine;
    }

    const isHalted = () => {
        return machines.every(m => m.simulator.getState() === "halted");
    }

    while (!isHalted()) {
        for (const machine of machines) {
            machine.simulator.run();
            idleCount += 1;
            if (idleCount === 50) {
                debugLog(debug, "all machines are idle, nat is", nat);
                if (lasty === nat[1]) {
                    return lasty;
                }
                lasty = nat[1];
                machines[0].input.push(...nat);
                machines[0].simulator.resume();
            }
        }
    }

    return -1;
};

const resultOne = (_: any, result: number) => {
    return `First packet sent to address 255 has a Y of ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `First Y value to repeat on the NAT is ${result}`;
};

const showInput = (input: number[]) => {
    console.log(input);
};

const test = (_: number[]) => {
    console.log("----Test-----");
};

export const solution23: Puzzle<number[], number> = {
    day: 23,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
