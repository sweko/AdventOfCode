import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    const result = [];
    
    let scenario = [];
    for (const line of input) {
        if (line === "") {
            result.push(scenario);
            scenario = [];
        } else {
            scenario.push(line);
        }
    }
    result.push(scenario);
    return result;
};

const partOne = (input: string[][], debug: boolean) => {
    return input.map(sc => new Set(sc.map(as => as.split("").sort()).flat()).size).sum();
};

const partTwo = (input: string[][], debug: boolean) => {
    const result = input.map(sc => sc.map(as => as.split("").sort()));
    let output = 0;
    for (const scenario of result) {
        let scenarioResult = scenario[0].slice();
        for (const answers of scenario.slice(1)) {
            scenarioResult = scenarioResult.filter(sr => answers.includes(sr));
        }
        output += scenarioResult.length;
    }
    
    return output;
};

const result = (_: any, result: number) => {
    return `Total sum of answers is ${result}`;
};

const showInput = (input: string[][]) => {
    console.log(input);
};

const test = (_: string[][]) => {
    console.log("----Test-----");
};

export const solutionSix: Puzzle<string[][], number> = {
    day: 6,
    input: processInput,
    partOne,
    partTwo,
    resultOne: result,
    resultTwo: result,
    showInput,
    test,
}
