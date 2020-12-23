import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { performance } from 'perf_hooks'

const processInput = async (day: number) => {
    return [3,8,9,1,2,5,4,6,7];
    // return [6,1,4,7,5,2,8,3,9];
};

const nextState = (current: number, cups: number[]) => {

    let cindex = cups.indexOf(current);
    const double = [...cups, ...cups];
    const pickUp = double.slice(cindex+1, cindex+4);
    let destination = (current === 1) ? 9 : current - 1;
    while (pickUp.indexOf(destination) !== -1) { 
        destination = (destination === 1) ? 9 : destination - 1
    }

    const result = cups.slice();
    for (const item of pickUp) {
        result.splice(result.indexOf(item), 1);
    }

    const dindex = result.indexOf(destination);
    result.splice(dindex+1, 0, ...pickUp);

    cindex = result.indexOf(current);
    current = result[(cindex + 1) % 9];

    return {
        current,
        cups: result
    }
}

const partOne = (input: number[], debug: boolean) => {
    let current = input[0];
    let cups = input.slice();

    for (let index = 0; index < 100; index += 1) {
        const result = nextState(current, cups);
        current = result.current;
        cups = result.cups;
    }

    const double = cups.join("").repeat(2);
    const result = double.slice(double.indexOf("1")).slice(1, 9);
    
    return +result;
};


const perfs = [0, 0, 0, 0, 0, 0]

const nexterState = (current: number, cups: number[]) => {

    let cindex = cups.indexOf(current);
    let e: number, s: number;

    s = performance.now();

    const pindices = [(cindex + 1) % 1_000_000, (cindex + 2) % 1_000_000, (cindex + 3) % 1_000_000];

    pindices.sort((f, s) => s-f);

    const pickUp = [
        cups[pindices[0]],
        cups[pindices[1]],
        cups[pindices[2]],
    ];
    e = performance.now();
    perfs[0] += e - s;
    perfs[1] += e - s;

    let destination = (current === 1) ? 1_000_000 : current - 1;
    while (pickUp.indexOf(destination) !== -1) { 
        destination = (destination === 1) ? 1_000_000 : destination - 1
    }

    s = performance.now();
    const result = cups.slice();
    e = performance.now();
    perfs[0] += e - s;
    perfs[2] += e - s;

    s = performance.now();
    for (const pindex of pindices) {
        result.splice(pindex, 1);
    }
    e = performance.now();
    perfs[0] += e - s;
    perfs[3] += e - s;

    s = performance.now();
    const dindex = result.indexOf(destination);
    result.splice(dindex+1, 0, ...pickUp);
    e = performance.now();
    perfs[0] += e - s;
    perfs[4] += e - s;

    s = performance.now();
    cindex = result.indexOf(current);
    current = result[(cindex + 1) % 1_000_000];
    e = performance.now();
    perfs[0] += e - s;
    perfs[5] += e - s;

    return {
        current,
        cups: result
    }
}


const partTwo = (input: number[], debug: boolean) => {

    let current = input[0];
    let cups = new Array(1_000_000).fill(0).map((_, index) => index + 1);
    cups.splice(0, 9, ...input);

    for (let index = 0; index < 100; index += 1) {
        if (index % 10 === 0) {
            console.log(index);
        }
        const result = nexterState(current, cups);
        current = result.current;
        cups = result.cups;
    }

    console.log(perfs);

    return 0;
};

const resultOne = (_: any, result: number) => {
    return `The labels on the cups are ${result}`;
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

export const solutionTwentyThree: Puzzle<number[], number> = {
    day: 23,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
