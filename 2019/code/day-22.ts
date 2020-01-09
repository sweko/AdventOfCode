import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { mod } from "../extra/num-helpers";

type MapOperation = (deck: number[]) => number[];
type Operation = (card: number) => number;

interface DealInto {
    type: "dealInto";
}

interface Cut {
    type: "cut",
    offset: number;
}

interface DealBy {
    type: "dealBy",
    increment: number;
}

type Op = DealInto | Cut | DealBy;

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const result: Op[] = [];
    for (const line of lines) {
        if (line === "deal into new stack") {
            result.push({ type: "dealInto" });
        } else if (line.startsWith("cut")) {
            const offset = Number(line.slice(4));
            result.push({ type: "cut", offset });
        } else if (line.startsWith("deal with increment")) {
            const increment = Number(line.slice(20));
            result.push({ type: "dealBy", increment });
        } else {
            throw Error("Invalid input " + line);
        }
    }
    return result;
};

// const dealInto = (cards: number[]) => {
//     const result = Array(cards.length);
//     for (let index = 0; index < cards.length; index++) {
//         const card = cards[index];
//         const position = cards.length - index - 1;
//         result[position] = card;
//     }
//     return result;
// }

// const cut = (offset: number) => (cards: number[]) => {
//     const result = Array(cards.length);
//     for (let index = 0; index < cards.length; index++) {
//         const card = cards[index];
//         const position = (index + cards.length - offset) % cards.length;
//         result[position] = card;
//     }
//     return result;
// }

// const dealBy = (increment: number) => (cards: number[]) => {
//     const result = Array(cards.length);
//     for (let index = 0; index < cards.length; index++) {
//         const card = cards[index];
//         const position = (index * increment) % cards.length;
//         result[position] = card;
//     }
//     return result;
// }

const partOne = (ops: Op[], debug: boolean) => {
    const deckSize = 10007;
    const index = 2019;
    const operation = combineOps(ops, deckSize);
    return operation(index);
};

const partTwo = (ops: Op[], debug: boolean) => {
    const deckSize = 119_315_717_514_047;
    // go backward, i.e. where does a card have to be to end up in pos 2020?
    // use part 1 to reverse engineer

    const operation = combineOps(ops, deckSize);
    return operation(2020);
    return 0;
};

const resultOne = (_: any, result: number) => {
    return `Position of card 2019 is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The period of the orbit is ${result}`;
};

const showInput = (input: Op[]) => {
    console.log(input);
};

const combineOps = (ops: Op[], length: number): Operation => {
    let a = 1;
    let b = 0;

    for (const op of ops) {
        if (op.type === "dealInto") {
            a *= -1;
            b = -b - 1;
        } else if (op.type === "cut") {
            b -= op.offset;
        } else {
            if (a * op.increment > Number.MAX_SAFE_INTEGER) {
                console.log("OVERFLOW", a, op.increment);
            }
            a *= op.increment;
            b *= op.increment;
        }
        a = mod(a, length);
        b = mod(b, length);
    }
    console.log(a, b);
    return (n: number) => mod(a * n + b, length);
}

const test = (ops: Op[]) => {
    let deck = Array(11).fill(0).map((_, index) => index);

    const operation = combineOps(ops, deck.length);
    console.log(deck.map(card => operation(card)));
    // for (const op of ops) deck = getOperation(op)(deck);
    // console.log(deck);




    // const rops = ops.reverse();
    // // unscramble
    // const invDealInto = (deck: number[]) => (position: number) => deck.length - position - 1;
    // const invCutBy = (deck: number[]) => (position: number) => deck.length - position - 1;



    // // maximum deal by increment: 
    // const maxDealBy = ops.filter(op => op.type === "dealBy").max(op  => (op as DealBy).increment);
    // console.log(maxDealBy);

    // // inverse of deal into is deal into :)
    // let deck = Array(15).fill(0).map((_, index) => index);

    // // inverse of deal into is deal into
    // let result = dealInto(dealInto(deck));

    // // inverse of cut (x) is cut (-x) 
    // let change = cut(3)(deck);
    // result = cut(-3)(change);
    // console.log(result);

};

export const solution22: Puzzle<Op[], number> = {
    day: 22,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
