import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    return lines.map(line => parseInt(line, 10));
};

const partOne = (input: number[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const data = input.slice().map((value, index) => ({ value, index }));
    const queue = data.slice();

    while (queue.length > 0) {
        const item = queue.shift();
        const itemIndex = data.indexOf(item);
        if (item.value === 0) {
            // no need to massage the data if the value is 0
            continue;
        }
        let nextIndex = itemIndex + item.value;
        if (nextIndex < 0) {
            nextIndex = nextIndex % data.length;
        }
        if (nextIndex >= data.length) {
            nextIndex = nextIndex % data.length + 1;
        }
        if (nextIndex === 0) {
            nextIndex = data.length - 1;
        }

        // console.log(itemIndex, nextIndex, item);

        data.splice(itemIndex, 1)
        data.splice(nextIndex, 0, item);

        // console.log(data.map(item => item.value).join(", "));
        // console.log("=====================================");
    }

    const zeroIndex = data.findIndex(item => item.value === 0);
    const one = data[(zeroIndex + 1000) % data.length];
    const two = data[(zeroIndex + 2000) % data.length];
    const three = data[(zeroIndex + 3000) % data.length];
    console.log(one, two, three);
    return one.value + two.value + three.value;
};

const partTwo = (input: number[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    return 0;
};

const resultOne = (_: number[], result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: number[], result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: number[]) => {
    console.log(input);
};

const test = (_: number[]) => {
    console.log("----Test-----");
};

export const solutionTwenty: Puzzle<number[], number> = {
    day: 20,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
