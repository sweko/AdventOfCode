import * as fs from "fs";
import { performance } from "perf_hooks";
import { Puzzle } from "../model/puzzle";

const debug = process.env.DEBUG;
const test = process.env.TEST;

(async () => {

    const folderBase = "./";

    const folders = fs.readdirSync(folderBase, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .filter(name => name.startsWith("day-"))
        .sort();

    const times = [];

    for (const folder of folders) {
        console.log(`Loading code for ${folder}`);
        const codeFile = await import(`../${folder}/code.ts`);
        const solution: Puzzle = codeFile.solution;
        console.log(`Running code for day ${solution.day}`)

        console.log("  Start processing input")
        const startInput = performance.now();
        const input = await solution.input();
        const endInput = performance.now();
        const timeInput = Math.round(endInput - startInput);
        console.log(`  Running time for input is ${timeInput}ms`);

        if (debug) {
            solution.showInput(input);
        }

        if (test) {
            solution.test(input);
            return;
        }

        console.log("  Part 1: Initiating processing");

        const startOne = performance.now();
        const resultOne = solution.partOne(input, !!debug);
        const endOne = performance.now();
        const timeOne = Math.round(endOne - startOne);

        console.log(`  ${solution.resultOne(input, resultOne)}`);
        console.log(`  Running time for part 1 is ${timeOne}ms`);

        let timeTwo = 0;
        // these two methods are a set, so if one is missing, the other is too
        // we need to check for this, otherwise we get a runtime error
        if (solution.partTwo && solution.resultTwo) {
            console.log("  Part 2: Initiating processing");

            const startTwo = performance.now();
            const resultTwo = solution.partTwo(input, !!debug);
            const endTwo = performance.now();
            timeTwo = Math.round(endTwo - startTwo);

            console.log(`  ${solution.resultTwo(input, resultTwo)}`);
            console.log(`  Running time for part 2 is ${timeTwo}ms`);
        }


        times.push({
            day: solution.day,
            input: timeInput,
            one: timeOne,
            two: timeTwo,
            percentage: 0
        });
    }

    const totalInput = times.reduce((acc, cur) => acc + cur.input, 0);
    const totalOne = times.reduce((acc, cur) => acc + cur.one, 0);
    const totalTwo = times.reduce((acc, cur) => acc + cur.two, 0);

    const total = totalInput + totalOne + totalTwo;

    for (const time of times) {
        time.percentage = Math.round(((time.input + time.one + time.two)  / total) * 100);
    };

    console.log("Summary");
    console.table(times);
    console.log(`Total processing time: ${total}ms`);
})();