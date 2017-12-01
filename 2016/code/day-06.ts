import { readInput, readInputLines } from "../extra/aoc-helper";

async function main() {
    const lines = await readInputLines();

    const letters = lines.map(line => line.split(""));

    let message = processPartOne(letters);
    console.log(`Part 1: Reconstituted message = ${message}`);

    message = processPartTwo(letters);
    console.log(`Part 2: Reconstituted message = ${message}`);

}

function processPartOne(letters: string [][]) {
    const freq = transpose(letters).map(message => {
        const messageFreq = getFrequency(message)
        messageFreq.sort((a,b) => b.value - a.value);
        return messageFreq[0].char;
    });
    return freq.join("");
}

function processPartTwo(letters: string [][]) {
    const freq = transpose(letters).map(message => {
        const messageFreq = getFrequency(message)
        messageFreq.sort((a,b) => a.value - b.value);
        return messageFreq[0].char;
    });
    return freq.join("");
}

function getFrequency(name: string[]) {
    const freq = {};
    for (let index = 0; index < name.length; index++) {
        const char = name[index];
        if (freq[char]) {
            freq[char] += 1;
        } else {
            freq[char] = 1;
        }
    }

    return Object.keys(freq).map(key => ({ char: key, value: freq[key] }));
}

function transpose(letters: string[][]){
    const result = [];
    for (let index = 0; index < letters[0].length; index++) {
        const element = letters[0][index];
        result.push([element]);
    }

    for (let lindex = 1; lindex < letters.length; lindex++) {
        const element = letters[lindex];
        for (let index = 0; index < element.length; index++) {
            result[index].push(element[index]);
        }
            
    }

    return result;
}

main();