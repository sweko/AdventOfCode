import { readInputLines } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
  const input = await readInputLines(day);
  return input.map(line => line);
};

const partOne = (input: string[], debug: boolean) => {
  return 0;
};

const partTwo = (input: string[], debug: boolean) => {
  return 0;
};

const result = (_: any, result: number) => {
  return `Total number of occupied chairs is ${result}`;
};

const showInput = (input: string[]) => {
  console.log(input);
};

const test = (_: string[]) => {

};

export const solutionEighteen: Puzzle<string[], number> = {
  day: 18,
  input: processInput,
  partOne,
  partTwo,
  resultOne: result,
  resultTwo: result,
  showInput,
  test,
};
