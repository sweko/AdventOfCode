import { readInput, readInputLines } from "../extra/aoc-helper";
import * as md5 from "md5";

import { terminal } from "terminal-kit";

async function main() {
    const input = 3001330;

    let elfIndex = processPartOne(input);
    console.log(`Part 1: winning elf is ${elfIndex}`);

    elfIndex = processPartTwo(input);
    console.log(`Part 2: winning elf is ${elfIndex}`);
}

function processPartOne(numElves: number) {
    const elves = new Array(numElves).fill(true);
    let index = 0;
    let left = numElves;

    while (left != 1) {
        let next = index + 1;
        while (!elves[next] && next < numElves) next += 1;
        if (next === numElves) {
            next = 0;
            while (!elves[next]) next += 1;
        }

        elves[next] = false;
        left--;
        index = next + 1;
        while (!elves[index] && index < numElves) index += 1;
        if (index === numElves) {
            index = 0;
            while (!elves[index]) index += 1;
        }
    }

    return index + 1;
}

function processPartTwo(numElves: number) {
    // 31980 is wrong
    const elves = new Array(numElves);
    for (let index = 0; index < elves.length; index++) {
        elves[index] = index + 1;
    }

    let index = 0;
    while (elves.length !== 1) {
        const half = (elves.length / 2) | 0;
        let across = index + half;
        if (across >= elves.length) across -= elves.length;
        elves.splice(across, 1);
        index++;
        if (index >= elves.length) index = 0;
        if (elves.length % 91 === 0) {
            const percent = (numElves - elves.length) / numElves * 100;
            console.log(`${percent.toFixed(2)} - ${elves.length}     `);
            terminal.previousLine();
        }
    }
    return elves[0];
}


main();