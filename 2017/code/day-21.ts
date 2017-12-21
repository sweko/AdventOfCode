import { readInput, readInputLines } from "../extra/aoc-helper";
import { terminal } from "terminal-kit";
import "../extra/group-by";

interface Rule {
    size: number;
    inputs: string;
    output: string[][];
}

async function main() {
    // const test = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    // const test = [
    //     [1, 2, 3, 4, 5, 6],
    //     [11, 12, 13, 14, 15, 16],
    //     [21, 22, 23, 24, 25, 26],
    //     [31, 32, 33, 34, 35, 36],
    //     [41, 42, 43, 44, 45, 46],
    //     [51, 52, 53, 54, 55, 56],
    // ];
    // let s3 = subsplit(test, 3);
    // console.log(unsplit(s3));

    // let s2 = subsplit(test, 2);
    // console.log(unsplit(s2));
    // return;



    console.time("Reading Input");
    const rulesIn = await readInputLines();
    const rules = rulesIn.map(rule => processInRule(rule));
    console.timeEnd("Reading Input");
    
    console.time("Part 1");
    let result = processPartOne(rules);
    console.timeEnd("Part 1");
    console.log(`Part 1: total on count after 5 runs is ${result}`);

    console.time("Part 2");
    result = processPartTwo(rules);
    console.timeEnd("Part 2");
    console.log(`Part 2: total on count after 18 runs is ${result}`);
}

function processInRule(rule: string): Rule {
    const ruleRegex = /^((\.|#|\/)+) => ((\.|#|\/)+)$/;

    let [, inRule, , outRule] = rule.match(ruleRegex);

    const inputArr = inRule.split("/").map(inrow => inrow.split(""));
    const outputArr = outRule.split("/").map(outrow => outrow.split(""));

    return {
        size: inputArr.length,
        inputs: getFlipRot(inputArr).map(inrule => toString(inrule)).join("|"),
        output: outputArr
    }
}

function toString(source: string[][]) {
    return source.map(row => row.join("")).join('/');
}

function getFlipRot<T>(source: T[][]): T[][][] {
    const result: T[][][] = [];
    result.push(source);
    result.push(flip(source));
    result.push(rotate(source, 90));
    result.push(flip(rotate(source, 90)));
    result.push(rotate(source, 180));
    result.push(flip(rotate(source, 180)));
    result.push(rotate(source, 270));
    result.push(flip(rotate(source, 270)));
    return result;
}

function flip<T>(source: T[]): T[] {
    const result = [];
    for (let index = source.length - 1; index >= 0; index -= 1) {
        result.push(source[index]);
    }
    return result;
}

function rotate<T>(source: T[][], angle: 90 | 180 | 270): T[][] {
    if (angle === 90) {
        const result = [];
        const size = source.length;
        for (let rindex = 0; rindex < size; rindex++) {
            result.push([]);
            for (let cindex = 0; cindex < size; cindex++) {
                result[rindex].push(source[size - cindex - 1][rindex])
            }
        }
        return result;
    } else if (angle === 180) {
        return flip(source).map(line => flip(line));
    } else if (angle === 270) {
        return rotate(rotate(source, 180), 90);
    }
}

function getMatrixSegment<T>(matrix: T[][], row: number, column: number, size: number): T[][] {
    const result = [];
    for (let rindex = 0; rindex < size; rindex++) {
        result.push([]);
        for (let cindex = 0; cindex < size; cindex++) {
            result[rindex].push(matrix[rindex + row][cindex + column])
        }
    }
    return result;
}

function subsplit<T>(pattern: T[][], size: number): T[][][][] {
    const result = [];
    const ressize = pattern.length / size;
    for (let rindex = 0; rindex < ressize; rindex++) {
        result.push([]);
        for (let cindex = 0; cindex < ressize; cindex++) {
            result[rindex].push(getMatrixSegment(pattern, rindex * size, cindex * size, size));
        }
    }
    return result;
}

function unsplit<T>(patterns: T[][][][]): T[][] {
    const psize = patterns[0][0].length;
    const result = Array(patterns.length * psize).fill(null).map(_ => []);

    for (let prindex = 0; prindex < patterns.length; prindex++) {
        for (let pcindex = 0; pcindex < patterns.length; pcindex++) {
            for (let rindex = 0; rindex < psize; rindex++) {
                for (let cindex = 0; cindex < psize; cindex++) {
                    result[prindex * psize + rindex][pcindex * psize + cindex] =
                        patterns[prindex][pcindex][rindex][cindex];
                }
            }
        }
    }
    return result;
}

function process(pattern: string[][], rules: Rule[], runs: number) {
    for (let run = 0; run < runs; run++) {
        let factor;
        if (pattern.length % 2 === 0) {
            factor = 2;
        } else if (pattern.length % 3 === 0) {
            factor = 3;
        } else {
            throw Error("Not divisible by 2 or 3");
        }
        const parts = subsplit(pattern, factor);
        const maps = parts
            .map(pl => pl.map(part => toString(part)))
            .map(ml => ml.map(m => rules.find(r => r.inputs.includes(m)).output));
        pattern = unsplit(maps);
    }
    return pattern.map(row => row.filter(c => c === "#").length).reduce((a, b) => a + b, 0);
}

function processPartOne(rules: Rule[]) {
    const initPattern = [".#.".split(""), "..#".split(""), "###".split("")];
    return process(initPattern, rules, 5);
}


function processPartTwo(rules: Rule[]) {
    const initPattern = [".#.".split(""), "..#".split(""), "###".split("")];
    return process(initPattern, rules, 18);
}

main();