import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { toHash } from "../extra/hash-helpers";
import { Puzzle } from "./model";

type Operation = "+" | "-" | "*" | "/" | "=";
type OperationMonkey = { left: string | number, right: string | number;  operation: Operation };
type Monkey = number | OperationMonkey;
type Monkeys = Record<string, Monkey>;

const isOperationMonkey = (monkey: Monkey): monkey is OperationMonkey => {
    return typeof monkey === "object";
}

const isNumericMonkey = (monkey: Monkey): monkey is number => {
    return typeof monkey === "number";
}

const evalMonkey = (monkey: Monkey, monkeys: Monkeys):Monkey => {
    if (isNumericMonkey(monkey)) {
        return monkey;
    }
    const left = evalMonkey(monkeys[monkey.left], monkeys);
    if (isOperationMonkey(left)) {
        return monkey;
    }
    const right = evalMonkey(monkeys[monkey.right], monkeys);
    if (isOperationMonkey(right)) {
        return monkey;
    }
    switch (monkey.operation) {
        case "+": return left + right;
        case "-": return left - right;
        case "*": return left * right;
        case "/": return left / right;
    }
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const monkeyArray: {name: string, value: Monkey}[] = lines.map(line => {
        const match = line.match(/^(\w+): (?:(\d+)|(?:(\w+) (\+|-|\*|\/) (\w+)))$/);
        if (match[3] === undefined) {
            return { name: match[1], value: parseInt(match[2])};
        }
        return {name: match[1], value: { left: match[3], right: match[5], operation: match[4] as Operation }};
    });
    return toHash(monkeyArray, m => m.name, m => m.value);
};

const partOne = (input: Monkeys, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const result = evalMonkey(input["root"], input);
    if (isOperationMonkey(result)) {
        throw new Error("Invalid result");
    }
    return result;
};

type RecursiveMonkey = { left: string | number | OperationMonkey, right: string | number| OperationMonkey;  operation: Operation};

const flattenMonkey = (monkey: RecursiveMonkey): RecursiveMonkey => {

}

const partTwo = (input: Monkeys, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const monkeys:Monkeys = JSON.parse(JSON.stringify(input));

    const monkeyArray = Object.keys(monkeys).map(key => ({name: key, value: monkeys[key]}));
    const numerics = toHash(
        monkeyArray.filter(monkey => isNumericMonkey(monkey.value) && monkey.name !== "humn"), 
        m => m.name,
        m => m.value as number
    );
    const operationals = monkeyArray.filter(monkey => isOperationMonkey(monkey.value) && monkey.name !== "root").map(m => ({
        name: m.name,
        value: {...m.value as OperationMonkey}
    }));

    let loop = true;
    while (loop) {
        loop = false;
        for (let index = 0; index < operationals.length; index++) {
            const operational = operationals[index];

            if (!isOperationMonkey(operational.value)){ 
                continue;
            }

            const left = numerics[operational.value.left];
            const right = numerics[operational.value.right];
            if (left !== undefined && right !== undefined) {
                loop = true;
                let value: number;
                switch (operational.value.operation) {
                    case "+": value = left + right; break;
                    case "-": value = left - right; break;
                    case "*": value = left * right; break;
                    case "/": value = left / right; break;
                }
                numerics[operational.name] = value;
                operationals.splice(index, 1);
                index -=1;
            }
        }
    }

    for (const operational of operationals) {
        if (!isOperationMonkey(operational.value)) {
            continue;
        }
        const left = numerics[operational.value.left];
        if (left !== undefined) {
            operational.value.left = left;
        }
        const right = numerics[operational.value.right];
        if (right !== undefined) {
            operational.value.right = right;
        }
    }

    let monkey = "humn";
    let value: RecursiveMonkey = undefined;

    while (operationals.length > 0) {
        const mindex = operationals.findIndex(m => m.value.left === monkey || m.value.right === monkey);

        const [removed] = operationals.splice(mindex, 1);

        if (value !== undefined) {
            if (removed.value.left === monkey) {
                (removed.value as RecursiveMonkey).left = value;
            }
            if (removed.value.right === monkey) {
                (removed.value as RecursiveMonkey).right = value;
            }
        }
        monkey = removed.name;
        value = removed.value;

    }

    const x = operationals.find(m => m.value.left === "humn" || m.value.right === "humn");
    // console.log(x);

    //console.log(operationals);

    return 0;
};

const resultOne = (_: Monkeys, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: Monkeys, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Monkeys) => {
    console.log(input);
};

const test = (_: Monkeys) => {
    console.log("----Test-----");
};

export const solutionTwentyOne: Puzzle<Monkeys, number> = {
    day: 21,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
