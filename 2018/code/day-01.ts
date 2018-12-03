import { readInputLines } from "../extra/aoc-helper";

async function main() {
    const input = await readInputLines();

    let numbers = input.map(c => parseInt(c));

    let frequency = processPartOne(numbers);
    console.log(`Part 1: The resulting frequency = ${frequency}`);

    frequency = processPartTwo(numbers);
    console.log(`Part 2: First twice frequency = ${frequency}`);
}

function processPartOne(numbers: number[]) {
    return numbers.sum();
}

function processPartTwo(numbers: number[]) {
    const visiteds = { 0: true };
    let runningTotal = 0;
    let run = 0;
    while (true) {
        for (const number of numbers) {
            runningTotal += number;
            if (visiteds[runningTotal]) {
                return runningTotal;
            }
            visiteds[runningTotal] = true;
        }
        run +=1;
        console.log(`Run ${run} finished. ${Object.keys(visiteds).length} visiteds`);
    }
}


main();