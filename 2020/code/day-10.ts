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
    const ones = grouped.find(g => g.key === 1).value;
    const threes = grouped.find(g => g.key === 3).value;
    return ones * threes;
};

let callCount = 0;

const cachedResults: {[key:string]:number} = {};

const getKey = (chargers:number[], level: number): string => `${chargers.join(":")}-${level}`;

const getNext = (chargers:number[], level: number): number => {
    const key = getKey(chargers, level);

    if (cachedResults[key]) {
        return cachedResults[key];
    }

    const candidates = chargers.filter(c => c-level <= 3);
    if (candidates.length === 0) {
        cachedResults[key] = 1;
        return 1;
    }
    let setups = 0;
    for (const candidate of candidates) {
        const rest = chargers.filter(c => c > candidate);
        const result = getNext(rest, candidate);
        setups += result;
    }
    cachedResults[key] = setups;
    return setups;
}

const partTwo = (input: number[], debug: boolean) => {
    const chargers = input.slice().sort((f, s) => f-s);

    // const results: {[key:number]:number} = {0: 1};
    
    // for (const charger of chargers) {
    //     results[charger] = (results[charger-1] || 0) + (results[charger-2] || 0) + (results[charger-3] || 0);
    // }

    // return results[chargers[chargers.length-1]];

    const result = getNext(chargers, 0);
    return result;
};

const resultOne = (_: any, result: number) => {
    return `Total difference product is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Total number of distinct ways ${result}`;
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
