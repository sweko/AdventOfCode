import { readInput, readInputLines } from "../extra/aoc-helper";

async function main() {
    const input = "11100010111110100";
    let diskSize = 272;

    let checksum = processPartOne(input, diskSize);
    console.log(`Part 1: checksum is ${checksum}`);

    diskSize = 35651584;
    checksum = processPartOne(input, diskSize);
    console.log(`Part 2: checksum is ${checksum}`);
}

function dragon(source: string) {
    let copy = source.split("").reverse().map(c => (c === "1") ? "0" : "1").join("");
    return `${source}0${copy}`;
}

function checksum(source: string) {
    const result = [];
    for (let index = 0; index < source.length; index += 2) {
        if (source[index] === source[index + 1])
            result.push("1")
        else
            result.push("0")
    }

    let chksum = result.join("");
    if (chksum.length % 2 === 0)
        return checksum(chksum)
    else
        return chksum;
}

function processPartOne(input: string, diskSize: number) {
    let content = input;
    while (content.length < diskSize)
        content = dragon(content);
    content = content.slice(0, diskSize);
    let chksum = checksum(content);
    return chksum;
}

main();