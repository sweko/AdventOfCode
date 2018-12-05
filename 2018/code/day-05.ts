import { readInput } from "../extra/aoc-helper";
import { performance } from "perf_hooks";

async function main() {
    const input = await readInput();

    const startOne = performance.now();
    let slimLength = processPartOne(input);
    const endOne = performance.now();

    console.log(`Part 1: After full reaction there are ${slimLength} units remaining`);
    console.log(`Running time for part 1 is ${Math.round(endOne-startOne)}ms`);

    const startTwo = performance.now();
    let slimestLength = processPartTwo(input);
    const endTwo = performance.now();

    console.log(`Part 2: After full reaction with removal there are ${slimestLength} units remaining`);
    console.log(`Running time for part 2 is ${Math.round(endTwo-startTwo)}ms`);
}

function reactPolymer(polymer: Int8Array): number {
    let changes;
    let run = 0;
    do {
        changes = 0;
        for (let index = 0; index < polymer.length - 1; index++) {

            const findex = index;
            let sindex = index + 1;
            while (polymer[sindex] === 0) sindex += 1;

            const fchar = polymer[findex];
            const schar = polymer[sindex];

            if (Math.abs(fchar - schar) === 32) {
                polymer[findex] = 0;
                polymer[sindex] = 0;
                changes += 1;
                index = sindex;
            }
        }
        run += 1;
        // console.log(`Run ${run} finished, made ${changes} changes`);
    }
    while (changes !== 0);

    return polymer.filter(c => c).length;
}


function reactPolymerSinglePass(polymer: Int8Array): number {
    let result = polymer.length;

    let findex = 0;
    let sindex = 1;

    const len = polymer.length;

    while (sindex < len) {
        const fchar = polymer[findex];
        const schar = polymer[sindex];

        if (Math.abs(fchar - schar) === 32) {
            polymer[findex] = 0;
            polymer[sindex] = 0;
            result -= 2;
            sindex +=1;
            while (polymer[findex]===0) findex -=1;
        } else {
            findex = sindex;
            sindex +=1;
        }
    }
    return result;
}

function processPartOne(line: string): number {
    const chars = new Int8Array(line.length);
    for (let index = 0; index < line.length; index++) {
        chars[index] = line.charCodeAt(index);
    }

    return reactPolymerSinglePass(chars);

}

function processPartTwo(line: string): number {
    const chars = new Int8Array(line.length);
    for (let index = 0; index < line.length; index++) {
        chars[index] = line.charCodeAt(index);
    }
    
    const a = "A".charCodeAt(0);
    const z = "Z".charCodeAt(0);
    let minLength = Number.POSITIVE_INFINITY;

    for (let charCode = a; charCode <= z; charCode++) {
        const newPolymer = chars.filter(c => c !== charCode && c !== charCode+32);
        // console.log(`## Running reaction without ${String.fromCharCode(charCode)} ##`)
        const length = reactPolymerSinglePass(newPolymer);
        // console.log(`## Length = ${length} ##`)
        if (length < minLength) minLength = length;
    }
    return minLength;
}

main();