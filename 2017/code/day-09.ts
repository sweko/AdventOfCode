import { readInput, readInputLines } from "../extra/aoc-helper";

async function main() {
    let input = await readInput();

    let totalScore = processPartOne(input);
    console.log(`Part 1: total stream score = ${totalScore}`);

    totalScore = processPartTwo(input);
    console.log(`Part 2: total garbage score = ${totalScore}`);

}

function processPartOne(input: string) {
    let bangIndex;
    let inputArr = input.split("");
    while ((bangIndex = inputArr.indexOf("!")) !== -1) {
        inputArr.splice(bangIndex, 2);
    }
    inputArr = inputArr.join("").replace(/<[^>]*>/g, "").replace(/,/g, "").split("");
    let sum = 0;
    let level = 0;
    for (let index = 0; index < inputArr.length; index++) {
        const paren = inputArr[index];
        if (paren === "{") {
            level += 1;
            sum += level;
        } else if (paren === "}") {
            level -= 1;
        }
    }
    return sum;
}

function processPartTwo(input: string) {
    let bangIndex;
    let inputArr = input.split("");
    while ((bangIndex = inputArr.indexOf("!")) !== -1) {
        inputArr.splice(bangIndex, 2);
    }
    return inputArr.join("").match(/<[^>]*>/g).map(m => m.length - 2).reduce((a, b) => a + b, 0);
}


main();