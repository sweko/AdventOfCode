import { solutionOne } from "./code/day-01";
import { solutionTwo } from "./code/day-02";
import { solutionThree } from "./code/day-03";
import { solutionFour } from "./code/day-04";
import { solutionFive } from "./code/day-05";
import { solutionSix } from "./code/day-06";
import { solutionSeven } from "./code/day-07";
import { solutionEight } from "./code/day-08";
import { solutionNine } from "./code/day-09";
import { solutionTen } from "./code/day-10";
import { solutionEleven } from "./code/day-11";
import { solutionTwelve } from "./code/day-12";
import { solution13 } from "./code/day-13";
import { solution14 } from "./code/day-14";
import { solution15 } from "./code/day-15";
import { solution16 } from "./code/day-16";
import { solution17 } from "./code/day-17";
import { solution18 } from "./code/day-18";
import { solution19 } from "./code/day-19";
import { solution20 } from "./code/day-20";
import { solution21 } from "./code/day-21";
import { solution22 } from "./code/day-22";
import { solution23 } from "./code/day-23";
import { solution24 } from "./code/day-24";
import { solution25 } from "./code/day-25";

import { solution17_2018 } from "./code/day-17.2018";
import { solution20_2018 } from "./code/day-20.2018";
import { solution22_2018 } from "./code/day-22.2018";
import { solution23_2018 } from "./code/day-23.2018";
import { solution24_2018 } from "./code/day-24.2018";
import { solution25_2018 } from "./code/day-25.2018";
import { performance } from "perf_hooks";

const debug = process.env.DEBUG;
const test = process.env.TEST;
const solution = solution25_2018;

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