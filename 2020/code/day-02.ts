import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Password {
    min: number;
    max: number;
    letter: string;
    password: string;
}

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    const regex = /^(\d+)-(\d+) (\w): (\w+)$/;
    return input.map(line => {
        const match = line.match(regex);
        return {
            min: +match[1],
            max: +match[2],
            letter: match[3],
            password: match[4]
        }
    });
};

const breakString = (input: string) => {
    const groups = input.split('').groupReduce(c => c, (acc, item) => acc+1, 0);
    return groups.reduce((acc, letter) => ({...acc, [letter.key]:letter.value}), {});
}

const partOne = (input: Password[], debug: boolean) => {
    const valids = input.filter(pass => {
        const hash = breakString(pass.password);
        return (hash[pass.letter] >= pass.min) && (hash[pass.letter] <= pass.max);
    });

    return valids.length;
};

const partTwo = (input: Password[], debug: boolean) => {
    const valids = input.filter(pass => {
        const first = (pass.password[pass.min-1] === pass.letter) ? 1: 0;
        const second = (pass.password[pass.max-1] === pass.letter) ? 1: 0;
        return first + second === 1;
    });

    return valids.length;
};

const result = (_: any, result: number) => {
    return `Total count of valid passwords is ${result}`;
};

const showInput = (input: Password[]) => {
    console.log(input);
};

const test = (_: Password[]) => {
    console.log("----Test-----");
};

export const solutionTwo: Puzzle<Password[], number> = {
    day: 2,
    input: processInput,
    partOne,
    partTwo,
    resultOne: result,
    resultTwo: result,
    showInput,
    test,
}
