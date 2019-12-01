import { performance } from "perf_hooks";
import "../extra/array-helpers";
import { loopMatrix, readInput } from "../extra/aoc-helper";
import { printMatrix, generateModuloPrinter } from "../extra/terminal-helper";

type Path = {
    head: string;
    children: Path[];
}


async function main() {
    const startInput = performance.now();
    const inputRegex = await readInput();
    const path = parseRegex(inputRegex.slice(1, inputRegex.length-1));
    const endInput = performance.now();
    console.log(`Running time for input is ${Math.round(endInput - startInput)}ms`);

    const startOne = performance.now();
    let longestShortest = processPartOne(path);
    const endOne = performance.now();

    console.log(`Part 1: Longest shortest distance is: ${longestShortest}`);
    console.log(`Running time for part 1 is ${Math.round(endOne - startOne)}ms`);

    // const startTwo = performance.now();
    // resourceValue = processPartTwo(field);
    // const endTwo = performance.now();

    // console.log(`Part 2: Field value is: ${resourceValue}`);
    // console.log(`Running time for part 2 is ${Math.round(endTwo - startTwo)}ms`);
}

const parseRegex = (inputRegex: string): Path => {
    const head = inputRegex.slice(0,)


    return {
        head: "",
        children: []
    };
}


function processPartOne(path: Path): number {
    return 0;
}


main();