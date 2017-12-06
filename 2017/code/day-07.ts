import { readInput, readInputLines } from "../extra/aoc-helper";

async function main() {
    console.time("total");
    const lines = await readInputLines();

    let numbers = lines.map(line => parseInt(line));

    console.time("part one");
    let cycleCount = processPartOne(numbers);
    console.timeEnd("part one");
    console.log(`Part 1: runs until cycle = ${cycleCount}`);

    console.time("part two");
    cycleCount = processPartTwo(numbers);
    console.timeEnd("part two");
    console.log(`Part 2: cycle length = ${cycleCount}`);

    console.timeEnd("total");
}

function processPartOne<T>(numbers: T) {
    return 0;
}

function processPartTwo<T>(numbers: T) {
    return 0;
}


main();