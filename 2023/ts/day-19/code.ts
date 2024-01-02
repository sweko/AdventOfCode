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


interface Hypercube {
    x: {
        min: number;
        max: number;
    }
    m: {
        min: number;
        max: number;
    }
    a: {
        min: number;
        max: number;
    }
    s: {
        min: number;
        max: number;
    }
}

type HypercubeResult = {
    hypercube: Hypercube;
    next: string;
}

type HypercubeRuleResult = {
    matched: Hypercube | null;
    unmatched: Hypercube | null;
    next: string;
}

abstract class Rule {

    public abstract readonly kind: string;

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
    abstract executeMatch(hypercube: Hypercube): HypercubeRuleResult;
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

    private executeLess(hypercube: Hypercube): HypercubeRuleResult {
        // is the rule applicable to the hypercube?
        if (hypercube[this.category].min >= this.value) {
            // rule is not applicable
            return {
                matched: null,
                unmatched: hypercube,
                next: this.target
            };
        }

        // is the whole hypercube matched?
        if (hypercube[this.category].max < this.value) {
            // whole hypercube is matched
            return {
                matched: hypercube,
                unmatched: null,
                next: this.target
            };
        }

        // split hypercube
        const matched: Hypercube = {
            ...hypercube,
            [this.category]: {
                min: hypercube[this.category].min,
                max: this.value - 1
            }
        };
        const unmatched: Hypercube = {
            ...hypercube,
            [this.category]: {
                min: this.value,
                max: hypercube[this.category].max
            }
        };

        return {
            matched,
            unmatched,
            next: this.target
        };
    }

    private executeMore(hypercube: Hypercube): HypercubeRuleResult {
        // is the rule applicable to the hypercube?
        if (hypercube[this.category].max <= this.value) {
            // rule is not applicable
            return {
                matched: null,
                unmatched: hypercube,
                next: this.target
            };
        }

        // is the whole hypercube matched?
        if (hypercube[this.category].min > this.value) {
            // whole hypercube is matched
            return {
                matched: hypercube,
                unmatched: null,
                next: this.target
            };
        }

        // split hypercube
        const matched: Hypercube = {
            ...hypercube,
            [this.category]: {
                min: this.value + 1,
                max: hypercube[this.category].max
            }
        };
        const unmatched: Hypercube = {
            ...hypercube,
            [this.category]: {
                min: hypercube[this.category].min,
                max: this.value
            }
        };

        return {
            matched,
            unmatched,
            next: this.target
        };
    }

    executeMatch(hypercube: Hypercube): HypercubeRuleResult {
        if (this.direction === "<") {
            return this.executeLess(hypercube);
        } else {
            return this.executeMore(hypercube);
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

    executeMatch(hypercube: Hypercube): HypercubeRuleResult {
        return {
            matched: hypercube,
            unmatched: null,
            next: this.target
        };
    }
}

class Workflow {
    constructor(public name: string, public rules: Rule[]) { }

    // execute(hypercubes: Hypercube[]) {
    //     const results: HypercubeResult[] = [];
    //     for (const hypercube of hypercubes) {
    //         const hcResult = this.executeHypercube(hypercube);
    //         results.push(...hcResult);
    //     }
    //     return results;
    // }

    executeHypercube(hypercube: Hypercube) {
        const results: HypercubeResult[] = [];
        let activeHypercube = hypercube;
        for (const rule of this.rules) {
            const match = rule.executeMatch(activeHypercube);
            if (match.matched) {
                results.push({
                    hypercube: match.matched,
                    next: match.next
                });
            }
            if (match.unmatched) {
                activeHypercube = match.unmatched;
            }
        }
        return results;
    }

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
        return { x: parseInt(x, 10), m: parseInt(m, 10), a: parseInt(a, 10), s: parseInt(s, 10) };
    });
    return { parts, workflows };
};

interface Situation {
    parts: Part[];
    workflows: Record<string, Workflow>;
}

const partOne = ({ parts, workflows }: Situation, debug: boolean) => {
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


const partTwo = ({ workflows }: Situation, debug: boolean) => {
    const hypercube: Hypercube = {
        x: { min: 1, max: 4000 },
        m: { min: 1, max: 4000 },
        a: { min: 1, max: 4000 },
        s: { min: 1, max: 4000 }
    };

    // start with the "in" workflow
    const hcResults = workflows["in"].executeHypercube(hypercube);

    const accepteds: Hypercube[] = [];

    while (hcResults.length > 0) {
        const hcResult = hcResults.shift()!;
        if (hcResult.next === "A") {
            accepteds.push(hcResult.hypercube);
            continue;
        }
        if (hcResult.next === "R") {
            continue;
        }

        const workflow = workflows[hcResult.next];
        const nextResults = workflow.executeHypercube(hcResult.hypercube)

        hcResults.push(...nextResults);
    }

    let totalHypervolume = 0;

    for (const hypercube of accepteds) {
        const xsize = hypercube.x.max - hypercube.x.min + 1;
        const msize = hypercube.m.max - hypercube.m.min + 1;
        const asize = hypercube.a.max - hypercube.a.min + 1;
        const ssize = hypercube.s.max - hypercube.s.min + 1;
        const hypervolume = xsize * msize * asize * ssize;
        totalHypervolume += hypervolume;
    }

    return totalHypervolume;
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