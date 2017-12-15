import { readInput, readInputLines } from "../extra/aoc-helper";
import { terminal } from "terminal-kit";
import '../extra/group-by';

interface FirewallLayer {
    index: number;
    depth: number;
    scannerPos: number;
    direction: number;
    offset?: number;
    multiplier?: number;
}

type Firewall = FirewallLayer[];

async function main() {
    const lines = await readInputLines();

    const firewallIn = lines.map(line => {
        const nums = line.split(": ");
        return {
            index: parseInt(nums[0]),
            depth: parseInt(nums[1]),
            scannerPos: 0,
            direction: 1
        }
    });


    console.time("part 1");
    let severity = processPartOne(firewallIn);
    console.timeEnd("part 1");
    console.log(`Part 1: Severity at zero = ${severity}`);

    console.time("part 2");
    let minEscape = processPartTwo(firewallIn);
    console.timeEnd("part 2");
    console.log(`Part 2: Minimum escape delay = ${minEscape}`);

}

function fillFirewall(sparseFirewall: Firewall): Firewall {
    return Array(sparseFirewall.reduce((a, b) => Math.max(a, b.index), 0) + 1)
        .fill(false)
        .map((_, i) => {
            const item = sparseFirewall.find(item => item.index === i);
            return {
                ...item || {
                    index: i,
                    depth: 1,
                    scannerPos: 1,
                    direction: 0
                }
            }
        });
}

function moveScanners(firewall: Firewall) {
    firewall.forEach(layer => {
        layer.scannerPos += layer.direction;
        if (layer.scannerPos === 0)
            layer.direction = 1;
        if (layer.scannerPos === layer.depth - 1)
            layer.direction = -1;
    })
}

function processPartOne(firewallIn: Firewall) {
    const firewall = fillFirewall(firewallIn);
    let pathIndex = 0;
    let severity = 0;
    while (pathIndex < firewall.length) {
        const layer = firewall[pathIndex];
        if (layer.scannerPos === 0) {
            // console.log(`caught at layer ${pathIndex}`);
            severity += layer.depth * pathIndex;
        }
        moveScanners(firewall);
        pathIndex++
    }
    return severity;
}

function processPartTwoManual(firewallIn: Firewall) {
    // magic numbers based on input analysis
    let delay = 17370;
    let step = 30030;

    let baseFirewall = fillFirewall(firewallIn);
    for (let i = 0; i < delay; i++) moveScanners(baseFirewall);

    while (true) {
        let severity = 0;
        let pathIndex = 0;
        const firewall = fillFirewall(baseFirewall);
        let caught = false;

        while (pathIndex < firewall.length) {
            const layer = firewall[pathIndex];
            if (layer.scannerPos === 0) {
                // console.log(`at delay ${delay} caught at layer ${pathIndex}`);
                // terminal.previousLine();
                caught = true;
                break;
            }
            moveScanners(firewall);
            pathIndex++
        }
        if (!caught) return delay;
        baseFirewall = fillFirewall(baseFirewall);
        for (let i = 0; i < step; i++) moveScanners(baseFirewall);
        delay += step;
    }
}

function processPartTwo(firewallIn: Firewall) {
    // prepare data
    firewallIn.forEach(layer => {
        layer.multiplier = 2 * (layer.depth - 1);
        layer.offset = (100 * layer.multiplier - layer.index) % layer.multiplier;
    });
    const groupsStraight = firewallIn.groupBy(layer => layer.multiplier).map(group => ({
        key: group.key,
        items: group.items.map(layer => layer.offset)
    }));
    groupsStraight.sort((a, b) => a.key - b.key);

    const groupsReverse = groupsStraight.map(group => ({
        key: group.key,
        items: Array(group.key).fill(0).map((_, i) => i).filter(i => !group.items.includes(i))
    }));

    for (let index = 0; index < groupsStraight.length; index++) {
        const group = groupsStraight[index];
        const otherGroups = groupsReverse.filter(g => g.key % group.key === 0 && g.key !== group.key);
        otherGroups.forEach(og => {
            og.items = og.items.filter(item => !group.items.includes(item % group.key));
        });
    }
    // const values = groupsReverse.filter(g => g.items.length === 1).map(group => ({
    //     index: group.key,
    //     offset: group.items[0]
    // }))

    // looping - could be calculated if we exctract the groups with a single value
    let index = 1;
    while (true) {
        if (groupsReverse.every(group => group.items.includes(index % group.key))) {
            return index;
        }
        index++;
    }
}


main();