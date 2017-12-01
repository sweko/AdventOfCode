import { readInput, readInputLines } from "../extra/aoc-helper";

async function main() {
    const input = await readInput();

    const numbers = input.split("").map(c => parseInt(c));

    let captcha = processPartOne(numbers);
    console.log(`Part 1: Captcha value = ${captcha}`);

    captcha = processPartTwo(numbers);
    console.log(`Part 2: Captcha value = ${captcha}`);

}

function processPartOne(numbers: number[]) {
    numbers.push(numbers[0]);
    let sum = 0;
    for (let index = 0; index < numbers.length - 1; index++) {
        if (numbers[index] === numbers[index + 1])
            sum += numbers[index];
    }
    return sum;
}

function processPartTwo(numbers: number[]) {
    var top = numbers.slice(numbers.length / 2);
    var bottom = numbers.slice(0, numbers.length / 2);
    let sum = 0;
    for (let index = 0; index < top.length; index++) {
        if (top[index] == bottom[index])
            sum += 2 * top[index];
    }
    return sum;
}


main();