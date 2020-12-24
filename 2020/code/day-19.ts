import { readInputLines } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { toHash } from "../extra/hash-helpers";

interface TerminalRule {
  kind: 'terminal',
  index: number;
  terminal: string;
  regex: string;
}

interface SubstitutionRule {
  kind: 'substitution',
  index: number;
  first: [number, number?];
  second?: [number, number?];
  regex: string;
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
        terminal: match[2],
        regex: match[2],
      }
    }
    const result: SubstitutionRule = {
      kind: 'substitution',
      index: +match[1],
      first: [
        +match[3],
        match[4] ? +match[4] : null
      ],
      regex: null
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

const getRegex = (rule: SubstitutionRule, rules: RuleHash): string => {
  const firstOne = rules[rule.first[0]].regex;
  if (firstOne === null) {
    return null;
  }
  const firstTwo = rules[rule.first[1]]?.regex;
  if (firstTwo === null) {
    return null;
  }

  const secondOne = rules[rule.second ? rule.second[0]: undefined]?.regex;
  if (secondOne === null) {
    return null;
  }
  const secondTwo = rules[rule.second ? rule.second[1]: undefined]?.regex;
  if (secondTwo === null) {
    return null;
  }

  const fregex = firstTwo ? `${firstOne}${firstTwo}` : firstOne;
  const sregex = secondOne ? (secondTwo ? `${secondOne}${secondTwo}` : secondOne) : "";
  const regex = sregex ? `(${fregex}|${sregex})` : fregex;
  console.log(`Setting regex for rule #${rule.index} to ${regex}`);
  return regex;
}

const partOne = ({rules, tests}: Input, debug: boolean) => {
  const ruleArray: Rule[] = Object.keys(rules).map(key => rules[key]);

  let rest = ruleArray.filter(rule => !rule.regex) as SubstitutionRule[];
  while (rest.length) {
    for (const rule of rest) {
      rule.regex = getRegex(rule, rules);
    }
    rest = ruleArray.filter(rule => !rule.regex) as SubstitutionRule[];
  }

  const zero = rules[0];
  const regex = new RegExp(`^${zero.regex}$`);

  const result = tests.filter(test => regex.test(test)).length;

  return result;
};

const partTwo = ({rules, tests}: Input, debug: boolean) => {

  const ruleArray: Rule[] = Object.keys(rules).map(key => rules[key]);
  // assume all the rules got their regex at part I
  rules[8].regex = `(${rules[8].regex})+`

  const eleven = rules[11] as SubstitutionRule;
  const one = rules[eleven.first[0]].regex;
  const two = rules[eleven.first[1]].regex;
  eleven.regex = `((${one}${two})|(${one}{2}${two}{2})|(${one}{3}${two}{3})|(${one}{4}${two}{4})|(${one}{5}${two}{5})|(${one}{6}${two}{6}))`;

  const zero = rules[0] as SubstitutionRule;
  zero.regex = getRegex(zero, rules);
  const regex = new RegExp(`^${zero.regex}$`);

  const result = tests.filter(test => regex.test(test)).length;

  return result;
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
