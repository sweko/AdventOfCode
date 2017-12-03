import { readInput, readInputLines } from "../extra/aoc-helper";
import * as md5 from "md5";

async function main() {
    const input = "dmypynyp";

    let path = processPartOne(input);
    console.log(`Part 1: shortest path is ${path}`);

    let patLength = processPartTwo(input);
    console.log(`Part 2: longes path is ${patLength} steps long`);
}

interface State {
    left: number;
    top: number;
    path: string;
}

function generateNextStates(seed: string, state: State) {
    const hash = md5(seed + state.path).slice(0, 4);
    const states: State[] = [];
    if (hash[0] > 'a') {
        if (state.top !== 0) {
            states.push({
                left: state.left,
                top: state.top - 1,
                path: state.path + "U"
            })
        }
    }
    if (hash[1] > 'a') {
        if (state.top !== 3) {
            states.push({
                left: state.left,
                top: state.top + 1,
                path: state.path + "D"
            })
        }
    }
    if (hash[2] > 'a') {
        if (state.left !== 0) {
            states.push({
                left: state.left - 1,
                top: state.top,
                path: state.path + "L"
            })
        }
    }
    if (hash[3] > 'a') {
        if (state.left !== 3) {
            states.push({
                left: state.left + 1,
                top: state.top,
                path: state.path + "R"
            })
        }
    }
    return states;
}

function processPartOne(seed: string) {
    let state: State = {
        left: 0,
        top: 0,
        path: ""
    }
    let states = generateNextStates(seed, state);
    while (true) {
        states = [].concat(...states.map(state => generateNextStates(seed, state)));
        const finals = states.filter(state => state.left === 3 && state.top===3);
        if (finals.length) {
            return finals[0].path;
        }
    }
}

function processPartTwo(seed: string) {
    let state: State = {
        left: 0,
        top: 0,
        path: ""
    }
    let states = generateNextStates(seed, state);
    let maxLength = 0;
    while (states.length) {
        states = [].concat(...states.map(state => generateNextStates(seed, state)));
        const finals = states.filter(state => state.left === 3 && state.top===3);
        states = states.filter(state => state.left !== 3 || state.top!==3);
        if (finals.length) {
            maxLength = finals[0].path.length;
        }
    }
    return maxLength;
}


main();