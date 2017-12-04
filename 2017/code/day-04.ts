import { readInput, readInputLines } from "../extra/aoc-helper";

async function main() {
    const lines = await readInputLines();
    
    const words = lines.map(line => line.split(" "));

    let validPasswords = processPartOne(words);
    console.log(`Part 1: Valid passwords without duplicates = ${validPasswords}`);

    validPasswords = processPartTwo(words);
    console.log(`Part 2: Valid passwords without anagram duplicates = ${validPasswords}`);

}

function processPartOne(words: string[][]) {
    return words.filter(pass => !pass.sort().some((item, index) => (index !== pass.length) && (pass[index] === pass[index+1]))).length;
}

function processPartTwo(words: string[][]) {
    return words.filter(pass => !pass.map(word => word.split("").sort().join("")).sort().some((item, index, arr) => (index !== arr.length) && (arr[index] === arr[index+1]))).length;
}


main();