import { readInput, readInputLines } from "../extra/aoc-helper";
import { isNumber } from "util";
import { terminal } from "terminal-kit";

async function main() {
    let lines = await readInputLines();

    let components = lines.map(cmd => cmd.split("/").map(n => parseInt(n)));

    let maxBridge = processPartOne(<Component[]>components);
    console.log(`Part 1: longest bridge is ${maxBridge}`);

    maxBridge = processPartTwo(<Component[]>components);
    console.log(`Part 1: longest bridge is ${maxBridge}`);
}

type Component = [number, number];

interface Bridge {
    display: string;
    strength: number;
    endPart: number;
    leftover: Component[];
}

function getBridges(bridge: Bridge) {
    return bridge.leftover
        .map((c, i) => ({ component: c, index: i }))
        .filter(c => c.component[0] === bridge.endPart || c.component[1] === bridge.endPart)
        .map(c => ({
            display: `${bridge.display}-${c.component[0]}/${c.component[1]}`,
            strength: bridge.strength + c.component[0] + c.component[1],
            endPart: c.component[0] === bridge.endPart ? c.component[1] : c.component[0],
            leftover: [...bridge.leftover.slice(0, c.index), ...bridge.leftover.slice(c.index + 1)]
        }));
}

function processPartOne(components: Component[]) {
    let bridges = [{
        display: "",
        strength: 0,
        endPart: 0,
        leftover: components
    }];

    let strongest = 0;

    for (let i = 0; i < components.length; i++) {
        bridges = [].concat(...bridges.map(b => getBridges(b)));
        const max = Math.max(...bridges.map(b => b.strength))
        if (max > strongest)
            strongest = max;
    }
    return strongest;
}


function processPartTwo(components: Component[]) {
    let bridges = [{
        display: "",
        strength: 0,
        endPart: 0,
        leftover: components
    }];

    let strongest = 0;

    for (let i = 0; i < components.length; i++) {
        bridges = [].concat(...bridges.map(b => getBridges(b)));
        if (bridges.length === 0){
            return strongest;
        }
        strongest = Math.max(...bridges.map(b => b.strength))
        console.log(`total number of bridges = ${bridges.length}`);
    }
    return strongest;
}

main();