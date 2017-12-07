import { readInput, readInputLines } from "../extra/aoc-helper";

interface NodeName {
    name: string;
    weight: number;
    children: string[];
}

interface Node {
    name: string;
    weight: number;
    totalWeight: number;
    children: Node[];
}

async function main() {
    console.time("total");
    const lines = await readInputLines();


    console.time("part one");
    let nodeNames = [];
    lines.forEach(line => nodeNames.push(...line.match(/([a-z]+)/g)));
    let rootName = processPartOne(nodeNames);
    console.timeEnd("part one");
    console.log(`Part 1: name of root = ${rootName}`);

    console.time("part two");
    let nodes = {};
    lines.forEach(line => {
        const node = toNode(line);
        nodes[node.name] = node;
    });
    let tree = makeTree(rootName, nodes);
    const balanceFix = processPartTwo(tree);
    console.timeEnd("part two");
    console.log(`Part 2: balance fix is ${balanceFix}`);

    console.timeEnd("total");
}

function toNode(line: string): NodeName {
    const leafRegex = /^([a-z]+) \((\d+)\)$/;
    const rootRegex = /^([a-z]+) \((\d+)\) -> ([a-z, ]+)$/
    let match;
    if (match = line.match(leafRegex)) {
        return {
            name: match[1],
            weight: parseInt(match[2]),
            children: []
        }
    } else if (match = line.match(rootRegex)) {
        const children = match[3].split(", ");
        return {
            name: match[1],
            weight: parseInt(match[2]),
            children: children
        }
    };
    throw Error(`Unknown node type ${line}`);
}

function makeTree(rootName, nodes: { [key: string]: NodeName }): Node {
    const root = nodes[rootName];
    const result: Node = {
        name: root.name,
        weight: root.weight,
        children: root.children.map(rc => makeTree(rc, nodes)),
        totalWeight: 0
    }
    return result;
}

function processPartOne(nodeNames: string[]) {
    const root = {};
    nodeNames.forEach(node => {
        if (root[node])
            delete root[node];
        else
            root[node] = true;
    });
    return Object.keys(root)[0];
}

let correctWeight: number;
function checkChildren(tree: Node) {
    const cweights = {};

    tree.children.forEach(tc => {
        if (cweights[tc.totalWeight])
            cweights[tc.totalWeight] += 1;
        else
            cweights[tc.totalWeight] = 1;
    });

    if (Object.keys(cweights).length == 2) {
        // wrong weight:
        const good = parseInt(Object.keys(cweights).find(key => cweights[key] !== 1));
        const wrong = parseInt(Object.keys(cweights).find(key => cweights[key] === 1));
        const wrongChild = tree.children.find(child => child.totalWeight === wrong);
        if (checkChildren(wrongChild)) {
            correctWeight = wrongChild.weight + good - wrongChild.totalWeight;
        }
        return false;
    }
    return true;
}

function calculateTotals(tree: Node) {
    tree.children.forEach(tc => calculateTotals(tc));
    tree.totalWeight = tree.weight + tree.children.reduce((a, c) => a + c.totalWeight, 0);
}

function processPartTwo(tree: Node) {
    calculateTotals(tree);
    checkChildren(tree);
    return correctWeight;
}


main();