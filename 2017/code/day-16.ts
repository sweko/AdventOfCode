import { readInput, readInputLines } from "../extra/aoc-helper";
import { isNumber } from "util";

import '../extra/group-by';

interface SpinCommand {
    type: "spin";
    rotation: number;
}

interface ExchangeCommand {
    type: "exchange";
    first: number;
    second: number;
}

interface PartnerCommand {
    type: "partner";
    first: string;
    second: string;
}


type Command = SpinCommand | ExchangeCommand | PartnerCommand;

class Machine {
    state: string[] = "abcdefghijklmnop".split("");
    ip: number = 0;

    constructor(private commands: Command[]) { }

    debug: boolean;

    runSpin(rotation: number) {
        this.state = [...this.state.slice(-rotation), ...this.state.slice(0, -rotation)];
    }

    runExchange(first: number, second: number) {
        const temp = this.state[first];
        this.state[first] = this.state[second];
        this.state[second] = temp;
    }

    runPartner(first: string, second: string) {
        const findex = this.state.indexOf(first);
        const sindex = this.state.indexOf(second);
        this.runExchange(findex, sindex);
    }


    runProgram() {
        this.ip = 0;
        while (this.ip < this.commands.length) {
            const command = this.commands[this.ip];
            if (command.type === "spin") {
                this.runSpin(command.rotation);
            } else if (command.type === "exchange") {
                this.runExchange(command.first, command.second);
            } else if (command.type === "partner") {
                this.runPartner(command.first, command.second);
            }
            this.ip += 1;
        }
    }

    print() {
        Object.keys(`state: ${this.state}`);
        console.log(`ip: ${this.ip}`);
    }
}


async function main() {
    let lines = (await readInput()).split(",");
    const commands = lines.map(cmd => parseCommand(cmd));

    let finalPosition = processPartOne(commands);
    console.log(`Part 1: final dance position is ${finalPosition}`);

    let outputValue = processPartTwo(commands);
    console.log(`Part 2: outputs 0-2 result is ${outputValue}`);
}

function parseCommand(line: string) {
    const partnerRegex = /^p(\w)\/(\w)$/;
    const spinRegex = /^s(\d+)$/;
    const xcngRegex = /^x(\d+)\/(\d+)$/;

    let match: RegExpMatchArray;
    if (match = line.match(partnerRegex)) {
        return <PartnerCommand>{
            type: "partner",
            first: match[1],
            second: match[2]
        }
    };
    if (match = line.match(spinRegex)) {
        return <SpinCommand>{
            type: "spin",
            rotation: parseInt(match[1])
        };
    }
    if (match = line.match(xcngRegex)) {
        return <ExchangeCommand>{
            type: "exchange",
            first: parseInt(match[1]),
            second: parseInt(match[2])
        }
    };
    throw Error(`invalid command ${line}`);
}

function processPartOne(commands: Command[]) {
    const machine = new Machine(commands);
    machine.runProgram();
    machine.runProgram();
    return machine.state.join("");
}

function processPartTwo(commands: Command[]) {
    const machine = new Machine(commands);
    const cache = {};
    let index = 1;
    // find length of cycle
    while (true) {
        machine.runProgram();
        const state = machine.state.join("");
        if (cache[state]) {
            break;
        }
        cache[state] = index;
        index++;
    }

    console.log(cache);
    return index;
}

main();