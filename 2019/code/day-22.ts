import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { absmod, mulmod, powmod, modinverse } from "../extra/num-helpers";

interface LinearOp {
    a: number;
    b: number;
    m: number;
}

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

const partOne = (ops: Op[], debug: boolean) => {
    const deckSize = 10007;
    const index = 2019;
    const operation = combineOps(ops, deckSize);
    return exec(operation, index);
};

const repeat = (linop: LinearOp, times: number): LinearOp => {
    const digits = times.toString(2).split("").map(c => Number(c)).slice(1);
    let result = linop;

    for (const digit of digits) {
        result = combineLinOps(result, result);
        if (digit === 1) {
            result = combineLinOps(result, linop);
        }
    }

    return result;
}

const partTwo = (ops: Op[], debug: boolean) => {
    const deckSize = 119_315_717_514_047;

    const steps = 101_741_582_076_661;
    const operation = repeat(combineOps(ops, deckSize), steps);

    const lookup = inverse(operation);

    return exec(lookup, 2020);
};

const resultOne = (_: any, result: number) => {
    return `Position of card 2019 is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The card in position 2020 is ${result}`;
};

const showInput = (input: Op[]) => {
    console.log(input);
};

const combineLinOps = (first: LinearOp, second: LinearOp): LinearOp => {
    return {
        a: mulmod(first.a, second.a, first.m),
        b: absmod(mulmod(first.a, second.b, first.m) + first.b, first.m),
        m: first.m
    }
}

const combineOps = (ops: Op[], length: number): LinearOp => {
    let a = 1;
    let b = 0;

    for (const op of ops) {
        if (op.type === "dealInto") {
            a *= -1;
            b = -b - 1;
        } else if (op.type === "cut") {
            b -= op.offset;
        } else {
            a = mulmod(a, op.increment, length);
            b = mulmod(b, op.increment, length);
        }
        a = absmod(a, length);
        b = absmod(b, length);
    }

    return { a, b, m: length }
}

const inverse = (operation: LinearOp): LinearOp => {
    const ainverse = modinverse(operation.a, operation.m);
    return {
        a: ainverse,
        b: mulmod(-operation.b, ainverse, operation.m),
        m: operation.m
    };
};

const exec = (op: LinearOp, n: number): number => {
    const an = mulmod(op.a, n, op.m);
    return absmod(an + op.b, op.m);
}

const test = (ops: Op[]) => {
    // const deckSize = 119_315_717_514_047;
    // const steps = 101_741_582_076_661;
    // const operation = combineOps(ops, deckSize);
    // console.log(repeat(operation, steps));

    console.log(powmod(2, 20, 1000000));
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
