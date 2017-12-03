import { readInput, readInputLines } from "../extra/aoc-helper";

interface Range {
    start: number;
    end: number;
}

async function main() {
    const lines = await readInputLines();
    const ranges = lines.map(line => {
        const tokens = line.split("-");
        return { start: parseInt(tokens[0]), end: parseInt(tokens[1]) }
    });
    ranges.sort((a, b) => a.start - b.start);

    let minAddress = processPartOne(ranges);
    console.log(`Part 1: minimal ip address is ${minAddress}`);

    let totalAddresses = processPartTwo(ranges);
    console.log(`Part 2: total ${totalAddresses} whitelisted`);
}


function mergeRanges(first: Range, second: Range) {
    if (first.start > second.start)
        throw Error("Invalid range sorting");
    if (second.start > first.end + 1) {
        return false;
    }
    return <Range>{
        start: first.start,
        end: Math.max(first.end, second.end)
    }
}

function processPartOne(ranges: Range[]) {
    while (true) {
        const merge = mergeRanges(ranges[0], ranges[1]);
        if (!merge) {
            return ranges[0].end + 1;
        }
        ranges.splice(0, 2, merge)
    }
}

function processPartTwo(ranges: Range[]) {
    let index = 0;
    while (index != ranges.length - 1) {
        const merge = mergeRanges(ranges[index], ranges[index + 1]);
        if (!merge) {
            index++;
        } else {
            ranges.splice(index, 2, merge)
        }
    }
    let sum = ranges[0].start;
    for (let index = 0; index < ranges.length - 1; index++) {
        sum += ranges[index + 1].start - ranges[index].end - 1;
    }
    return sum;
}


main();