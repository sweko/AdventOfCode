import { readInput, loopMatrix, readInputLines } from "../extra/aoc-helper";
import { performance } from "perf_hooks";
import "../extra/array-helpers";

type Bit = 0 | 1;

interface Rule {
    match: Bit[];
    result: Bit;
}

interface MatchTree {
    bit: Bit;
    result: Bit;
    zero: MatchTree;
    one: MatchTree;
    children: [MatchTree, MatchTree];
}

async function main() {
    const startInput = performance.now();

    const lines = await readInputLines();

    const initialState = lines[0].slice(15).split("").map(char => char === "." ? 0 : 1);
    const rules: Rule[] = lines.slice(2).map(line => {
        const match = line.slice(0, 5).split("").map(char => char === "." ? 0 : 1);
        const result: Bit = line[9] === "." ? 0 : 1;
        return { match, result }
    });

    const endInput = performance.now();
    console.log(`Running time for input is ${Math.round(endInput - startInput)}ms`);

    const startOne = performance.now();
    let plantValue = processPartOne(initialState, rules);
    const endOne = performance.now();

    console.log(`Part 1: Total value of all plants is ${plantValue}`);
    console.log(`Running time for part 1 is ${Math.round(endOne - startOne)}ms`);

    const startTwo = performance.now();
    plantValue = processPartTwo(initialState, rules);
    const endTwo = performance.now();

    console.log(`Part 1: Total value of all plants is ${plantValue}`);
    console.log(`Running time for part 2 is ${Math.round(endTwo - startTwo)}ms`);
}

function ruleToString(rule: Rule) {
    return `${rule.match.map(c => c ? "#" : ".").join("")} => ${rule.result ? "#" : "."}`;
}

function checkRule(state: Bit[], startIndex, rule: Rule) {
    const len = rule.match.length;
    for (let index = 0; index < len; index++) {
        if (state[startIndex + index] !== rule.match[index]) {
            return false;
        }
    }
    return true;
};

function processPartOne(initialState: Bit[], rules: Rule[]): number {
    const generations = 20;
    let offset = 0;
    let state = initialState.slice();
    for (let gindex = 0; gindex < generations; gindex++) {
        const generation = runGeneration(state, rules);
        state = generation.state;
        offset += generation.offset;
    }
    return state.sum((item, index) => item ? index - offset : 0);
}

function processPartTwo(initialState: Bit[], rules: Rule[]): number {
    const generations = 50000000000;
    let offset = 0;
    let state = initialState.slice();
    let gindex = 0;
    while (true) {
        const before = state.map(value => value ? "#" : ".").join("");
        const generation = runGeneration(state, rules);
        state = generation.state;
        offset += generation.offset;
        const after = state.map(value => value ? "#" : ".").join("");
        if (before === after) {
            // stable configuration found
            offset += (generations - gindex - 1) * generation.offset;
            break;
        }
        gindex++;
    }

    return state.sum((item, index) => item ? index - offset : 0);
}

function runGeneration(state: Bit[], rules: Rule[]) {
    const ruleLength = rules[0].match.length;
    state.unshift(0, 0, 0, 0);
    state.push(0, 0, 0, 0);
    let offset = 2;
    const newState = [];
    for (let index = 0; index < state.length - ruleLength + 1; index++) {
        const matchRule = rules.find(rule => checkRule(state, index, rule));
        newState.push(matchRule.result);
    }
    state = newState;
    while (!state[0]) {
        state.shift();
        offset -= 1;
    }
    while (!state[state.length - 1]) {
        state.pop();
    }
    return { state, offset };
}

function printState(state: Bit[], offset: number) {
    const stateString = state.map(value => value ? "#" : ".").join("");
    console.log(`Offset: ${offset}: ${stateString}`);
}


main();