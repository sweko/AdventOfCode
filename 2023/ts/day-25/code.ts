// Solution for day 25 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

interface NodeInput {
    name: string;
    children: string[];
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const lineRegex= /(^\w+): ((?:\w+ )*\w+)/;
    const nodes = lines.map(line => {
        const match = line.match(lineRegex);
        if (match) {
            const [, key, value] = match;
            return {
                name: key,
                children: value.split(" ").filter(c => c),
            } as NodeInput;
        }
        throw Error(`Invalid input line ${line}`);
    });
    return nodes;
};

interface Graph {
    nodes: Set<string>;
    edges: {first: string, second: string}[];
}

const countCycles = (inputGraph: Graph) => {
    const graph = {
        nodes: new Set(inputGraph.nodes),
        edges: [...inputGraph.edges]
    }
    const cycles = [];

    while (graph.nodes.size > 0) {
        const node = graph.nodes.values().next().value;
        const cycle: string[] = [node];
        graph.nodes.delete(node);

        const queue = [
            ...graph.edges.filter(e => e.first === node).map(e => e.second),
            ...graph.edges.filter(e => e.second === node).map(e => e.first),
        ];

        while (queue.length > 0) {
            const next = queue.shift()!;
            if (next) {
                if (cycle.includes(next)) {
                    continue;
                }
                cycle.push(next);
                graph.nodes.delete(next);
                queue.push(
                    ...graph.edges.filter(e => e.first === next).map(e => e.second),
                    ...graph.edges.filter(e => e.second === next).map(e => e.first),
                );
            }
        }

        cycles.push(cycle);
    }

    return cycles;
}

const partOne = (input: NodeInput[], debug: boolean) => {
    // console.log(input);

    const graph: Graph = {
        nodes: new Set(),
        edges: []
    };

    for (const nodeInput of input) {
        graph.nodes.add(nodeInput.name);
        for (const child of nodeInput.children) {
            graph.nodes.add(child);
            graph.edges.push({first: nodeInput.name, second: child});
        }
    }

    // by looking at the image graph.sfdp.png we can see that the three edges are:
    // - tmt -- pnz
    // - mvv -- xkz
    // - gbc -- hxr

    let edgeOne = graph.edges.findIndex(e => e.first === "tmt" && e.second === "pnz");
    if (edgeOne === -1) {
        edgeOne = graph.edges.findIndex(e => e.first === "pnz" && e.second === "tmt");
    }
    graph.edges.splice(edgeOne, 1);

    let edgeTwo = graph.edges.findIndex(e => e.first === "mvv" && e.second === "xkz");
    if (edgeTwo === -1) {
        edgeTwo = graph.edges.findIndex(e => e.first === "xkz" && e.second === "mvv");
    }
    graph.edges.splice(edgeTwo, 1);

    let edgeThree = graph.edges.findIndex(e => e.first === "gbc" && e.second === "hxr");
    if (edgeThree === -1) {
        edgeThree = graph.edges.findIndex(e => e.first === "hxr" && e.second === "gbc");
    }
    graph.edges.splice(edgeThree, 1);

    // there will be 2 cycles now in the graph
    const [first, second] = countCycles(graph);
    const result = first.length * second.length;
    return result;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const showInput = (input: NodeInput[]) => {
    console.log(input);
};

const test = (_: NodeInput[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<NodeInput[], number> = {
    day: 25,
    input: () => processInput(25),
    partOne,
    resultOne: resultOne,
    showInput,
    test,
}