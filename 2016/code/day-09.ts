import { readInput, readInputLines } from "../extra/aoc-helper";
import { isNumber } from "util";

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
    const tokens = tokenize(compress);
    return sumTokens(tokens);
}

function sumTokens(tokens){
    let sum = 0;
    for (let index = 0; index < tokens.length; index++) {
        const element = tokens[index];
        if (isNumber(element)){
            sum +=element;
        } else {
            sum += element.times * sumTokens(element.tokens);
        }
    }
    return sum;
}

function tokenize(input: string) {
    const tokens = []

    while (input) {
        const start = input.indexOf("(");
        if (start === -1) {
            tokens.push(input.length);
            return tokens;
        }
        if (start !== 0) {
            tokens.push(start);
            input = input.substr(start);
        }

        const match = input.match(/^\((\d+)x(\d+)\)/);

        const len = parseInt(match[1]);
        const times = parseInt(match[2]);
        const token = input.substr(match[0].length, len);
        input = input.substr(match[0].length + len);
        tokens.push({
            tokens: tokenize(token),
            times: times
        });
    }
    return tokens;
}

main();