// Solution for day 24 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type Wire = { name: string, value: "true" | "false" | "unknown" };

type Gate = {
    type: "AND" | "OR" | "XOR"
    inputs: [string, string]
    output: string
}

type Input = {
    inputs: Wire[],
    gates: Gate[],
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    let line = lines.shift()!;
    let inputs: Wire[] = [];
    while (line !== "") {
        const [name, value] = line.split(": ");
        inputs.push({ 
            name, 
            value: value === "1" ? "true" : value === "0" ? "false" : "unknown"
        });
        line = lines.shift()!;
    }
    const gateRegex = /(\w+) (OR|AND|XOR) (\w+) -> (\w+)/;
    const gates = lines.map(line => {
        const match = line.match(gateRegex)!;
        return {
            type: match[2] as "AND" | "OR" | "XOR",
            inputs: [match[1], match[3]] as [string, string],
            output: match[4]
        };
    });
    return { inputs, gates };
};

const partOne = ({inputs, gates}: Input, debug: boolean) => {

    const wireNames = [...new Set(gates.flatMap(gate => [gate.output, ...gate.inputs]))].toSorted();
    const wires = wireNames.map(name => {
        const wire = inputs.find(wire => wire.name === name);
        return { name, value: wire ? wire.value : "unknown" };
    });

    let done = wires.every(wire => wire.value !== "unknown");
    while (!done) {
        for (const gate of gates) {
            // is the output known?
            const outputWire = wires.find(wire => wire.name === gate.output);
            if (outputWire?.value !== "unknown") {
                continue;
            }
            // are the inputs known?
            const input1 = wires.find(wire => wire.name === gate.inputs[0])!;
            const input2 = wires.find(wire => wire.name === gate.inputs[1])!;
            if (input1?.value === "unknown" || input2?.value === "unknown") {
                continue;
            }

            // calculate the output
            if (gate.type === "AND") {
                outputWire.value = (input1.value === "true" && input2.value === "true") ? "true" : "false";
            }
            if (gate.type === "OR") {
                outputWire.value = (input1.value === "true" || input2.value === "true") ? "true" : "false";
            }
            if (gate.type === "XOR") {
                outputWire.value = (input1.value !== input2.value) ? "true" : "false";
            }
        }
        done = wires.every(wire => wire.value !== "unknown");
    }

    const zvalue = wires.filter(wire => wire.name.startsWith("z")).map(zwire => zwire.value === "true" ? 1 : 0).toReversed();

    let result = 0;
    for (const value of zvalue) {
        result = result * 2 + value;
    }

    return result;
};

const partTwo = (input: Input, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    return -1;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Input) => {
    console.log(input);
};

const test = (_: Input) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Input, number> = {
    day: 24,
    input: () => processInput(24),
    partOne,
    //partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}