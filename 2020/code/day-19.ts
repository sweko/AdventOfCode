import { readInputLines } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { toHash } from "../extra/hash-helpers";

interface TerminalRule {
  kind: 'terminal',
  index: number;
  terminal: string;
}

interface SubstitutionRule {
  kind: 'substitution',
  index: number;
  first: [number, number?];
  second?: [number, number?];
}

type Rule = TerminalRule | SubstitutionRule;

type RuleHash = {[key: number] : Rule};

type Input = {
  rules: RuleHash;
  tests: string[];
}

const processInput = async (day: number) => {
  const input = await readInputLines(day);
  const empty = input.findIndex(line => line === "");
  const ruleLines = input.slice(0, empty);
  const regex = /^(\d+): (?:"([a-z])"|(\d+)(?: (\d+))?(?: \| (\d+)(?: (\d+))?)?)/;
  const rules: Rule[] = ruleLines.map(line => {
    const match = line.match(regex);
    if (match[2]) {
      return {
        kind: 'terminal',
        index: +match[1],
        terminal: match[2]
      }
    }
    const result: SubstitutionRule = {
      kind: 'substitution',
      index: +match[1],
      first: [
        +match[3],
        match[4] ? +match[4] : null
      ]
    };
    if (match[5]) {
      result.second = [
        +match[5],
        match[6] ? +match[6] : null
      ]
    }
    return result;
  })
  const tests = input.slice(empty+1);
  const result: Input = { 
    rules: toHash(rules, rule => rule.index),
    tests
  };
  return result;
};

const getRuleChildren = (rule: Rule) => {
  if (rule.kind === "terminal") {
    return []
  }

  return [...rule.first, ...(rule.second || [])].filter(item => item);
}

const isRuleValid = (id: number, value: string, rules: RuleHash) : boolean => {
  const rule = rules[id];
  if (rule.kind === "terminal") {
    return value === rule.terminal;
  }
  
}

const partOne = ({rules, tests}: Input, debug: boolean) => {
  const ruleArray: Rule[] = Object.keys(rules).map(key => rules[key]);

  return 0;
};

const partTwo = (input: Input, debug: boolean) => {
  return 0;
};

const result = (_: any, result: number) => {
  return `Total sum of expression results is ${result}`;
};

const showInput = (input: Input) => {
  console.log(input);
};

const test = (_: Input) => {

};

export const solutionNineteen: Puzzle<Input, number> = {
  day: 19,
  input: processInput,
  partOne,
  partTwo,
  resultOne: result,
  resultTwo: result,
  showInput,
  test,
};
