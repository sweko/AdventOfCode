import { solutionOne } from "./code/day-01";
import { performance } from "perf_hooks";

const debug = process.env.DEBUG;
const test = process.env.TEST;
const solution = solutionOne;

(async () => {
    console.log(`Start processing input`)
    const startInput = performance.now();
    const input = await solution.input(solution.day);
    const endInput = performance.now();
    console.log(`Running time for input is ${Math.round(endInput - startInput)}ms`);

    if (debug) {
        solution.showInput(input);
    }

    if (test) {
        solution.test(input);
        return;
    }

    console.log(`Part 1: Initiating processing`);

    const startOne = performance.now();
    const resultOne = solution.partOne(input, !!debug);
    const endOne = performance.now();

    console.log(solution.resultOne(input, resultOne));
    console.log(`Running time for part 1 is ${Math.round(endOne - startOne)}ms`);

    if (!solution.partTwo) {
        return;
    }

    console.log(`Part 2: Initiating processing`);

    const startTwo = performance.now();
    const resultTwo = solution.partTwo(input, !!debug);
    const endTwo = performance.now();

    console.log(solution.resultTwo(input, resultTwo));
    console.log(`Running time for part 2 is ${Math.round(endTwo - startTwo)}ms`);
})();