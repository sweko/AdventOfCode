import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Hash, StringHash } from "../extra/hash-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    //return [4, 8] as [number, number];
    return [8, 3] as [number, number];
};

const partOne = (input: [number, number], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let fpos = input[0];
    let spos = input[1];

    let fscore = 0;
    let sscore = 0;

    let die = 0;
    let dieRoll = 0;
    let fturn = true;

    while ((fscore < 1000) && (sscore < 1000)) {
        die += 1;
        dieRoll += 1;
        const once = die;
        if (die === 100) die = 0;

        die += 1;
        dieRoll += 1;
        const twice = die;
        if (die === 100) die = 0;

        die += 1;
        dieRoll += 1;
        const thrice = die;
        if (die === 100) die = 0;

        const moves = once + twice + thrice;

        if (fturn) {
            fpos += moves;
            const points = (fpos % 10) || 10;
            fscore += points;
            fturn = false;
        } else {
            spos += moves;
            const points = (spos % 10) || 10;
            sscore += points;
            fturn = true;
        }
    }

    return (fscore >= 1000) ? sscore * dieRoll : fscore * dieRoll;
};

interface GameState {
    next : "first" | "second";
    first : {
        position: number;
        score: number;
    }
    second : {
        position: number;
        score: number;
    }
}

const toKey = (state: GameState) => `${state.next}-${state.first.position}-${state.first.score}-${state.second.position}-${state.second.score}`;

interface Universe {
    multiplier: number;
    state: GameState;
}

const universeFrequencies = [
    { value: 3, frequency: 1},
    { value: 4, frequency: 3},
    { value: 5, frequency: 6},
    { value: 6, frequency: 7},
    { value: 7, frequency: 6},
    { value: 8, frequency: 3},
    { value: 9, frequency: 1},
]

const nextUniverses = (state: GameState): Universe[]  => {
    if (state.next === "first") {
        return universeFrequencies.map(f => ({
            multiplier: f.frequency,
            state: { 
                next: "second",
                first: {
                    position: (state.first.position + f.value) % 10 || 10,
                    score: state.first.score + ((state.first.position + f.value) % 10 || 10)
                },
                second: {...state.second}
            }
        }));
    } else {
        return universeFrequencies.map(f => ({
            multiplier: f.frequency,
            state: { 
                next: "first",
                first: {...state.first},
                second: {
                    position: (state.second.position + f.value) % 10 || 10,
                    score: state.second.score + ((state.second.position + f.value) % 10 || 10)
                }
            }
        }));
    }
}

// let countCalls = 0;

// let levelCalls = Array(100).fill(0);

const cache: Hash<{first: number, second: number}> = {};

const countWins = (universe: Universe, level: number = 0) : {first: number, second: number} => {
    // countCalls +=1;
    // levelCalls[level] += 1;
    const key = toKey(universe.state);
    if (cache[key]) {
        return {
            first: cache[key].first * universe.multiplier,
            second: cache[key].second * universe.multiplier
        };
    };
    if (universe.state.first.score >= 21) {
        cache[key] = {first:1, second: 0};
        return {first: universe.multiplier, second: 0};
    };
    if (universe.state.second.score >= 21) {
        cache[key] = {first: 0, second: 1};
        return {first: 0, second: universe.multiplier};
    };
    const nexts = nextUniverses(universe.state);
    let wins = {first: 0, second: 0};
    for (const next of nexts) {
        const nextWins = countWins(next, level+1);
        wins.first += nextWins.first;
        wins.second += nextWins.second;
    }
    cache[key] = {first: wins.first, second: wins.second};
    return {
        first: wins.first * universe.multiplier,
        second: wins.second * universe.multiplier
    };
};

const partTwo = (input: [number, number], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const universe: Universe = {
        multiplier: 1,
        state: {
            next: "first",
            first: {
                position: input[0],
                score: 0
            },
            second: {
                position: input[1],
                score: 0
            }
        }
    };

    const wins = countWins(universe);
    // console.log(`countWins was called ${countCalls} times`);
    // console.table(levelCalls.filter(c => c > 0));

    if (wins.first > wins.second) {
        return wins.first;
    } else {
        return wins.second;
    }
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: [number, number]) => {
    console.log(input);
};

const test = (_: [number, number]) => {
    console.log("----Test-----");
};

export const solutionTwentyOne: Puzzle<[number, number], number> = {
    day: 21,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
