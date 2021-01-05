import "../extra/array-helpers";
import { Puzzle } from "./model";
import { CircularBuffer } from "../extra/circular-buffer";

const processInput = async (day: number) => {
    // return [3,8,9,1,2,5,4,6,7];
    return "614752839".split("").map(c => +c);
};

const nextState = (current: number, cups: CircularBuffer<number>, size: number) => {
    let pickUp = cups.removeAfter(current, 3);

    let destination = (current === 1) ? size : current - 1;
    while (pickUp.indexOf(destination) !== -1) { 
        destination = (destination === 1) ? size : destination - 1
    }

    cups.addAfter(destination, ...pickUp);

    return {
        current: cups.next(current),
        cups
    }
}

const partOne = (input: number[], debug: boolean) => {
    let current = input[0];
    let cups = new CircularBuffer(input);
    let size = input.length;

    for (let index = 0; index < 100; index += 1) {
        const result = nextState(current, cups, size);
        current = result.current;
        cups = result.cups;
    }

    const result = cups.toArray(1).join("").slice(1);

    return +result;
};


const partTwo = (input: number[], debug: boolean) => {

    let current = input[0];
    let cupsArray = new Array(1_000_000).fill(0).map((_, index) => index + 1);
    cupsArray.splice(0, 9, ...input);
    let size = 1_000_000;

    let cups = new CircularBuffer(cupsArray);

    for (let index = 0; index < 10_000_000; index += 1) {
        if (debug && (index % 123457 === 0)) {
            console.log(index);
        }
        const result = nextState(current, cups, size);
        current = result.current;
        cups = result.cups;
    }

    const fstar = cups.next(1);
    const sstar = cups.next(fstar);

    return fstar * sstar;
};

const resultOne = (_: any, result: number) => {
    return `The labels on the cups are ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The product of the star labels is ${result}`;
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
