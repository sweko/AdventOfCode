import "../extra/array-helpers";
import { mulmod, powmod } from "../extra/num-helpers";
import { Puzzle } from "./model";

const modulo = 20201227;

const processInput = async (day: number) => {
    // return [5764801, 17807724];
    return [13135480, 8821721];
};

const partOne = (input: number[], debug: boolean) => {
    const cardPublic = input[0];
    const doorPublic = input[1];

    let cardLoopSize = findLoopSize(cardPublic);

    let result = 1;
    for (let loop = 0; loop < cardLoopSize; loop +=1) {
        result = mulmod(result, doorPublic, modulo);
    }

    return result;
};

const resultOne = (_: any, result: number) => {
    return `The encryption key is ${result}`;
};

const showInput = (input: number[]) => {
    console.log(input);
};

const test = (_: number[]) => {
    console.log("----Test-----");
};

export const solutionTwentyFive: Puzzle<number[], number> = {
    day: 25,
    input: processInput,
    partOne,
    resultOne: resultOne,
    showInput,
    test,
}

function findLoopSize(target: number) {
    let state = 1;
    const subject = 7;

    let loopSize = 0;
    while (state !== target) {
        state = mulmod(state, subject, modulo);
        loopSize += 1;
    }
    return loopSize;
}

