import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Schedule {
    depart: number;
    lines: (number | "x")[];
}

interface LineOffset{
    line: number;
    offset: number;
}

const isDivisible = (bigger: number, smaller: number) => Math.floor(bigger / smaller) * smaller === bigger;

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    return {
        depart: +input[0],
        lines: input[1].split(",").map(item => item === "x" ? "x" : +item)
    }
};

const partOne = (input: Schedule, debug: boolean) => {
    const lines = input.lines.filter(item => item !== "x") as number[];
    let depart = input.depart;
    while (true) {
        const leaving = lines.filter(line => isDivisible(depart, line));
        if (leaving.length !== 0) {
            const bus = leaving[0];
            const wait = depart - input.depart;
            return bus * wait;
        }
        depart += 1;
    }
};


const partTwo = (input: Schedule, debug: boolean) => {
    const lines = input.lines.map((line, index) => ({
        line: line,
        offset: index
    })).filter(item => item.line !== "x") as LineOffset[];

    return 0;

};

const partTwoBruteForce = (input: Schedule, debug: boolean) => {
    const lines = input.lines.map((line, index) => ({
        line: line,
        offset: index
    })).filter(item => item.line !== "x") as LineOffset[];

    lines.sort((f, s) => f.line - s.line);
    const maxLine = lines[lines.length-1];

    let depart = maxLine.line - maxLine.offset;

//    let count = 0;

    while (true) {
        // count += 1;

        // if (count % 10000000 === 0) {
        //     console.log(depart.toLocaleString());
        // }
        let all = true;
        for (const line of lines) {
            const lineDepart = depart + line.offset;
            if (!isDivisible(lineDepart, line.line)) {
                all = false;
                break;
            }
        }
        if (all) {
            return depart;
        }
        depart += maxLine.line;
    }
};

const result = (_: any, result: number) => {
    return `The wait time by the line number is ${result}`;
};

const showInput = (input: Schedule) => {
    console.log(input);
};

const test = (_: Schedule) => {
    console.log("----Test-----");
};

export const solutionThirteen: Puzzle<Schedule, number> = {
    day: 13,
    input: processInput,
    partOne,
    partTwo: partTwo,
    resultOne: result,
    resultTwo: result,
    showInput,
    test,
}
