import { readInputLines } from "../extra/aoc-helper";
import { performance } from "perf_hooks";
import "../extra/array-helpers";

interface Step {
    name: string;
    conditions: string[];
}

interface Event {
    step: string;
    start: number;
    end: number;
    completed: boolean;
}

async function main() {
    const lines = await readInputLines();

    const startInput = performance.now();
    const rules = lines.map(line => {
        const match = line.match(/^Step ([A-Z]) must be finished before step ([A-Z]) can begin.$/);
        return {
            step: match[2],
            condition: match[1]
        };
    })

    const endInput = performance.now();
    console.log(`Running time for input is ${Math.round(endInput - startInput)}ms`);

    const startOne = performance.now();
    let steps = getSteps(rules);
    let stepOrder = processPartOne(steps);
    const endOne = performance.now();

    console.log(`Part 1: correct step order is ${stepOrder.join("")}`);
    console.log(`Running time for part 1 is ${Math.round(endOne - startOne)}ms`);

    const startTwo = performance.now();
    steps = getSteps(rules);
    let runningTime = processPartTwo(steps, 5, 60);
    const endTwo = performance.now();

    console.log(`Part 2: assembly running time is ${runningTime}`);
    console.log(`Running time for part 2 is ${Math.round(endTwo - startTwo)}ms`);
}

function getSteps(rules: { step: string; condition: string; }[]) {
    const steps = Array.from(rules.reduce((acc, rule) => {
        acc.add(rule.step);
        acc.add(rule.condition);
        return acc;
    }, new Set())).map(step => ({
        name: step,
        conditions: rules.filter(rule => rule.step === step).map(rule => rule.condition)
    }));
    return steps;
}

function processPartOne(steps: Step[]): string[] {
    const result = [];

    while (steps.length !== 0) {
        const nextStep = steps
            .filter(step => step.conditions.length === 0)
            .reduce((min, step) => min < step.name ? min : step.name, "Z");
        result.push(nextStep);

        for (const step of steps) {
            step.conditions = step.conditions.filter(cond => cond !== nextStep);
        }

        steps.splice(steps.findIndex(step => step.name === nextStep), 1);
    }

    return result;
}

function getStepValue(stepName: string) {
    return stepName.charCodeAt(0) - "A".charCodeAt(0) + 1;
}

function processPartTwo(steps: Step[], workers: number, offset: number): number {

    const events: Event[] = [];
    let available = workers;
    let secondsPassed = 0;

    while (steps.length !== 0) {
        const finished = events.filter(event => event.end === secondsPassed && !event.completed);
        for (const event of finished) {
            for (const step of steps) {
                step.conditions = step.conditions.filter(cond => cond !== event.step);
            }

            steps.splice(steps.findIndex(step => step.name === event.step), 1);
            event.completed = true;
            available +=1;
        }

        if (steps.length === 0) {
            return secondsPassed;
        }

        const nextSteps = steps
            .filter(step => step.conditions.length === 0)
            .filter(step => !events.filter(ev => !ev.completed).map(ev => ev.step).includes(step.name))
            .sort((a, b) => a.name.localeCompare(b.name))
            .slice(0, available)
            .map(step => step.name);

        events.push(...nextSteps.map(step => ({
            step: step,
            start: secondsPassed,
            end: secondsPassed + offset + getStepValue(step),
            completed: false,
        })));

        available -= nextSteps.length;

        secondsPassed = events.reduce((min, event) => (!event.completed && min > event.end) ? event.end : min, Number.POSITIVE_INFINITY);
    }

    return secondsPassed;
}

main();