// Solution for day 12 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type Spring = "." | "#" | "?";

type Row = {
    pattern: Spring[];
    groups: number[];
}

type RowExtra = {
    hashLeft: number;
    questionLeft: number;
    dotsLeft: number;
} & Row;

type PatternMatch = {
    groups: number;
    pattern: number;
};

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const result = lines.map(line => {
        const [springs, numbers] = line.split(" ");
        const pattern = springs.split("").map(c => c as Spring);
        const groups = numbers.split(",").map(n => parseInt(n, 10));
        return { pattern, groups };
    });
    return result;
};

const patternMatchesGroups = (pattern: Spring[], groups: number[]): boolean | null => {
    let pindex = 0;
    let gindex = 0;
    let hashCount = 0;
    let currentGroup = groups[gindex];

    while (pattern[pindex] === ".") {
        pindex++;
    }
    if (pindex === pattern.length) {
        return groups.length === 0;
    }

    while (pindex < pattern.length) {
        if (pattern[pindex] === "#") {
            hashCount++;
            if (hashCount > currentGroup) {
                return false;
            }
            pindex += 1;
            continue;
        }

        if (pattern[pindex] === "?") {
            return null;
        }

        // this is a dot, we should check if we have a group
        if (hashCount === currentGroup) {
            gindex +=1;
            currentGroup = groups[gindex];
            hashCount = 0;
            while (pattern[pindex] === ".") {
                pindex++;
            }
            continue;
        }
        return false;
    }

    if (hashCount === 0 && currentGroup === undefined) {
        // we run out of hashes and groups at the same time, that's a match
        return true;
    }

    return hashCount === currentGroup;
};

const getCurrentMatch = (pattern: Spring[], groups: number[]): boolean | PatternMatch | null => {
    let pindex = 0;
    let gindex = 0;
    let hashCount = 0;
    let currentGroup = groups[gindex];

    while (pattern[pindex] === ".") {
        pindex++;
    }
    if (pindex === pattern.length) {
        return groups.length === 0;
    }

    while (pindex < pattern.length) {
        if (pattern[pindex] === "#") {
            hashCount++;
            if (hashCount > currentGroup) {
                return false;
            }
            pindex += 1;
            continue;
        }

        if (pattern[pindex] === "?") {
            if (hashCount === 0) {
                return {
                    groups: gindex,
                    pattern: pindex-1
                };
            }
            return null;
        }

        // this is a dot, we should check if we have a group
        if (hashCount === currentGroup) {
            gindex +=1;
            currentGroup = groups[gindex];
            hashCount = 0;
            while (pattern[pindex] === ".") {
                pindex++;
            }
            continue;
        }
        return false;
    }

    if (hashCount === 0 && currentGroup === undefined) {
        // we run out of hashes and groups at the same time, that's a match
        return true;
    }

    return hashCount === currentGroup;
};

const patternMatchesGroupsBrute = (pattern: Spring[], groups: number[]): boolean => {
    const patternGroups = [];

    let hashCount = 0;
    for (let index = 0; index < pattern.length; index++) {
        const char = pattern[index];
        if (char === "#") {
            hashCount++;
            continue;
        }
        if (char === ".") {
            if (hashCount > 0) {
                patternGroups.push(hashCount);
                hashCount = 0;
            }
        }
    }
    if (hashCount > 0) {
        patternGroups.push(hashCount);
    }

    if (patternGroups.length !== groups.length) {
        return false;
    }

    for (let index = 0; index < patternGroups.length; index++) {
        if (patternGroups[index] !== groups[index]) {
            return false;
        }
    }
    return true;
};

const getConfigurationsCountBrute = ({pattern, groups}: Row) => {
    const qmarkIndexes = pattern.map((s, i) => s === "?" ? i : -1).filter(i => i !== -1);
    const qmarkCount = qmarkIndexes.length;
    const optionsCount = 1 << qmarkCount;
    let count = 0;

    for (let index = 0; index < optionsCount; index++) {
        const bindex = index.toString(2).padStart(qmarkCount, "0");
        const newPattern = pattern.slice();
        for (let qindex = 0; qindex < qmarkIndexes.length; qindex++) {
            newPattern[qmarkIndexes[qindex]] = (bindex[qindex] === "0") ? "." : "#";
        }
        if (patternMatchesGroupsBrute(newPattern, groups)) {
            count++;
        }
    }
    return count;
};

const getConfigurationsCountRecBrute = ({pattern, groups}: Row): number => {
    // find the first ?
    const qmarkIndex = pattern.findIndex(s => s === "?");
    if (qmarkIndex === -1) {
        return patternMatchesGroupsBrute(pattern, groups) ? 1 : 0;
    }
    // ...and replace it with a #
    const hashPattern = pattern.slice();
    hashPattern[qmarkIndex] = "#";
    // count configurations now
    const hashCount = getConfigurationsCountRecBrute({pattern: hashPattern, groups});
    // ...and replace it with a .
    const dotPattern = pattern.slice();
    dotPattern[qmarkIndex] = ".";
    // count configurations now
    const dotCount = getConfigurationsCountRecBrute({pattern: dotPattern, groups});
    // return the sum of both
    return hashCount + dotCount;
};

