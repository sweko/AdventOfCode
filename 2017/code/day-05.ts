import { readInput, readInputLines } from "../extra/aoc-helper";

async function main() {
    const lines = await readInputLines();

    let numbers = lines.map(line => parseInt(line));
    let ipfinish = processPartOne(numbers);
    console.log(`Part 1: instructions until finish = ${ipfinish}`);

    numbers = lines.map(line => parseInt(line));
    ipfinish = processPartTwo(numbers);
    console.log(`Part 1: instructions until finish = ${ipfinish}`);

}

function processPartOne(numbers: number[]) {
    console.time("part one");
    let count = 0;
    let ip = 0;
    while (ip < numbers.length) {
        count++;
        numbers[ip] += 1;
        ip += numbers[ip] - 1;
    }
    console.timeEnd("part one");
    return count;
}

function processPartTwo(numbers: number[]) {
    console.time("part two");
    let count = 0;
    let ip = 0;
    while (ip < numbers.length) {
        count++;
        if (numbers[ip] >= 3) {
            numbers[ip] -= 1;
            ip += numbers[ip] + 1;
        } else {
            numbers[ip] += 1;
            ip += numbers[ip] - 1;
        }
    }
    console.timeEnd("part two");
    return count;
}


main();