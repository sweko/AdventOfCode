import { readInput, readInputLines } from "../extra/aoc-helper";

const left = "left";
const right = "right";

interface StateAction {
    output: 0 | 1;
    direction: "left" | "right";
    next: string;
}

interface State {
    name: string;
    zero: StateAction;
    one: StateAction
}

type States = { [key: string]: State };

class TuringMachine {
    cursor: number = 0;
    values: { [key: number]: 1 } = {}

    constructor(public states: States, public stateIndex: string = "A") {

    }

    run() {
        const state = this.states[this.stateIndex];
        const value = this.values[this.cursor];
        const action = value ? state.one : state.zero;

        if (action.output) {
            this.values[this.cursor] = 1;
        } else {
            delete this.values[this.cursor];
        }

        if (action.direction === left) {
            this.cursor -= 1;
        } else {
            this.cursor += 1;
        }
        this.stateIndex = action.next;
    }

    print() {
        console.log(`cursor is at ${this.cursor}`);
        console.log(`values set are ${Object.keys(this.values)}`);
        console.log(`stateIndex is at ${this.stateIndex}`);
        console.log("----------");
    }

    getChecksum() {
        return Object.keys(this.values).length;
    }
}

async function main() {
    let lines = await readInputLines();

    const [states, limit, stateIndex] = parseInput(lines);

    const machine = new TuringMachine(states, stateIndex);
    for (let i = 0; i < limit; i += 1) {
        machine.run();
    }
    console.log(`Final checksum is ${machine.getChecksum()}`);
}

function parseInput(lines: string[]): [States, number, string] {
    const startStateRegex = /^Begin in state (\w).$/;
    let match;
    if (!(match = lines[0].match(startStateRegex))) {
        throw Error(`cannot match start state from ${lines[0]}`);
    }
    const startState: string = match[1];

    const limitRegex = /^Perform a diagnostic checksum after (\d+) steps.$/;
    if (!(match = lines[1].match(limitRegex))) {
        throw Error(`cannot match checksum limit from ${lines[1]}`);
    }
    const limit = parseInt(match[1]);

    lines = lines.slice(2).filter(line => line);
    const states: States = {};
    while (lines.length !== 0) {
        let stateLines = lines.slice(0, 9);
        let state = parseState(stateLines);
        //console.log(state);
        states[state.name] = state;
        lines = lines.slice(9);
    }

    return [states, limit, startState];
}

function parseState(lines: string[]): State {
    const nameRegex = /^In state (\w):$/;
    const valueRegex = /^\s+If the current value is (0|1):$/
    const outputRegex = /^\s+-\sWrite the value (0|1)\.$/;
    const directionRegex = /^\s+-\sMove one slot to the (left|right)\.$/;
    const nextRegex = /^\s+-\sContinue with state (\w)\.$/

    let match;
    if (!(match = lines[0].match(nameRegex))) {
        throw Error(`cannot match state name from ${lines[0]}`);
    }
    const state: State = {
        name: match[1],
        zero: {
            output: null,
            direction: null,
            next: null
        },
        one: {
            output: null,
            direction: null,
            next: null
        },
    };

    lines = lines.slice(1);
    while (lines.length != 0) {
        if (!(match = lines[0].match(valueRegex))) {
            throw Error(`cannot match value statement from ${lines[0]}`);
        }
        let value = parseInt(match[1]);
        let action = value ? state.one : state.zero;

        if (!(match = lines[1].match(outputRegex))) {
            throw Error(`cannot match output statement from ${lines[1]}`);
        }
        action.output = <0 | 1>parseInt(match[1]);

        if (!(match = lines[2].match(directionRegex))) {
            throw Error(`cannot match direction statement from ${lines[2]}`);
        }
        action.direction = match[1];

        if (!(match = lines[3].match(nextRegex))) {
            throw Error(`cannot match next statement from ${lines[3]}`);
        }
        action.next = match[1];

        lines = lines.slice(4);
    }

    return state;
}

main();