import { readInput, readInputLines } from "../extra/aoc-helper";
import { terminal } from "terminal-kit";

interface FirewallLayer {
    index: number;
    depth: number;
    scannerPos: number;
    direction: number;
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

function processPartTwo(firewallIn: Firewall) {
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
        // magic number based on input
        delay += step;
    }
}


main();