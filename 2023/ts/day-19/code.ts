// Solution for day 19 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type Category = 'x' | 'm' | 'a' | 's';

interface Part {
    x: number;
    m: number;
    a: number;
    s: number;
}

abstract class Rule {
    public abstract readonly kind:string;

    constructor(public readonly target: string) { }

    private static ruleRegex = /^(x|m|a|s)(>|<)(\d+):(\w+)$/;

    static parse(line: string): Rule {
        const match = line.match(Rule.ruleRegex);
        if (!match) {
            return new EverythingRule(line);
        }
        const [_, category, direction, value, target] = match;
        return new QualifiedRule(target, category as Category, direction as ">" | "<", parseInt(value, 10));
    }

    abstract matches(part: Part): boolean;
}

class QualifiedRule extends Rule {
    public readonly kind = "qualified";

    constructor(
        readonly target: string, 
        public readonly category: Category, 
        public readonly direction: ">" | "<",
        public readonly value: number) {
        super(target);
    }

    matches(part: Part): boolean {
        if (this.direction === "<") {
            return part[this.category] < this.value;
        } else {
            return part[this.category] > this.value;
        }
    }
}

class EverythingRule extends Rule {
    public readonly kind = "everything";

    constructor(readonly target: string) {
        super(target);
    }

    matches(_part: Part): boolean {
        return true;
    }
}

class Workflow {
    constructor(public name:string, public rules: Rule[]) {}
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const wfRegex = /^(\w+){(.*)}$/;
    let line = lines.shift()!;
    const workflows: Record<string, Workflow> = {};
    while (line !== "") {
        // process workflows
        const match = line.match(wfRegex);
        if (!match) {
            throw Error("Invalid workflow definition");
        }
        const [, name, rules] = match;
        const ruleStrings = rules.split(",");
        const wfRules = ruleStrings.map(rs => Rule.parse(rs));
        workflows[name] = new Workflow(name, wfRules);
        line = lines.shift()!;
    }
    const partRegex = /^{x=(\d+),m=(\d+),a=(\d+),s=(\d+)}$/;
    const parts = lines.map(line => {
        const match = line.match(partRegex);
        if (!match) {
            throw Error("Invalid part definition");
        }
        const [, x, m, a, s] = match;
        return {x: parseInt(x, 10), m: parseInt(m, 10), a: parseInt(a, 10), s: parseInt(s, 10)};
    });
    return {parts, workflows};
};

interface Situation {
    parts: Part[];
    workflows: Record<string, Workflow>;
}

const partOne = ({parts, workflows}: Situation, debug: boolean) => {
    let accCount = 0;
    for (const part of parts) {
        let wfName = "in";
        while (wfName !== "A" && wfName !== "R") {
            const workflow = workflows[wfName];
            const nextWorkflow = workflow.rules.find(rule => rule.matches(part))?.target;
            if (!nextWorkflow) {
                throw Error("No matching rule found");
            }
            wfName = nextWorkflow;
        }
        if (wfName === "A") {
            //console.log(`part ${part.x},${part.m},${part.a},${part.s}, is accepted`);
            accCount += part.x + part.m + part.a + part.s;
        } else {
            //console.log(`part ${part.x},${part.m},${part.a},${part.s}, is rejected`);
        }
    }

    return accCount;
};

const partTwo = (input: Situation, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    return -1;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Situation) => {
    console.log(input);
};

const test = (_: Situation) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Situation, number> = {
    day: 19,
    input: () => processInput(19),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}