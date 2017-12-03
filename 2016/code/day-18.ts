import { readInput, readInputLines } from "../extra/aoc-helper";

async function main() {
    let part1 = false;
    let part2 = true;

    let rules = [
        [true, false, false],
        [true, true, false],
        [false, true, true],
        [false, false, true]
    ];

    let getLine = function (srcLine) {
        let line = [false].concat(srcLine).concat([false]);
        let result = [];
        for (var i = 1; i < line.length - 1; i++) {
            result.push(line[i - 1] !== line[i + 1]);
        }
        return result;
    }

    if (part1) {
        let data = await readInput();
        //data = ".^^.^.^^^^";
        let lines = [data.split('').map(c => c == '^')];
        while (lines.length < 40) {
            lines.push(getLine(lines[lines.length - 1]))
        }
        console.log(lines.length);
        let result = lines.map(l => l.reduce((a, v) => a + (v ? 0 : 1), 0))
            .reduce((a, v) => a + v, 0);
        console.log(result);
    }

    if (part2) {
        let data = await readInput();
        //data = ".^^.^.^^^^";
        let lines = [data.split('').map(c => c == '^')];
        while (lines.length < 400000) {
            lines.push(getLine(lines[lines.length - 1]))
        }
        console.log(lines.length);
        let result = lines.map(l => l.reduce((a, v) => a + (v ? 0 : 1), 0))
            .reduce((a, v) => a + v, 0);
        console.log(result);
    }
}

main();