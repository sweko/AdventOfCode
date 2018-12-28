import { performance } from "perf_hooks";
import "../extra/array-helpers";
import { readInputLines } from "../extra/aoc-helper";
import { printMatrix } from "../extra/terminal-helper";

async function main() {
    const startInput = performance.now();

    const lines = await readInputLines();
    let clays = lines.map(line => {
        const match = line.match(/^(x|y)=(\d+), (x|y)=(\d+)..(\d+)$/);
        if (match[1] === "x") {
            return {
                top: Number(match[4]),
                bottom: Number(match[5]),
                left: Number(match[2]),
                right: Number(match[2])
            }
        } else {
            return {
                top: Number(match[2]),
                bottom: Number(match[2]),
                left: Number(match[4]),
                right: Number(match[5])
            }
        }
    }); 
    // .filter(clay => clay.top < 100)
    // .filter(clay => clay.left > 450)
    // .filter(clay => clay.left < 550);

    const leftOffset = clays.min(clay => clay.left) - 1;

    const box = {
        top: 0,
        bottom: clays.max(clay => clay.bottom) + 2,
        left: 0,
        right: clays.max(clay => clay.right) - leftOffset + 2
    }

    clays = clays.map(clay => ({
        ...clay,
        left: clay.left - leftOffset,
        right: clay.right - leftOffset
    }));

    const map = Array(box.bottom).fill(0).map(row => Array(box.right).fill("."));

    for (const clay of clays) {
        for (let rindex = clay.top; rindex <= clay.bottom; rindex++) {
            for (let cindex = clay.left; cindex <= clay.right; cindex++) {
                map[rindex][cindex] = "#";
            }
        }
    }

    map[0][500 - leftOffset] = "+";

    const endInput = performance.now();
    console.log(`Running time for input is ${Math.round(endInput - startInput)}ms`);

    //printMatrix(map);

    const startOne = performance.now();
    const waterContent = processPartOne(map);
    const endOne = performance.now();

    console.log(`Part 1: Opcodes with 3+ interpretations: ${waterContent}`);
    console.log(`Running time for part 1 is ${Math.round(endOne - startOne)}ms`);
    return;

    const startTwo = performance.now();
    // const regZero = processPartTwo(samples, program);
    const endTwo = performance.now();

    //console.log(`Part 2: Register zero has value of ${regZero}`);
    console.log(`Running time for part 2 is ${Math.round(endOne - startOne)}ms`);
}


function processPartOne(map: string[][]): number {
    const sources = [{
        top: 0,
        left: map[0].findIndex(c => c === "+"),
        root: 0,
        parent: null,
    }];

    let highSource = sources[0];
    let waterContent = 0;
    let round = 0;

    while (sources.length !== 0) {

        if (highSource.top >= map.length - 1) {
            const sourceIndex = sources.indexOf(highSource);
            sources.splice(sourceIndex, 1);
            highSource = sources.maxFind(source => source.top);
            continue;
        }

        if (highSource.top < highSource.root) {
            const sourceIndex = sources.indexOf(highSource);
            sources.splice(sourceIndex, 1);

            if (sources.indexOf(highSource.parent) === -1 && highSource.parent) {
                console.log("pushing parent", highSource.parent);
                sources.push(highSource.parent);
            }

            highSource = sources.maxFind(source => source.top);
            continue;
        }

        //map[highSource.top][highSource.left] = "~"


        const belowCell = map[highSource.top + 1][highSource.left];
        if (belowCell === ".") {
            // console.log(` drop @${highSource.top},${highSource.left}`);
            waterContent += 1;
            map[highSource.top + 1][highSource.left] = "~";
            highSource.top += 1;
        } else if (belowCell === "~" || belowCell === "#") {
            // console.log(` fill @${highSource.top},${highSource.left}`);
            let lindex = 1;

            let leftCell = map[highSource.top][highSource.left - lindex];
            let belowLeftCell = map[highSource.top + 1][highSource.left - lindex];

            while ((leftCell === ".") && (belowLeftCell === "~" || belowLeftCell === "#")) {
                waterContent += 1;
                map[highSource.top][highSource.left - lindex] = "~";

                lindex += 1;
                leftCell = map[highSource.top][highSource.left - lindex];
                belowLeftCell = map[highSource.top + 1][highSource.left - lindex];
            }

            let rindex = 1;

            let rightCell = map[highSource.top][highSource.left + rindex];
            let belowRightCell = map[highSource.top + 1][highSource.left + rindex];

            while ((rightCell === ".") && (belowRightCell === "~" || belowRightCell === "#")) {
                waterContent += 1;
                map[highSource.top][highSource.left + rindex] = "~";

                rindex += 1;
                rightCell = map[highSource.top][highSource.left + rindex];
                belowRightCell = map[highSource.top + 1][highSource.left + rindex];
            }

            if ((leftCell === ".") || (rightCell === ".")) {
                const sourceIndex = sources.indexOf(highSource);
                sources.splice(sourceIndex, 1);

                if (leftCell === ".") {
                    waterContent += 1;
                    map[highSource.top][highSource.left - lindex] = "~";
                    sources.push({
                        top: highSource.top,
                        left: highSource.left - lindex,
                        root: highSource.top,
                        parent: highSource
                    })
                }

                if (rightCell === ".") {
                    waterContent += 1;
                    map[highSource.top][highSource.left + rindex] = "~";
                    sources.push({
                        top: highSource.top,
                        left: highSource.left + rindex,
                        root: highSource.top,
                        parent: highSource
                    })
                }
            } else {
                highSource.top -= 1;
            }
        }

        highSource = sources.maxFind(source => source.top);

        round += 1;
        if (round === 3487) {
            console.log(sources);
            printMatrix(map, char => char === "." ? " " : char, index => (index + ":").padStart(5, " "));
            console.log(highSource);
            return;
        }
    }

    printMatrix(map, char => char === "." ? " " : char);
    return waterContent - sources.length;
}

// function processPartTwo(samples: Sample[], program: Instruction[]): number {
//     // should not work, but does
//     for (const sample of samples) {
//         const matches = opcodes.filter(opcode => (opcode.opcode === undefined) && testOpcode(sample, opcode));
//         if (matches.length === 1) {
//             matches[0].opcode = sample.instruction.opcode;
//         }
//     }

//     let state: Registers = [0, 0, 0, 0];
//     for (const instruction of program) {
//         const operation = opcodes.find(opcode => opcode.opcode === instruction.opcode);
//         state = operation.operation(state, instruction.a, instruction.b, instruction.c);
//     }
//     return state[0];
// }

main();