import { readInput, readInputLines } from "../extra/aoc-helper";

interface Node {
    x: number;
    y: number;
    size: number,
    used: number;
    avail: number;
    percentage: number;
}

async function main() {
    const lines = await readInputLines();
    const nodes = lines.map(line => {
        const match = line.match(/^\/dev\/grid\/node-x(\d+)-y(\d+)\s*(\d+)T\s*(\d+)T\s*(\d+)T\s*(\d+)%$/).slice(1).map(m => parseInt(m));
        return <Node> { 
            x: match[0],
            y: match[1],
            size: match[2],
            used: match[3],
            avail: match[4],
            percentage: match[5]
        }
    });

    let viablePairs = processPartOne(nodes);
    console.log(`Part 1: ammount of viable pairs is ${viablePairs}`);

    let totalAddresses = processPartTwo(nodes);
    console.log(`Part 2: total ${totalAddresses} whitelisted`);
}

function processPartOne(nodes: Node[]) {
}

function processPartTwo(nodes: Node[]) {
}


main();