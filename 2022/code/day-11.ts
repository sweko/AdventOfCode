import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Monkey {
    index: number;
    items: number[];
    operation: (worry: number) => number;
    test: (worry: number) => boolean;
    factor: number;
    trueIndex: number;
    falseIndex: number;
}

const makeOperation = (kind: "+"|"*", value: string) => {
    const constant = parseInt(value, 10);
    if (isNaN(constant)) {
        if (kind === "+") {
            return (worry: number) => worry + worry;
        }
        return (worry: number) => worry * worry;
    }

    if (kind === "+") {
        return (worry: number) => worry + constant;
    } else {
        return (worry: number) => worry * constant;
    }
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const result: Monkey[] = [];
    while (lines.length > 0) {
        const monkeyLine = lines.shift();
        const index = parseInt(monkeyLine.match(/^Monkey (\d+):$/)[1], 10);

        const itemLine = lines.shift();
        const itemMatch = itemLine.match(/^\s+Starting items: ((?:\d+, )*\d+)$/)[1];
        const items = itemMatch.split(", ").map(x => parseInt(x, 10));

        const operationLine = lines.shift();
        const operationMatch = operationLine.match(/^\s+Operation: new = old (\*|\+) (\d+|old)$/);
        const opKind = operationMatch[1];
        const opValue = operationMatch[2];
        const operation = makeOperation(opKind as "+"|"*", opValue);

        const testLine = lines.shift();
        const factor = parseInt(testLine.match(/^\s+Test: divisible by (\d+)$/)[1], 10);
        const test = (worry: number) => worry % factor === 0;

        const trueLine = lines.shift();
        const trueIndex = parseInt(trueLine.match(/^\s+If true: throw to monkey (\d+)$/)[1], 10);
        const falseLine = lines.shift();
        const falseIndex = parseInt(falseLine.match(/^\s+If false: throw to monkey (\d+)$/)[1], 10);

        lines.shift();

        result.push({
            index,
            items,
            operation,
            test,
            factor,
            trueIndex,
            falseIndex
        })
    }
    return result;
};

const takeMonkeyTurnOne = (monkey: Monkey, monkees: Monkey[]): number => {
    const result = monkey.items.length;
    for (const item of monkey.items) {
        const worryLevel = Math.floor(monkey.operation(item) / 3);
        if (monkey.test(worryLevel)) {
            monkees[monkey.trueIndex].items.push(worryLevel);
        } else {
            monkees[monkey.falseIndex].items.push(worryLevel);
        }
    }
    monkey.items = [];
    return result;
}

const partOne = (input: Monkey[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const monkeys = input.map(monkey => ({
        ...monkey,
        items: monkey.items.slice()
    }));

    let current = 0;
    let round = 1;
    const result = Array(monkeys.length).fill(0);

    while (round <= 20) {
        const inspecteds = takeMonkeyTurnOne(monkeys[current], monkeys);
        result[current] += inspecteds;
        current = (current + 1) % monkeys.length;
        if (current === 0) {
            round++;
        }
    }

    result.sort((a, b) => b - a);

    return result[0]*result[1];
};

const takeMonkeyTurnTwo = (monkey: Monkey, monkees: Monkey[], period: number): number => {
    const result = monkey.items.length;
    for (const item of monkey.items) {
        const worryLevel = monkey.operation(item) % period;
        if (monkey.test(worryLevel)) {
            monkees[monkey.trueIndex].items.push(worryLevel);
        } else {
            monkees[monkey.falseIndex].items.push(worryLevel);
        }
    }
    monkey.items = [];
    return result;
}

const partTwo = (input: Monkey[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const monkeys = input.map(monkey => ({
        ...monkey,
        items: monkey.items.slice()
    }));

    let current = 0;
    let round = 1;
    const result = Array(monkeys.length).fill(0);

    const period = monkeys.reduce((acc, monkey) => acc * monkey.factor, 1);

    while (round <= 10000) {
        const inspecteds = takeMonkeyTurnTwo(monkeys[current], monkeys, period);
        result[current] += inspecteds;
        current = (current + 1) % monkeys.length;
        if (current === 0) {
            round++;
        }
    }

    console.log(result);

    result.sort((a, b) => b - a);

    return result[0]*result[1];
};

const resultOne = (_: Monkey[], result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: Monkey[], result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Monkey[]) => {
    console.log(input);
};

const test = (_: Monkey[]) => {
    console.log("----Test-----");
};

export const solutionEleven: Puzzle<Monkey[], number> = {
    day: 11,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
