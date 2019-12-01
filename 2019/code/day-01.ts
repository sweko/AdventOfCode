import { readInputLines } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    let numbers = input.map(c => parseInt(c));
    return numbers;
};

const partOne = (modules: number[]) => {
    const fuels = modules.map(module => ((module / 3) | 0) - 2);
    const sum = fuels.reduce((fuel, sum) => sum + fuel, 0);
    return sum;
};

const partTwo = (modules: number[]) => {
    const fuels = modules.map(module => getFuelRequirement(module));
    const sum = fuels.reduce((fuel, sum) => sum + fuel, 0);
    return sum;
};

const resultMessage = (modules: number[], result: number) => {
    return `Sum of the fuel requirements is ${result} units`;
};

const getFuelRequirement = (module: number) => {
    let weight = 0;
    let fuel = ((module / 3) | 0) - 2;
    while (fuel > 0) {
        weight += fuel;
        fuel = ((fuel / 3) | 0) - 2;
    }
    return weight;
};

const showInput = (input: number[]) => {
    console.log(input);
};

const test = () => {
    console.log(getFuelRequirement(1969));
    console.log(getFuelRequirement(100756));
};

export const solution: Puzzle<number[], number> = {
    day: 1,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultMessage,
    resultTwo: resultMessage,
    showInput,
    test,
}
