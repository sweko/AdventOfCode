import { readInput, readInputLines } from "../extra/aoc-helper";
import "../extra/array-helpers";

async function main() {
    const lines = await readInputLines();

    // const lines = ['abcdef', 'bababc', 'abbcde', 'abcccd', 'aabcdd', 'abcdee', 'ababab']

    // let checksum = processPartOne(lines);
    // console.log(`Part 1: Checksum value = ${checksum}`);

    // const lines = ['abcde', 'fghij', 'klmno', 'pqrst', 'fguij', 'axcye', 'wvxyz'];

    let chars = processPartTwo(lines);
    console.log(`Part 2: Common characters = ${chars}`);

}

function getCounts(lines: string[], times: number) {
    const groups = lines
        .map(line => line.split('').groupReduce(item => item, (acc, item) => acc + 1, 0))
        .filter(group => group.some(item => item.value === times));
    return groups.length;
}

function processPartOne(lines: string[]) {
    const twos = getCounts(lines, 2);
    const threes = getCounts(lines, 3);
    return twos * threes;
}

function getDiff(fline: string, sline: string) {
    const commonChars = [];
    let diffCount = 0;
    for (let index = 0; index < fline.length; index++) {
        const fchar = fline[index];
        const schar = sline[index];
        if (fchar === schar) {
            commonChars.push(fchar);
        } else {
            diffCount +=1;
        }
    }
    return { commonChars, diffCount };
}

function processPartTwo(lines: string[]) {
    for (let findex = 0; findex < lines.length; findex++) {
        const fline = lines[findex];
        for (let sindex = findex + 1; sindex < lines.length; sindex++) {
            const sline = lines[sindex];
            const {commonChars, diffCount} = getDiff(fline, sline);

            if (diffCount === 1)
                return commonChars.join('');
        }
    }
    return "";
}


main();