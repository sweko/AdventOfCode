import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

type Bit = "0" | "1";

type Count = { [key in Bit]: number };

type Histogram = {
    'most': Bit;
    'least': Bit;
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    return lines.map(line => line.split("") as Bit[]);
};

const partOne = (input: Bit[][], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const initCounts: Count[] = input[0].map(_ => ({
        '0': 0,
        '1': 0
    }));

    const counts = input.reduce((count, row) => {
        for (let i = 0; i < row.length; i++) {
            const bit = row[i];
            count[i][bit] += 1;
        }
        return count;
    }, initCounts);

    const gamma = counts.map(count => (count[0] > count[1] ? '0' : '1')).join("");
    const epsilon = counts.map(count => (count[0] > count[1] ? '1' : '0')).join("");

    const gvalue = parseInt(gamma, 2);
    const evalue = parseInt(epsilon, 2);

    return gvalue * evalue;
};

const getCount = (input: Bit[][], index: number): Histogram => {
    const count: Count = {
        '0': 0,
        '1': 0
    };

    for (let i = 0; i < input.length; i++) {
        const bit = input[i][index];
        count[bit] += 1;
    }

    return {
        'most': count[0] > count[1] ? '0' : '1',
        'least': count[0] > count[1] ? '1' : '0'
    };
};

const partTwo = (input: Bit[][], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    // oxygen
    let o2reports = input.slice();
    let o2index = 0;
    while (o2reports.length > 1) {
        const count = getCount(o2reports, o2index);
        o2reports = o2reports.filter(row => row[o2index] === count.most);
        o2index += 1;
    }

    const o2Value = parseInt(o2reports[0].join(""), 2);

    // co2
    let co2reports = input.slice();
    let co2index = 0;
    while (co2reports.length > 1) {
        const count = getCount(co2reports, co2index);
        co2reports = co2reports.filter(row => row[co2index] === count.least);
        co2index += 1;
    }

    const co2Value = parseInt(co2reports[0].join(""), 2);

    return o2Value * co2Value;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Bit[][]) => {
    console.log(input);
};

const test = (_: Bit[][]) => {
    console.log("----Test-----");
};

export const solutionThree: Puzzle<Bit[][], number> = {
    day: 3,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
