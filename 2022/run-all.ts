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
import { solutionThirteen } from "./code/day-13";
import { solutionFourteen } from "./code/day-14";
import { solutionFifteen } from "./code/day-15";
// import { solutionSixteen } from "./code/day-16";
// import { solutionSeventeen } from "./code/day-17";
// import { solutionEighteen } from "./code/day-18";
// import { solutionNineteen } from "./code/day-19";
// import { solutionTwenty } from "./code/day-20";
// import { solutionTwentyOne } from "./code/day-21";
// import { solutionTwentyTwo } from "./code/day-22";
// import { solutionTwentyThree } from "./code/day-23";
// import { solutionTwentyFour } from "./code/day-24";
// import { solutionTwentyFive } from "./code/day-25";
import { performance } from "perf_hooks";
import { Puzzle } from "./code/model";

const debug = process.env.DEBUG;
const test = process.env.TEST;
const solutions = [solutionOne, solutionTwo, solutionThree, solutionFour, solutionFive, 
   solutionSix, solutionSeven, solutionEight, solutionNine, solutionTen,
   solutionEleven, solutionTwelve, solutionThirteen, solutionFourteen, solutionFifteen ]
//   solutionSixteen, solutionSeventeen, solutionEighteen, solutionNineteen, solutionTwenty,
//   solutionTwentyOne, solutionTwentyTwo, solutionTwentyThree, solutionTwentyFour, solutionTwentyFive];

const runSolution = async <T>(solution: Puzzle<T, number>) => {
  console.log("Start processing input");
  const startInput = performance.now();
  const input = await solution.input(solution.day);
  const endInput = performance.now();
  console.log(
    `Running time for input is ${Math.round(endInput - startInput)}ms`
  );

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
  const totalOne = (((endOne - startOne) * 1000) | 0) / 1000;

  if (!solution.partTwo) {
    return {
      day: solution.day,
      partOne: totalOne,
      partTwo: 0
    }
  }

  console.log("Part 2: Initiating processing");

  const startTwo = performance.now();
  const resultTwo = solution.partTwo(input, !!debug);
  const endTwo = performance.now();

  console.log(solution.resultTwo(input, resultTwo));
  console.log(`Running time for part 2 is ${Math.round(endTwo - startTwo)}ms`);
  const totalTwo = (((endTwo - startTwo) * 1000) | 0) / 1000;

  return {
    day: solution.day,
    partOne: totalOne,
    partTwo: totalTwo
  }
};

(async () => {
  let total = 0;
  const perfs = [];
  for (const solution of solutions) {
    console.log("------------------");
    console.log(`Task #${solution.day}`);
    console.log("------------------");
    const start = performance.now();
    const result = await runSolution(solution as any);
    const end = performance.now();
    total += end - start;
    result["total"]=(((end - start) * 1000) | 0) / 1000;
    perfs.push(result);
  }
  
  const results = perfs.map(p => ({
    ...p,
    percentage: (((p.total / total * 100) * 1000) | 0) / 1000
  }));

  //results.sort((f, s) => f.percentage - s.percentage);

  console.table(results);
  console.log("------------------");
  console.log(`Total run time is ${Math.round(total)}ms`);
  console.log("------------------");

})();

