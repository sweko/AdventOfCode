import { readInput, readInputLines } from "../extra/aoc-helper";
import { isNumber } from "util";
import { fork } from "child_process";

async function main() {

    const matches = [];
    const len = 5000000;

    console.time("generating data");
    matches[0] = [];
    for (let i = 0; i < len; i++) matches[0].push(i * 13 + 2); //0-12, should be at 12

    matches[1] = [];
    for (let i = 0; i < len; i++) matches[1].push(i * 17 + 0); //0-16, should be at 15

    matches[2] = [];
    for (let i = 0; i < len; i++) matches[2].push(i * 19 + 18); //0-18, should be at 16

    matches[3] = [];
    for (let i = 0; i < len; i++) matches[3].push(i * 7 + 2); //0-6, should be at 3

    matches[4] = [];
    for (let i = 0; i < len; i++) matches[4].push(i * 5 + 0); //0-4, should be at 0

    matches[5] = [];
    for (let i = 0; i < len; i++) matches[5].push(i * 3 + 2); //0-2, should be at 0
    console.timeEnd("generating data");

    let minTime = processPartOne(matches);
    console.log(`Part 1: soonest time to get the ball is ${minTime}`);

    matches[6] = [];
    for (let i = 0; i < len; i++) matches[6].push(i * 11 + 4); //0-10, should be at 10-6 = 4

    minTime = processPartOne(matches);
    console.log(`Part 2: soonest time to get the ball is ${minTime}`);
}

function filterData(first: number[], second: number[]) {
    const result = [];
    let findex = 0;
    let sindex = 0
    while ((findex < first.length) && (sindex < second.length)) {
        if (first[findex] == second[sindex]) {
            result.push(first[findex]);
            findex += 1;
            sindex += 1;
        } else if (first[findex] < second[sindex]) {
            findex += 1;
        } else {
            sindex += 1;
        }
    }
    return result;
}

function processPartOne(matches: number[][]) {
    console.time("filtering data");
    console.time("pass 1");
    let candidates = filterData(matches[0], matches[1]);
    console.timeEnd("pass 1");
    for (let i = 2; i < matches.length; i++) {
        console.time(`pass ${i}`);
        candidates = filterData(candidates, matches[i]);
        console.timeEnd(`pass ${i}`);
    }
    console.timeEnd("filtering data");
    console.log(`${candidates.length} candidates`);
    return candidates[0];
}

function processPartTwo() {
}

main();