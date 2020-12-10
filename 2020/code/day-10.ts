import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    return input.map(line => Number(line));
};

const partOne = (input: number[], debug: boolean) => {
    const chargers = input.slice().sort((f, s) => f-s);
    chargers[-1]=0;
    const diffs = chargers.map((c, i, a) => c - a[i-1]);
    diffs.push(3);
    const grouped = diffs.groupReduce(diff => diff, (acc, diff) => acc +1, 0);
    console.log(grouped);
    const ones = grouped.find(g => g.key === 1).value;
    const threes = grouped.find(g => g.key === 3).value;
    return ones * threes;
};

let callCount = 0;

const getNext = (chargers:number[], level: number): number => {
    callCount +=1;

    if (callCount % 12345671 === 0) {
        console.log(callCount);
    }

    const candidates = chargers.filter(c => c-level <= 3);
    if (candidates.length === 0) {
        return 1;
    }
    let setups = 0;
    // console.log(candidates);
    for (const candidate of candidates) {
        const rest = chargers.filter(c => c > candidate);
        const result = getNext(rest, candidate);
        setups += result;
    }
    return setups;
}

const partTwo = (input: number[], debug: boolean) => {
    const chargers = input.slice().sort((f, s) => f-s);
    const result = getNext(chargers, 0)
    return result;
};

const resultOne = (_: any, result: number) => {
    return `Total difference product is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The period of the orbit is ${result}`;
};

const showInput = (input: number[]) => {
    console.log(input);
};

const test = (_: number[]) => {
    console.log("----Test-----");
};

export const solutionTen: Puzzle<number[], number> = {
    day: 10,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
