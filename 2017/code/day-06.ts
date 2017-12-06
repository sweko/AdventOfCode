import { readInput, readInputLines } from "../extra/aoc-helper";

async function main() {
    console.time("total");
    const line = await readInput();

    let numbers = line.split("\t").map(line => parseInt(line));

    console.time("part one");
    let cycleCount = processPartOne(numbers);
    console.timeEnd("part one");
    console.log(`Part 1: runs until cycle = ${cycleCount}`);

    numbers = line.split("\t").map(line => parseInt(line));
    console.time("part two");
    cycleCount = processPartTwo(numbers);
    console.timeEnd("part two");
    console.log(`Part 2: cycle length = ${cycleCount}`);
    console.timeEnd("total");
}

function processPartOne(numbers: number[]) {
    const cache = {};
    let runs = 0;
    let runName = numbers.join("-");
    const len = numbers.length;

    while (!cache[runName]) {
        cache[runName] = true;
        const max = Math.max(...numbers);
        const mindex = numbers.indexOf(max);
        const mvalue = numbers[mindex];
        const increase = (mvalue / len) | 0;
        const remainder = mvalue % len;
        numbers[mindex] = 0;

        if (increase > 0) {
            for (let index = 0; index < numbers.length; index++) {
                numbers[index] += increase;
            }
        }

        for (let index = 0; index < remainder; index++) {
            const nindex = (mindex + 1 + index) % len;
            numbers[nindex] +=1;
        }
        runName = numbers.join("-");
        runs++;
    }

    return runs;
}

function processPartTwo(numbers: number[]) {
    const cache = {};
    let runs = 0;
    let runName = numbers.join("-");
    const len = numbers.length;

    while (!cache[runName]) {
        cache[runName] = runs;
        const max = Math.max(...numbers);
        const mindex = numbers.indexOf(max);
        const mvalue = numbers[mindex];
        const increase = (mvalue / len) | 0;
        const remainder = mvalue % len;
        numbers[mindex] = 0;

        if (increase > 0) {
            for (let index = 0; index < numbers.length; index++) {
                numbers[index] += increase;
            }
        }

        for (let index = 0; index < remainder; index++) {
            const nindex = (mindex + 1 + index) % len;
            numbers[nindex] +=1;
        }
        runName = numbers.join("-");
        runs++;
    }

    return runs - cache[runName];
}


main();