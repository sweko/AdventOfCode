import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    let numbers = input.map(c => parseInt(c));
    return numbers;

    // return [1721, 979, 366, 299, 675, 1456];
};

const get2020Pair = (input:number[]) => {
    for (let i=0; i< input.length; i+=1) {
        for (let j=i+1; j< input.length; j+=1) {
            if (input[i] + input[j] === 2020) {
                return [input[i], input[j]];
            }
        }
    };
    return [-1, 1];
}

const partOne = (input: number[], debug: boolean) => {
    const [first, second] = get2020Pair(input);
    return first * second;
};

const get2020Triple = (input:number[]) => {
    for (let i=0; i< input.length; i+=1) {
        for (let j=i+1; j< input.length; j+=1) {
            for (let k=j+1; k< input.length; k+=1) {
                if (input[i] + input[j]+input[k] === 2020) {
                    return [input[i], input[j], input[k]];
                }
            }
        }
    };
    return [-1, -1, -1];
}

const partTwo = (input: number[], debug: boolean) => {
    const [first, second, third] = get2020Triple(input);
    return first * second * third;
};

const result = (_: any, result: number) => {
    return `The product of the numbers is ${result}`;
};

const showInput = (input: number[]) => {
    console.log(input);
};

const test = (_: number[]) => {
    console.log("----Test-----");
};

export const solutionOne: Puzzle<number[], number> = {
    day: 1,
    input: processInput,
    partOne,
    partTwo,
    resultOne: result,
    resultTwo: result,
    showInput,
    test
}
