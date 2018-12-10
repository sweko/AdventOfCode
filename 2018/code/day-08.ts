import { readInput } from "../extra/aoc-helper";
import { performance } from "perf_hooks";
import "../extra/array-helpers";

interface Node {
    children: Node[];
    metadata: number[];
}


async function main() {
    const input = await readInput();

    const startInput = performance.now();

    const numbers = input.split(" ").map(item => Number(item));
    const rootNode = getNodes(numbers);

    //console.log(JSON.stringify(rootNode, null, 2));

    const endInput = performance.now();
    console.log(`Running time for input is ${Math.round(endInput - startInput)}ms`);

    const startOne = performance.now();
    let metadataSum = processPartOne(rootNode);
    const endOne = performance.now();

    console.log(`Part 1: total metadata sum is ${metadataSum}`);
    console.log(`Running time for part 1 is ${Math.round(endOne - startOne)}ms`);

    const startTwo = performance.now();
    let nodeValue = processPartTwo(rootNode);
    const endTwo = performance.now();

    console.log(`Part 2: total node value is ${nodeValue}`);
    console.log(`Running time for part 2 is ${Math.round(endTwo - startTwo)}ms`);
}

function getNodes(numbers: number[]): Node {
    return getNodeImpl(numbers, 0).node;
}

function getNodeImpl(numbers: number[], startIndex: number): { node: Node, length: number } {
    const result: Node = {
        children: [],
        metadata: []
    }
    const childCount = numbers[startIndex];
    const metadataCount = numbers[startIndex + 1];
    //console.log(`on ${startIndex} - children:${childCount}, metadata: ${metadataCount}`);
    let length = 2;
    for (let index = 0; index < childCount; index++) {
        const { node: child, length: childLength } = getNodeImpl(numbers, startIndex + length);
        result.children.push(child);
        length += childLength;
    }
    for (let index = 0; index < metadataCount; index++) {
        result.metadata.push(numbers[startIndex + length]);
        length += 1;
    }
    return {
        node: result,
        length
    }
}

function sumMetadata(node: Node) : number {
    const localSum = node.metadata.sum();
    const childSum = node.children.sum(child => sumMetadata(child));
    return localSum + childSum;
}

function processPartOne(rootNode: Node): number {
    return sumMetadata(rootNode);
}


function getNodeValue(node: Node): number {
    if (!node){
        return 0;
    }

    if (node.children.length === 0) {
        return node.metadata.sum();
    }

    return node.metadata.sum(md => getNodeValue(node.children[md-1]))
}

function processPartTwo(rootNode: Node): number {
    return getNodeValue(rootNode);
}


main();