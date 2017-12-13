import { readInput, readInputLines } from "../extra/aoc-helper";
import { listenerCount } from "cluster";

interface Node {
    index: number;
    children: number[];
}

async function main() {
    let lines = await readInputLines();

    let graph = lines.map(line => parseLine(line));
    console.time("part 1");
    let zeroGroup = processPartOne(graph);
    console.timeEnd("part 1");
    console.log(`Part 1: members in zero group = ${zeroGroup}`);

    console.time("part 2");
    let groupCount = processPartTwo(graph);
    console.timeEnd("part 2");
    console.log(`Part 2: total number of groups = ${groupCount}`);

}

function parseLine(line: string) {
    const lineRegex = /^(\d+) <-> (.*)$/;
    const match = line.match(lineRegex);
    const children = match[2].split(", ").map(child => parseInt(child));
    return {
        index: parseInt(match[1]),
        children: children
    };
}

function processPartOne(graph: Node[]) {
    const zeroGroup = getGroupFor(0, graph);
    return zeroGroup.length;
}

function getGroupFor(root: number, graph: Node[]) {
    const result = [root];
    let index = 0;

    while (index != result.length) {
        graph[result[index]].children.forEach(c => {
            if (!result.includes(c)) {
                result.push(c);
            }
        });
        index++;
    }
    return result;
}

function processPartTwo(graph: Node[]) {
    const groups = [];
    const roots: boolean[] = Array(graph.length).fill(true);

    let nextRoot = roots.findIndex(r => r);
    while (nextRoot !== -1) {
        let groop = getGroupFor(nextRoot, graph);
        groop.forEach(item => roots[item] = false)
        nextRoot = roots.findIndex(r => r);
        groups.push(groop);
    }

    return groups.length;
}


main();