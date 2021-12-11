import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    return lines;
};

interface InvalidParseResult {
    line: string;
    success: false;
    errorIndex: number;
}

interface ValidParseResult {
    line: string;
    success: true;
    completion: string[];
}

type ParseResult = InvalidParseResult | ValidParseResult;

const parseLine = (line: string): ParseResult => {
    const stack = [];
    const openers = ['(', '{', '[', '<'];
    const closers = [')', '}', ']', '>'];
    for (let index = 0; index < line.length; index++) {
        const char = line[index];
        if (openers.includes(char)) {
            stack.push(char);
        } else if (closers.includes(char)) {
            const opener = stack.pop();
            const closerIndex = closers.indexOf(char);
            if (opener !== openers[closerIndex]) {
                return {
                    line: line,
                    success: false,
                    errorIndex: index,
                };
            }
        } else {
            throw new Error(`Invalid character ${char}`);
        }
    }

    return {
        line,
        success: true,
        completion: stack.reverse().map(c => closers[openers.indexOf(c)]),
    }
};

const partOne = (input: string[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const costs = {
        ')': 3,
        ']': 57,
        '}': 1197,
        '>': 25137,
    }

    const parsed = input.map(line => parseLine(line));
    const invalids = parsed.filter(pr => !pr.success) as InvalidParseResult[];
    const result = invalids.map(pr => pr.line[pr.errorIndex]).reduce((acc, cur) => acc + costs[cur], 0);
    return result;
};

const scoreCompletion = (completion: string[]) => {
    const costs = {
        ')': 1,
        ']': 2,
        '}': 3,
        '>': 4,
    };

    return completion.reduce((acc, cur) => 5* acc + costs[cur], 0);
};

const partTwo = (input: string[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const parsed = input.map(line => parseLine(line));
    const valids = parsed.filter(pr => pr.success) as ValidParseResult[];
    const scores = valids.map(pr => scoreCompletion(pr.completion)).sort((a, b) => a - b);
    const result = scores[(scores.length - 1) / 2];
    return result;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: string[]) => {
    console.log(input);
};

const test = (_: string[]) => {
    console.log("----Test-----");
};

export const solutionTen: Puzzle<string[], number> = {
    day: 10,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
