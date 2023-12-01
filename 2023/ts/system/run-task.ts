import { performance } from "perf_hooks";
import { Puzzle } from "../model/puzzle";

const debug = process.env.DEBUG;
const test = process.env.TEST;

(async () => {

    const params = process.argv.slice(2);
    if (params.length !== 1) {
        console.log("Please provide a day to run");
        return;
    }

    const day = +params[0];
    const folder = `../day-${day.toString().padStart(2, "0")}`;
    console.log(`Loading code for day ${day}`);

    const codeFile = await import(`${folder}/code.ts`);
    const solution: Puzzle = codeFile.solution;

    console.log(`Running code for day ${solution.day}`)
    console.log("Start processing input")
    const startInput = performance.now();
    const input = await solution.input();
    const endInput = performance.now();
    console.log(`Running time for input is ${Math.round(endInput - startInput)}ms`);

    if (debug) {
        solution.showInput(input);
    }

    if (test) {
        solution.test(input);
        return;
    }

    console.log("Part 1: Initiating processing");

    const startOne = performance.now();
    const resultOne = solution.partOne(input, !!debug);
    const endOne = performance.now();

    console.log(solution.resultOne(input, resultOne));
    console.log(`Running time for part 1 is ${Math.round(endOne - startOne)}ms`);

    if (!solution.partTwo) {
        return;
    }
    // these two methods are a set, so if one is missing, the other is too
    // we need to check for this, otherwise we get a runtime error
    if (!solution.resultTwo) {
        return;
    }

    console.log("Part 2: Initiating processing");

    const startTwo = performance.now();
    const resultTwo = solution.partTwo(input, !!debug);
    const endTwo = performance.now();

    console.log(solution.resultTwo(input, resultTwo));
    console.log(`Running time for part 2 is ${Math.round(endTwo - startTwo)}ms`);
})();