let callCount = 0;

const cache = new Map<string, number>();

const getConfigurationsCount = ({pattern, groups, hashLeft, questionLeft, dotsLeft }: RowExtra): number => {
    const key = `${pattern.join("")}::${groups.join("|")}`;
    if (cache.has(key)) {
        return cache.get(key)!;
    }

    callCount += 1;
    if (questionLeft === 0) {
        const result = patternMatchesGroupsBrute(pattern, groups) ? 1 : 0;
        cache.set(key, result);
        return result;
    }

    // find the first ?
    const qmarkIndex = pattern.findIndex(s => s === "?");
    let hashCount = 0;
    let dotCount = 0;

    if (hashLeft > 0) {
        // ...and replace it with a #
        const hashPattern = pattern.slice();
        hashPattern[qmarkIndex] = "#";
        // does the pattern make sense?
        const match = getCurrentMatch(hashPattern, groups);
        if (match === true) {
            const result = 1;
            cache.set(key, result);
            return result;
        } else if (match === false) {
            // don't do anything
        } else if (match === null) {
            // count configurations now
            hashCount = getConfigurationsCount({
                pattern: hashPattern, 
                groups, 
                hashLeft: hashLeft - 1,
                questionLeft: questionLeft - 1,
                dotsLeft
            });
        } else {
            const patternLeft = hashPattern.slice(match.pattern + 1);
            const groupsLeft = groups.slice(match.groups);
            hashCount = getConfigurationsCount({
                pattern: patternLeft, 
                groups: groupsLeft, 
                hashLeft: hashLeft - 1,
                questionLeft: questionLeft - 1,
                dotsLeft
            });
        }
    }

    if (dotsLeft > 0) {
        // ...and replace it with a .
        const dotPattern = pattern.slice();
        dotPattern[qmarkIndex] = ".";
        const match = getCurrentMatch(dotPattern, groups);
        if (match === true) {
            const result = 1;
            cache.set(key, result);
            return result;
        } else if (match === false) {
            const result = hashCount;
            cache.set(key, result);
            return result;
        } else if (match === null) {
            // count configurations now
            dotCount = getConfigurationsCount({
                pattern: dotPattern, 
                groups, 
                hashLeft,
                questionLeft: questionLeft - 1,
                dotsLeft: dotsLeft - 1
            });
        } else {
            const patternLeft = dotPattern.slice(match.pattern + 1);
            const groupsLeft = groups.slice(match.groups);
            dotCount = getConfigurationsCount({
                pattern: patternLeft, 
                groups: groupsLeft, 
                hashLeft,
                questionLeft: questionLeft - 1,
                dotsLeft: dotsLeft - 1
            });
        }

    }
    // return the sum of both
    const result = hashCount + dotCount;
    cache.set(key, result);
    return result;
};

const toRowExtra = ({pattern, groups}: Row): RowExtra => {
        const qs = pattern.filter(s => s === "?").length;
        const hs = groups.sum();
        const hc = pattern.filter(s => s === "#").length;
        const hl = hs - hc;
        const dl = qs - hl;
        return {
            pattern,
            groups,
            hashLeft: hl,
            questionLeft: qs,
            dotsLeft: dl
        } as RowExtra;
    };

const partOne = (input: Row[], debug: boolean) => {
    callCount = 0;
    const result = input
        .map(row => toRowExtra(row))
        .map(row => getConfigurationsCount(row));
    // console.log(result);
    // console.log(`Call count: ${callCount}`);
    return result.sum();
};

const partTwo = (input: Row[], debug: boolean) => {
    callCount = 0;
    const unfoldedDirect = input.map(({pattern, groups}) => ({
        pattern: [...pattern, "?", ...pattern, "?", ...pattern, "?", ...pattern, "?", ...pattern],
        groups: [...groups, ...groups, ...groups, ...groups, ...groups],
    }) as Row);
    const unfolded = unfoldedDirect.map(row => toRowExtra(row));
    // console.log(`${unfolded[0].pattern.join("")} ${unfolded[0].groups.join(",")}`);
    const result = unfolded.map((row, index) => {
        // console.log(`Processing #${index + 1}: ${row.pattern.join("")}`);
        return getConfigurationsCount(row);
    });
    // console.log(result);
    // console.log(`Call count: ${callCount}`);
    return result.sum();
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Row[]) => {
    console.log(input);
};

const test = (_: Row[]) => {
    console.log("----Test-----");
    const x = patternMatchesGroups("##.####".split("") as Spring[], [2, 5]);
    console.log(x);
};

export const solution: Puzzle<Row[], number> = {
    day: 12,
    input: () => processInput(12),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}