import { readInput, loopMatrix, readInputLines } from "../extra/aoc-helper";
import { performance } from "perf_hooks";
import "../extra/array-helpers";

interface Node {
    key: string;
    isIntersection: boolean;
    connexions: string[];
}
type Nodes = { [key: string]: Node };

interface Cart {
    current: { x: number; y: number; };
    prevKey: string;
    next: "left" | "right" | "straight";
}

type Carts = Cart[];

const nextActions: { [key: string]: "left" | "right" | "straight" } = {
    left: "straight",
    straight: "right",
    right: "left"
};

const intersectOffsets = {
    left: 1,
    straight: 2,
    right: 3
};

async function main() {
    const startInput = performance.now();

    const lines = await readInputLines();

    // lines.forEach(line => console.log(line));

    let { carts, nodes } = processInput(lines);
    // console.log(carts, nodes);

    const endInput = performance.now();
    console.log(`Running time for input is ${Math.round(endInput - startInput)}ms`);

    const startOne = performance.now();
    const firstCrash = processPartOne(carts, nodes);
    const endOne = performance.now();

    console.log(`Part 1: first crash occurs on coordinates ${firstCrash}`);
    console.log(`Running time for part 1 is ${Math.round(endOne - startOne)}ms`);

    const startTwo = performance.now();
    ({ carts, nodes } = processInput(lines));
    const lastMan = processPartTwo(carts, nodes);
    const endTwo = performance.now();

    console.log(`Part 2: Last man standing at position ${lastMan}`);
    console.log(`Running time for part 2 is ${Math.round(endTwo - startTwo)}ms`);
}

function processInput(lines: string[]): { carts: Carts, nodes: Nodes } {
    const nodes: Nodes = {};
    const carts: Carts = [];

    for (let row = 0; row < lines.length; row++) {
        const line = lines[row].split("");
        for (let column = 0; column < line.length; column++) {
            let char = line[column];
            if (char === " ") {
                continue;
            }

            const key = `${row},${column}`;

            if (char === "v") {
                carts.push({
                    current: { x: row, y: column },
                    prevKey: `${row - 1},${column}`,
                    next: "left"
                });
                char = "|";
            }
            if (char === "^") {
                carts.push({
                    current: { x: row, y: column },
                    prevKey: `${row + 1},${column}`,
                    next: "left"
                });
                char = "|";
            }
            if (char === ">") {
                carts.push({
                    current: { x: row, y: column },
                    prevKey: `${row},${column - 1}`,
                    next: "left"
                });
                char = "-";
            }
            if (char === "<") {
                carts.push({
                    current: { x: row, y: column },
                    prevKey: `${row},${column + 1}`,
                    next: "left"
                });
                char = "-";
            }

            if (char === "|") {
                nodes[key] = {
                    key: key,
                    isIntersection: false,
                    connexions: [`${row - 1},${column}`, `${row + 1},${column}`]
                };
                continue;
            }
            if (char === "-") {
                nodes[key] = {
                    key: key,
                    isIntersection: false,
                    connexions: [`${row},${column - 1}`, `${row},${column + 1}`]
                };
                continue;
            }
            if (char === "/") {
                const connexions = (["-", "+", ">", "<"].includes(line[column - 1]))
                    ? [`${row},${column - 1}`, `${row - 1},${column}`] // left-and-up
                    : [`${row},${column + 1}`, `${row + 1},${column}`] // right-and-down

                nodes[key] = {
                    key: key,
                    isIntersection: false,
                    connexions: connexions
                };
                continue;
            }
            if (char === "\\") {
                const connexions = (["-", "+", ">", "<"].includes(line[column - 1]))
                    ? [`${row},${column - 1}`, `${row + 1},${column}`] // left-and-down
                    : [`${row},${column + 1}`, `${row - 1},${column}`] // right-and-up

                nodes[key] = {
                    key: key,
                    isIntersection: false,
                    connexions: connexions
                };
                continue;
            }
            if (char === "+") {
                nodes[key] = {
                    key: key,
                    isIntersection: true,
                    connexions: [
                        `${row - 1},${column}`,
                        `${row},${column + 1}`,
                        `${row + 1},${column}`,
                        `${row},${column - 1}`
                    ]
                }
                continue;
            }
            console.log("PARSING FAILED");
            return null;
        }
    }

    return { carts, nodes };
}

