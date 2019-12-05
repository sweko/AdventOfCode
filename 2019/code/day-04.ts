import { readInputLines } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Range {
    from: number,
    to: number
}

const processInput = async (day: number) => {
    return {
        from: 372304,
        to: 847060
    };
};


const partOne = (range: Range) => {
    let counter = 0;
    for (let index = range.from; index <= range.to; index += 1) {
        const sindex = index +"";
        if (sindex !== sindex.split("").sort().join("")) {
            continue;
        }
        if (sindex.split("").groupBy(c => c).length === 6) {
            continue;
        }
        counter +=1;
    }
    return counter;
};

const partTwo = (range: Range) => {
    let counter = 0;
    for (let index = range.from; index <= range.to; index += 1) {
        const sindex = index +"";
        if (sindex !== sindex.split("").sort().join("")) {
            continue;
        }
        const digits = sindex.split("").groupBy(c => c);
        if (digits.filter(g => g.items.length===2).length === 0) {
            continue;
        }
        counter +=1;
    }
    return counter;
};

const resultOne = (_: any, result: number) => {
    return `The number of possible passwords is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The number of possible passwords is ${result}`;
};

const showInput = (range: Range) => {
    console.log(range);
};

const test = () => {
    partOne({
        from: 372304,
        to: 847060
    });
};

export const solutionFour: Puzzle<Range, number> = {
    day: 4,
    input: processInput,
    partOne,
    partTwo,
    resultOne,
    resultTwo,
    showInput,
    test,
}
