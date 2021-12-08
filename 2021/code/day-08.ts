import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Mapping {
    digits: string[];
    values: string[];
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const result = lines.map(line => ({
        digits: line.substring(0, 58).split(" ").map(digit => digit.split('').sort().join("")),
        values: line.substring(61).split(" ").map(digit => digit.split('').sort().join(""))
    }))
    return result;
};

const partOne = (input: Mapping[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    const singles = [2, 3, 4, 7];

    const result = input
        .map(mapping => mapping.values.filter(value => singles.includes(value.length)).length)
        .reduce((acc, curr) => acc + curr, 0);

    return result;
};

const partTwo = (input: Mapping[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let result = 0;
    for (const mapping of input) {
        const one = mapping.digits.find(digit => digit.length === 2).split("");
        const four = mapping.digits.find(digit => digit.length === 4).split("");
        const seven = mapping.digits.find(digit => digit.length === 3).split("");
        const eight = mapping.digits.find(digit => digit.length === 7).split("");

        const topSegment = seven.find(segment => !one.includes(segment));

        const ssixes = mapping.digits
            .filter(digit => digit.length === 6)
            .map(digit => digit.split(""));

        // only six-segment number that has all the segments in four and seven
        const nine = ssixes.find(digit => seven.every(segment => digit.includes(segment)) && four.every(segment => digit.includes(segment)));

        const bottomSegment = nine.find(segment => !seven.includes(segment) && !four.includes(segment));
        const lowLeftSegment = eight.find(segment => !nine.includes(segment));

        const zero = ssixes
            .filter(digit => digit !== nine)
            .find(digit => one.every(segment => digit.includes(segment)));

        const helper = [topSegment, bottomSegment, lowLeftSegment, ...one];
        const highLeftSegment = zero.find(segment => !helper.includes(segment));

        const helper2 = [topSegment, bottomSegment, lowLeftSegment, highLeftSegment, ...one];
        const centerSegment = eight.find(segment => !helper2.includes(segment));

        const six = ssixes.find(digit => digit !== nine && digit !== zero);
        const highRightSegment = one.find(segment => !six.includes(segment));

        const helper3 = [topSegment, bottomSegment, lowLeftSegment, highLeftSegment, highRightSegment, centerSegment];
        const lowRightSegment = eight.find(segment => !helper3.includes(segment));

//         console.log(`
//      ${topSegment}${topSegment}${topSegment}${topSegment}
//     ${highLeftSegment}    ${highRightSegment}
//     ${highLeftSegment}    ${highRightSegment}
//      ${centerSegment}${centerSegment}${centerSegment}${centerSegment} 
//     ${lowLeftSegment}    ${lowRightSegment}
//     ${lowLeftSegment}    ${lowRightSegment}
//      ${bottomSegment}${bottomSegment}${bottomSegment}${bottomSegment} 
// `);
        const two = [topSegment, highRightSegment, centerSegment, lowLeftSegment, bottomSegment].sort();
        const three = [topSegment, highRightSegment, centerSegment, lowRightSegment, bottomSegment].sort();
        const five = [topSegment, highLeftSegment, centerSegment, lowRightSegment, bottomSegment].sort();

        const digits = [
            zero.join(""),
            one.join(""),
            two.join(""),
            three.join(""),
            four.join(""),
            five.join(""),
            six.join(""),
            seven.join(""),
            eight.join(""),
            nine.join(""),
        ];

        const value = digits.indexOf(mapping.values[0]) * 1000
            + digits.indexOf(mapping.values[1]) * 100
            + digits.indexOf(mapping.values[2]) * 10
            + digits.indexOf(mapping.values[3]);

        result += value;
    }

    return result;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Mapping[]) => {
    console.log(input);
};

const test = (_: Mapping[]) => {
    console.log("----Test-----");
};

export const solutionEight: Puzzle<Mapping[], number> = {
    day: 8,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
