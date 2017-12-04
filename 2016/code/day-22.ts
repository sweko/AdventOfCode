import { readInput, readInputLines } from "../extra/aoc-helper";
import { terminal } from "terminal-kit";

interface Node {
    x: number;
    y: number;
    size: number,
    used: number;
    avail: number;
    percentage: number;
    target?: boolean;
}

async function main() {
    const lines = await readInputLines();
    const nodes = lines.map(line => {
        const match = line.match(/^\/dev\/grid\/node-x(\d+)-y(\d+)\s*(\d+)T\s*(\d+)T\s*(\d+)T\s*(\d+)%$/).slice(1).map(m => parseInt(m));
        return <Node>{
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

    let totalMoves = processPartTwo(nodes);
    console.log(`Part 2: total ${totalMoves} needed`);
}

function processPartOne(nodes: Node[]) {
    let countViable = 0;
    for (let aindex = 0; aindex < nodes.length; aindex++) {
        const availNode = nodes[aindex];
        if (availNode.used !== 0) continue;
        for (let uindex = 0; uindex < nodes.length; uindex++) {
            const usedNode = nodes[uindex];
            if (uindex == aindex) continue;
            if (availNode.avail > usedNode.used)
                countViable++;
        }
        console.log(aindex);
        terminal.previousLine();
    }
    return countViable;
}

function showMap(nodes) {
    const maxx = Math.max(...nodes.map(node => node.x));
    const maxy = Math.max(...nodes.map(node => node.y));

    const map = [];
    for (let i = 0; i <= maxy; i++) {
        map[i] = [];
        for (let j = 0; j <= maxx; j++) {
            map[i][j] = ".";
        }
    }

    nodes.forEach(node => {
        if (node.target) {
            map[node.y][node.x] = "G"
        }
        if (node.used === 0) {
            map[node.y][node.x] = "_"
        }
        if (node.size > 200) {
            map[node.y][node.x] = "#";
        }
    });

    map.map(line => line.join(" ")).forEach(line => console.log(line));
    console.log();
}

function nodeByPos(nodes: Node[], x: number, y: number) {
    return nodes.find(node => node.x === x && node.y === y);
}

function moveUp(nodes, empty, moves) {
    let above = nodeByPos(nodes, empty.x, empty.y - 1);
    above.y += 1;
    empty.y -= 1;
    return moves + 1;
}

function moveLeft(nodes, empty, moves) {
    let left = nodeByPos(nodes, empty.x - 1, empty.y);
    left.x += 1;
    empty.x -= 1;
    return moves + 1;
}

function moveRight(nodes, empty, moves) {
    let right = nodeByPos(nodes, empty.x + 1, empty.y);
    right.x -= 1;
    empty.x += 1;
    return moves + 1;
}

function moveDown(nodes, empty, moves) {
    let above = nodeByPos(nodes, empty.x, empty.y + 1);
    above.y -= 1;
    empty.y += 1;
    return moves + 1;
}

function processPartTwo(nodes: Node[]) {
    const maxx = Math.max(...nodes.map(node => node.x));
    nodeByPos(nodes, maxx, 0).target = true;
    const emptyNode = nodes.find(node => node.used === 0);
    let moves = 0;
    let above = nodeByPos(nodes, emptyNode.x, emptyNode.y - 1);
    while (above.used < 200) {
        moves = moveUp(nodes, emptyNode, moves);
        above = nodeByPos(nodes, emptyNode.x, emptyNode.y - 1);
    }
    while (above.used > 200) {
        moves = moveLeft(nodes, emptyNode, moves);
        above = nodeByPos(nodes, emptyNode.x, emptyNode.y - 1);
    }
    while (above) {
        moves = moveUp(nodes, emptyNode, moves);
        above = nodeByPos(nodes, emptyNode.x, emptyNode.y - 1);
    }
    let right = nodeByPos(nodes, emptyNode.x + 1, emptyNode.y);
    while (right) {
        moves = moveRight(nodes, emptyNode, moves);
        right = nodeByPos(nodes, emptyNode.x + 1, emptyNode.y);
    }

    for (let i = 0; i < 35; i++) {
        moves = moveDown(nodes, emptyNode, moves);
        moves = moveLeft(nodes, emptyNode, moves);
        moves = moveLeft(nodes, emptyNode, moves);
        moves = moveUp(nodes, emptyNode, moves);
        moves = moveRight(nodes, emptyNode, moves);
    }
    return moves;
}


main();