import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

type DeepArray = number| number[] | DeepArray[];

interface Signal {
    left: DeepArray;
    right: DeepArray;
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);

    const result: Signal[] = [];
    while (lines.length > 0) {
        const left = lines.shift();
        const right = lines.shift();
        lines.shift();
        result.push({ left: JSON.parse(left), right: JSON.parse(right) });
    }

    return result;
};

const partOne = (input: Signal[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let index = 1;
    let result = 0;
    for (const signal of input) {
        const comparisson = isInRightOrder(signal.left, signal.right);
        if (comparisson === 0) {
            //console.log(`Signal ${index}: EQUAL`);
        } else if (comparisson < 0) {
            //console.log(`Signal ${index}: NOT RIGHT ORDER`);
        } else {
            //console.log(`Signal ${index}: RIGHT ORDER`);
            result += index;
        }
        index += 1;
    }

    return result;
};

const isInRightOrder = (left: DeepArray, right: DeepArray): number =>  {
    if (Array.isArray(left) && Array.isArray(right)) {
        for (let index = 0; index < left.length; index++) {
            if (index === right.length) {
                return -1;
            }
            const result = isInRightOrder(left[index], right[index]);
            if (result !== 0) {
                return result;
            }
        }
        if (left.length < right.length) {
            return 1;
        }
        return 0;
    }

    if (Array.isArray(left)) {
        return isInRightOrder(left, [right]);
    }

    if (Array.isArray(right)) {
        return isInRightOrder([left], right);
    }

    // if both are integers, compare them
    return right - left;
}

const partTwo = (input: Signal[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const packets = input.flatMap(signal => [signal.left, signal.right]);
    const two = [[2]];
    const six = [[6]];
    packets.push(two, six);
    packets.sort((a, b) => isInRightOrder(b, a));
    const twindex = packets.indexOf(two) + 1;
    const sixdex = packets.indexOf(six) + 1;
    return twindex * sixdex;
};

const resultOne = (_: Signal[], result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: Signal[], result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Signal[]) => {
    console.log(input);
};

const test = (_: Signal[]) => {
    console.log("----Test-----");
};

export const solutionThirteen: Puzzle<Signal[], number> = {
    day: 13,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
