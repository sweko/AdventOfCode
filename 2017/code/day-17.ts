import { readInput, readInputLines } from "../extra/aoc-helper";
import { terminal } from "terminal-kit";

async function main() {
    const input = 359;

    let nextPosition = processPartOne(input);
    console.log(`Part 1: next number to final is ${nextPosition}`);

    console.time("part 2");
    nextPosition = processPartTwo(input);
    console.timeEnd("part 2");
    console.log(`Part 2: next number to zero is ${nextPosition}`);
}

function processPartOne(input: number) {
    const buffer = [0];
    const limit = 2017;
    let current = 0;

    for (let index = 1; index <= limit; index++) {
        current = (current + input) % buffer.length;
        buffer.splice(current + 1, 0, index);
        current = (current + 1) % buffer.length;
    }

    const center = buffer.indexOf(2017);
    return buffer[center + 1];

}

function processPartTwo(input: number) {
    let buflen = 1;
    const limit = 50000000;
    let current = 0;
    let result;
    for (let index = 1; index <= limit; index++) {
        current = (current + input) % buflen;
        buflen += 1;
        if (current == 0)
            result = index;
        current = (current + 1) % buflen;
    }

    return result;
}

main();