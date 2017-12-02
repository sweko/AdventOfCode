import { readInput, readInputLines } from "../extra/aoc-helper";

async function main() {
    const lines = await readInputLines();
    
    const numbers = lines.map(line => line.split("\t").map(c => parseInt(c)).filter(n=> !isNaN(n)));

    console.log(numbers);

    let checksum = processPartOne(numbers);
    console.log(`Part 1: Checksum value = ${checksum}`);

    checksum = processPartTwo(numbers);
    console.log(`Part 2: Checksum value = ${checksum}`);

}

function processPartOne(numbers: number[][]) {
    let checksum = 0;
    for (let index = 0; index < numbers.length; index++) {
        const element = numbers[index];
        const min = Math.min(...element);
        const max = Math.max(...element);
        checksum += max-min;
    }
    return checksum;
}

function processPartTwo(numbers: number[][]) {
    let checksum = 0;
    for (let index = 0; index < numbers.length; index++) {
        const element = numbers[index];
        element.sort((a,b)=> b-a);
        for (let i = 0; i < element.length-1; i++) {
            for (let j = i+1; j < element.length; j++) {
                if (element[i] % element[j] == 0)
                    checksum += element[i] / element[j]
            }
        }
    }
    return checksum;
}


main();