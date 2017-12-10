import { readInput, readInputLines } from "../extra/aoc-helper";
import { listenerCount } from "cluster";

async function main() {
    let input = await readInput();

    let selectors = input.split(",").map(item => parseInt(item));
    let listSize = 256;
    let hash = processPartOne(selectors, listSize);
    console.log(`Part 1: hash value = ${hash}`);

    let hashstring = processPartTwo(input);
    console.log(`Part 2: hash value = ${hashstring}`);

}

function reversePart(array: number[], start: number, length: number) {
    const result = array.slice();

    for (let index = 0; index < length / 2; index++) {
        const lindex = (index + start) % array.length
        const rindex = (length - index - 1 + start) % array.length;
        const temp = result[lindex];
        result[lindex] = result[rindex];
        result[rindex] = temp;
    }

    return result;
}

function runHash(selectors:number[], listSize: number){
    let array = getArray(listSize);
    let skipindex = 0;
    let offset = 0;
    selectors.forEach(length => {
        array = reversePart(array, offset, length);
        offset = (offset + length + skipindex) % listSize;
        skipindex += 1;
    })

    return array;
}


function processPartOne(selectors: number[], listSize: number) {
    const array = runHash(selectors, listSize);
    return array[0] * array[1];
}

function runExtendedHash(selectors: number[], listSize: number) {
    selectors.push(17, 31, 73, 47, 23);
    selectors = [].concat(...Array(64).fill(selectors));
    return runHash(selectors, listSize);
}

function getArray(size:number){
    return Array(size).fill(0).map((_, i)=> i);
}

function getDenseHash(sparseHash: number[]){
    return getArray(16).map(i => sparseHash.slice(i*16, (i+1)*16).reduce((a, b) => a ^ b));
}

function processPartTwo(input: string) {
    const listSize = 256;
    const selectors = input.split("").map(c => c.charCodeAt(0));
    const sparseHash = runExtendedHash(selectors, listSize);
    const denseHash = getDenseHash(sparseHash);
    return denseHash.map(dh => dh.toString(16).padStart(2,"0")).join("");
}


main();