function printSituation(carts: Carts, nodes: Nodes) {
    const nodeArray = Object.keys(nodes).map(key => nodes[key]);
    const height = nodeArray.max(node => Number(node.key.split(",")[0]));
    const width = nodeArray.max(node => Number(node.key.split(",")[1]));

    const lines = [];
    for (let row = 0; row <= height; row++) {
        const line = [];
        for (let column = 0; column <= width; column++) {
            const key = `${row},${column}`;
            const node = nodes[key];
            if (node) {
                if (node.isIntersection) {
                    line.push("+");
                } else {
                    line.push(".");
                }
            } else {
                line.push(" ");
            }
        }
        lines.push(line);
    }

    for (const cart of carts) {
        lines[cart.current.x][cart.current.y] = "X";
    }

    for (const line of lines) {
        console.log(line.join(""));
    }
}

function processPartOne(carts: Carts, nodes: Nodes): string {

    //printSituation(carts, nodes);

    carts = carts.sort((a, b) => (a.current.y - b.current.y) || (a.current.x - b.current.x));

    while (true) {
        for (const cart of carts) {
            const key = `${cart.current.x},${cart.current.y}`;
            const node = nodes[key];
            if (!node) {
                console.log(`Screwed up something, requesting node ${key}`);
                return null;
            }
            let next: string;
            if (!node.isIntersection) {
                next = node.connexions.find(cnx => cnx !== cart.prevKey);
            } else {
                const prevIndex = node.connexions.findIndex(cnx => cnx === cart.prevKey);
                const nextIndex = (prevIndex + intersectOffsets[cart.next]) % 4;
                next = node.connexions[nextIndex]
                cart.next = nextActions[cart.next];
            }
            const [x, y] = next.split(",").map(coord => Number(coord));

            if (carts.find(other => other.current.x === x && other.current.y === y)) {
                return `${y},${x}`;
            }

            cart.current = { x, y };
            cart.prevKey = key;

        };
        // console.log(carts);
        // printSituation(carts, nodes);
    }
}

function processPartTwo(carts: Carts, nodes: Nodes): string {
    // console.log(carts);
    // printSituation(carts, nodes);

    carts = carts.sort((a, b) => (a.current.y - b.current.y) || (a.current.x - b.current.x));
    let run = 0;
    while (carts.length !== 1) {
        run +=1;
        for (let index = 0; index < carts.length; index += 1) {
            const cart = carts[index];
            const key = `${cart.current.x},${cart.current.y}`;
            const node = nodes[key];
            if (!node) {
                console.log(`Screwed up something, requesting node ${key}`);
                return null;
            }
            let next: string;
            if (!node.isIntersection) {
                next = node.connexions.find(cnx => cnx !== cart.prevKey);
            } else {
                const prevIndex = node.connexions.findIndex(cnx => cnx === cart.prevKey);
                const nextIndex = (prevIndex + intersectOffsets[cart.next]) % 4;
                next = node.connexions[nextIndex]
                cart.next = nextActions[cart.next];
            }
            const [x, y] = next.split(",").map(coord => Number(coord));

            const otherIndex = carts.findIndex(other => other.current.x === x && other.current.y === y);
            if (otherIndex !== -1) {
                // console.log(`crash on location ${x},${y}, run ${run}`);
                carts.splice(otherIndex, 1);
                if (otherIndex < index) {
                    index -= 1;
                }
                carts.splice(index, 1);
                index -= 1;
            }

            cart.current = { x, y };
            cart.prevKey = key;
        };
        // console.log(carts);
        // printSituation(carts, nodes);
    }
    return `${carts[0].current.y},${carts[0].current.x}`;
}

main();