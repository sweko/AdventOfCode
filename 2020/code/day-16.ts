import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Rule {
    name: string;
    low : {min: number, max: number};
    high : {min: number, max: number};
}

interface Situation {
    rules: Rule[],
    ticket: number[];
    others: number[][];
}

const processInput = async (day: number) : Promise<Situation> => {
    const input = await readInputLines(day);
    const regex = /^(.*): (\d+)-(\d+) or (\d+)-(\d+)$/;
    let index = 0;
    const rules: Rule[] = [];
    while (input[index] !== "") {
        const match = input[index].match(regex);
        rules.push({
            name : match[1],
            low: {
                min: +match[2],
                max: +match[3]
            },
            high: {
                min: +match[4],
                max: +match[5]
            }
        });
        index += 1;
    };

    index +=2;
    const ticket = input[index].split(",").map(item => +item);
    index +=3;
    const others = [];
    while (index < input.length) {
        others.push(input[index].split(",").map(item => +item));
        index += 1;
    }
    return {
        rules,
        ticket,
        others
    };
};

const isValid = (rule: Rule, value: number):boolean => {
    if (rule.low.min <= value && rule.low.max >= value) {
        return true;
    }
    if (rule.high.min <= value && rule.high.max >= value) {
        return true;
    }
    return false;
}

//const isValueInvalid = (rule: Rule[], value: number) => rule.every(rule => !isValid(rule, value));

const isValueValid = (rule: Rule[], value: number) => rule.some(rule => isValid(rule, value));

const isRuleValid = (rule: Rule, values: number[]) => values.every(value => isValid(rule, value));


const partOne = (input: Situation, debug: boolean) => {
    let sum = 0;
    for (const ticket of input.others) {
        for (const value of ticket) {
            if (!isValueValid(input.rules, value)) {
                sum += value;
            }
        }
    }
    return sum;
};

const partTwo = (input: Situation, debug: boolean) => {
    const valids = input.others.filter(ticket => ticket.every(item => isValueValid(input.rules, item)));

    const fields: number[][] = new Array(input.ticket.length).fill(0).map(_ => []);

    for (const ticket of valids) {
        for (let i=0; i < ticket.length; i +=1) {
            fields[i].push(ticket[i]);
        }
    }

    let rules = input.rules.slice();
    const matches: {name: string, index: number}[] = [];

    while (rules.length !== 0) {
        for (let index =0; index < fields.length; index +=1) {
            const field = fields[index];
            const validRules = rules.filter(rule => isRuleValid(rule, field));
            if (validRules.length === 1) {
                const fieldRule = validRules[0];
                rules = rules.filter(rule => rule !== fieldRule);
                matches.push({name: fieldRule.name, index});
                field.unshift(-1);
            }
        }
    }

    const result = matches
        .filter(match => match.name.startsWith("departure"))
        .map(match => input.ticket[match.index])
        .reduce((acc, value) => acc * value, 1);

    return result;
};

const result1 = (_: any, result: number) => {
    return `The ticket scanning error rate is ${result}`;
};

const result2 = (_: any, result: number) => {
    return `The departure product is ${result}`;
};

const showInput = (input: Situation) => {
    console.log(input);
};

const test = (_: Situation) => {
    console.log("----Test-----");
};

export const solutionSixteen: Puzzle<Situation, number> = {
    day: 16,
    input: processInput,
    partOne,
    partTwo: partTwo,
    resultOne: result1,
    resultTwo: result2,
    showInput,
    test,
}
