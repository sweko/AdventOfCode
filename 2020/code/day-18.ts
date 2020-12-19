import { readInputLines } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
  const input = await readInputLines(day);
  return input;
};

const calculate = (expression: string): number => {
  const tokens = expression.replace("(", "").replace(")", "").split(" ");
  let index = 1;
  let current = +tokens[0];
  while (index < tokens.length) {
    const op = tokens[index];
    const arg = +tokens[index+1];
    if (op === "+") {
      current += arg;
    } else {
      current *= arg;
    }
    index +=2;
  }

  return current;
}

const evaluate = (expression: string): number => {
  const regex = /\((\d+ (\+|\*) )+\d+\)/;
  let match = expression.match(regex);
  while (match) {
    const expr = match[0];
    const value = calculate(expr);
    expression = expression.replace(expr, value.toString());
    match = expression.match(regex);
  }
  const result = calculate(expression)
  //console.log(result);
  return result;
}

const partOne = (input: string[], debug: boolean) => {
  return input.map(expression => evaluate(expression)).sum();
};

const calculate2 = (expression: string): number => {
  const tokens = expression.replace("(", "").replace(")", "").split(" ");
  // process + first
  let plus = tokens.indexOf("+");
  while (plus !== -1) {
    const first = +tokens[plus-1];
    const second = +tokens[plus+1];
    const result = first + second;
    tokens.splice(plus-1, 3, result.toString());
    plus = tokens.indexOf("+");
  }

  // now process *
  let index = 1;
  let current = +tokens[0];
  while (index < tokens.length) {
    const arg = +tokens[index+1];
    current *= arg;
    index +=2;
  }

  return current;
}

const evaluate2 = (expression: string): number => {
  const regex = /\((\d+ (\+|\*) )+\d+\)/;
  let match = expression.match(regex);
  while (match) {
    const expr = match[0];
    const value = calculate2(expr);
    expression = expression.replace(expr, value.toString());
    match = expression.match(regex);
  }
  const result = calculate2(expression)
  //console.log(result);
  return result;
}

const partTwo = (input: string[], debug: boolean) => {
  return input.map(expression => evaluate2(expression)).sum();
};

const result = (_: any, result: number) => {
  return `Total sum of expression results is ${result}`;
};

const showInput = (input: string[]) => {
  console.log(input);
};

const test = (_: string[]) => {
  console.log(calculate2("1 + 2 * 3"));
  console.log(calculate2("4 * 2 + 3"));
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
