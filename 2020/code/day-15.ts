import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

type State = { [key: number]: number };

const processInput = async (day: number) => {
  return [1, 12, 0, 20, 8, 16];
};

const partOne = (input: number[], debug: boolean) => {
  return playGame(input, 2020, false);
};

const partTwo = (input: number[], debug: boolean) => {
  return playGame(input, 30_000_000, debug);
};

const result = (_: any, result: number) => {
  return `The current number is ${result}`;
};

const showInput = (input: number[]) => {
  console.log(input);
};

const test = (_: number[]) => {
  console.log(partOne([1, 3, 2], false) === 1);
  console.log(partOne([2, 1, 3], false) === 10);
  console.log(partOne([1, 2, 3], false) === 27);
  console.log(partOne([2, 3, 1], false) === 78);
  console.log(partOne([3, 2, 1], false) === 438);
  console.log(partOne([3, 1, 2], false) === 1836);
};

export const solutionFifteen: Puzzle<number[], number> = {
  day: 15,
  input: processInput,
  partOne,
  partTwo: partTwo,
  resultOne: result,
  resultTwo: result,
  showInput,
  test,
};

const playGame = playGameUInt;

function playGameMap(input: number[], target: number, debug: boolean = false) {
  let index = 1;
  let current: number;
  const state = new Map<number, number>();
  for (const item of input.slice(0, input.length - 1)) {
    state.set(item, index);
    current = item;
    index += 1;
  }
  current = input[input.length - 1];
  while (index < target) {

    if (debug) {
        if (index % 123457 === 0) {
            //const keys = Object.keys(state);
            //console.log(`Index: ${index}, Current: ${current}, Max: ${keys.max(k => +k)}, Keys: ${keys.length}`);
            console.log(`Index: ${index}, Current: ${current}`);
        }
    }
    const previous = state.get(current);
    const value = previous ? index - previous : 0;
    state.set(current, index);
    current = value;
    index += 1;
  }
  return current;
}

function playGameObject(input: number[], target: number, debug: boolean = false) {
  let index = 1;
  let current: number;
  const state: State = {};
  for (const item of input.slice(0, input.length - 1)) {
    state[item] = index;
    current = item;
    index += 1;
  }
  current = input[input.length - 1];
  while (index < target) {

    if (debug) {
        if (index % 123457 === 0) {
            //const keys = Object.keys(state);
            //console.log(`Index: ${index}, Current: ${current}, Max: ${keys.max(k => +k)}, Keys: ${keys.length}`);
            console.log(`Index: ${index}, Current: ${current}`);
        }
    }
    const previous = state[current];
    const value = previous ? index - previous : 0;
    state[current] = index;
    current = value;
    index += 1;
  }
  return current;
}

function playGameUInt(input: number[], target: number, debug: boolean = false) {
  let index = 1;
  let current: number;
  const state: Uint32Array = new Uint32Array(target);
  for (const item of input.slice(0, input.length - 1)) {
    state[item] = index;
    current = item;
    index += 1;
  }
  current = input[input.length - 1];
  while (index < target) {

    if (debug) {
        if (index % 1234567 === 0) {
            //const keys = Object.keys(state);
            //console.log(`Index: ${index}, Current: ${current}, Max: ${keys.max(k => +k)}, Keys: ${keys.length}`);
            console.log(`Index: ${index}, Current: ${current}`);
        }
    }
    const previous = state[current];
    const value = previous ? index - previous : 0;
    state[current] = index;
    current = value;
    index += 1;
  }
  return current;
}