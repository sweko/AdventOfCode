import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

type Operation = (deck: number[]) => number[];

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const result = [];
    for (const line of lines) {
        if (line === "deal into new stack") {
            result.push(dealInto);
        } else if (line.startsWith("cut")) {
            const offset = Number(line.slice(4));
            result.push(cut(offset));
        } else if (line.startsWith("deal with increment")) {
            const increment = Number(line.slice(20));
            result.push(dealBy(increment));
        } else {
            throw Error("Invalid input " + line);
        }
    }
    return result;
};

const dealInto = (cards: number[]) => {
    const result = Array(cards.length);
    for (let index = 0; index < cards.length; index++) {
        const card = cards[index];
        result[cards.length - index - 1] = card;
    }
    return result;
}

const cut = (offset: number) => (cards: number[]) => {
    if (offset < 0) offset = cards.length + offset;
    const back = cards.slice(offset);
    const front = cards.slice(0, offset);
    return [...back, ...front];
}

const dealBy = (increment: number) => (cards: number[]) => {
    const result = Array(cards.length);
    for (let index = 0; index < cards.length; index++) {
        const card = cards[index];
        const position = (index * increment) % cards.length;
        result[position] = card;
    }
    return result;
}

const partOne = (operations: Operation[], debug: boolean) => {
    let deck = Array(10007).fill(0).map((_, index)=>index);

    for (const operation of operations) {
        deck = operation(deck);
    }
    return deck.indexOf(2019);
};

const partTwo = (operations: Operation[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    return 0;
};

const resultOne = (_: any, result: number) => {
    return `Position of card 2019 is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The period of the orbit is ${result}`;
};

const showInput = (input: Operation[]) => {
    console.log(input);
};

const test = (_: Operation[]) => {
    const deck = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    console.log(dealInto(deck));
    console.log(cut(3)(deck));
    console.log(cut(-4)(deck));
    console.log(dealBy(3)(deck));
    console.log("---");
    let t1 = dealBy(7)(deck);
    t1 = dealInto(t1);
    t1 = dealInto(t1);
    console.log(t1);
    console.log("---");
    let t2 = cut(6)(deck);
    t2 = dealBy(7)(t2);
    t2 = dealInto(t2)
    console.log(t2);
};

export const solution22: Puzzle<Operation[], number> = {
    day: 22,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
