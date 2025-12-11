// Solution for day 10 of advent of code 2025

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type Machine = {
    lights: ("." | "#")[];
    buttons: number[][];
    joltage: number[];
}

const processInput = (day: number) => {
    const lineRegex = /^\[((?:\.|#)+)\]\s(\(\d+(?:,\d+)*\)(?:\s\(\d+(?:,\d+)*\))+)\s{(\d+(?:,\d+)+)}$/;
    const lines = readInputLines(day);
    const machines = lines.map(line => {
        const match = line.match(lineRegex);
        if (match) {
            const lights = match[1].split('') as ("." | "#")[];
            const buttons = match[2].split(' ').map(btn => btn.slice(1, -1).split(',').map(Number));
            const joltage = match[3].split(',').map(Number);
            return { lights, buttons, joltage } as Machine;
        }
        throw new Error(`Invalid line format: ${line}`);
    });
    return machines;
};

const copyMachine = (machine: Machine): Machine => {
    return {
        lights: [...machine.lights],
        buttons: machine.buttons.map(btn => [...btn]),
        joltage: [...machine.joltage],
    };
};

const pushButton = (machine: Machine, buttonIndex: number): Machine => {
    const newMachine = copyMachine(machine);
    const button = newMachine.buttons[buttonIndex];
    for (const lightIndex of button) {
        newMachine.lights[lightIndex] = newMachine.lights[lightIndex] === "#" ? "." : "#";
    }
    return newMachine;
}


const calcButtonPresses = (machine: Machine): number => {
    let presses = Number.MAX_SAFE_INTEGER;
    // loop from 0 to 2^number of buttons -1
    const numButtons = machine.buttons.length;
    const totalCombinations = 1 << numButtons; // 2^numButtons
    const targetState = machine.lights.join('');
    for (let combination = 0; combination < totalCombinations; combination++) {
        let testMachine = copyMachine(machine);
        testMachine.lights = Array(machine.lights.length).fill(".");

        let currentPresses = 0;
        for (let bindex = 0; bindex < numButtons; bindex++) {
            if ((combination & (1 << bindex)) !== 0) {
                testMachine = pushButton(testMachine, bindex);
                currentPresses++;
            }
        }

        const currentState = testMachine.lights.join('');

        if (currentState === targetState) {
            if (currentPresses < presses) {
                presses = currentPresses;
            }
        }
    }
    return presses;
}

const partOne = (input: Machine[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    let totalPushes = 0;
    for (const machine of input) {
        const machinePushes = calcButtonPresses(machine);
        if (debug) console.log(`Machine requires ${machinePushes} pushes`);
        totalPushes += machinePushes;
    }
    return totalPushes;
};

const partTwo = (input: Machine[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    return input.length;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Machine[]) => {
    console.log(input);
};

const test = (_: Machine[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Machine[], number> = {
    day: 10,
    input: () => processInput(10),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}