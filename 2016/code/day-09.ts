import { readInput, readInputLines } from "../extra/aoc-helper";

async function main() {
    let line = await readInput();

    let stringLen = processPartOne(line);
    console.log(`Part 1: decompressed length is ${stringLen}`);

    stringLen = processPartTwo(line);
    console.log(`Part 1: decompressed length is ${stringLen}`);
}

function processPartOne(compress: string) {
    let totalLength = 0;
    while (true) {
        const start = compress.indexOf("(");
        if (start === -1) {
            totalLength += compress.length;
            return totalLength;
        }
        totalLength += start;
        compress = compress.substr(start);

        const match = compress.match(/^\((\d+)x(\d+)\)/);

        const len = parseInt(match[1]);
        const times = parseInt(match[2]);
        compress = compress.substr(match[0].length + len);
        totalLength += len * times;
    }
}

function processPartTwo(compress: string) {
    let totalLength = 0;
    const match = compress.match(/^\((\d+)x(\d+)\)/);
    
}

main();