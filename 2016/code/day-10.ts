import { readInput, readInputLines } from "../extra/aoc-helper";
import { isNumber } from "util";

import '../extra/array-helpers';

interface BotCommand {
    type: "bot",
    id: number;
    hibot: boolean;
    hivalue: number;
    lobot: boolean;
    lovalue: number;
}

interface ValueCommand {
    type: "value";
    value: number,
    bot: number
}

type Command = BotCommand | ValueCommand;

interface Bot {
    id: number,
    values: number[],
}

type State = { [key: number]: Bot }

async function main() {
    let lines = await readInputLines();
    const commands = lines.map(cmd => parseCommand(cmd));

    let comparerId = processPartOne(commands);
    console.log(`Part 1: value-61 is compared with value-17 by bot ${comparerId}`);

    let outputValue = processPartTwo(commands);
    console.log(`Part 2: outputs 0-2 result is ${outputValue}`);
}

function parseCommand(line: string) {
    const valueRegex = /^value (\d+) goes to bot (\d+)$/;
    const botRegex = /^bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)$/;

    let match: RegExpMatchArray;
    if (match = line.match(valueRegex)) {
        return <ValueCommand>{
            type: "value",
            value: parseInt(match[1]),
            bot: parseInt(match[2]),
        }
    };
    if (match = line.match(botRegex)) {
        return <BotCommand>{
            type: "bot",
            id: parseInt(match[1]),
            lobot: match[2] === "bot",
            lovalue: parseInt(match[3]),
            hibot: match[4] === "bot",
            hivalue: parseInt(match[5])
        };
    }
    throw Error(`invalid command ${line}`);
}

function processPartOne(commands: Command[]) {
    const botCommands: { [key: number]: BotCommand } = {};
    const state: State = {};

    commands.filter(c => c.type === "bot").forEach(c => {
        const bc = <BotCommand>c;
        botCommands[bc.id] = bc;
        state[bc.id] = { id: bc.id, values: [] }
    });

    commands.filter(c => c.type === "value").forEach(c => {
        const vc = <ValueCommand>c;
        state[vc.bot].values.push(vc.value);
    });

    while (true) {
        const activeBots = Object.keys(state).map(key => state[key]).filter(bot => bot.values.length > 1);
        if (activeBots.length === 0) {
            throw Error("ran out of bots");
        }
        const activeBot: Bot = activeBots[0];
        const hivalue = Math.max(...activeBot.values);
        const lovalue = Math.min(...activeBot.values);
        // console.log(activeBot);

        if ((hivalue == 61) && (lovalue == 17)) {
            return activeBot.id;
        }

        const botCommand = botCommands[activeBot.id];

        if (botCommand.hibot) {
            state[botCommand.hivalue].values.push(hivalue);
        }
        if (botCommand.lobot) {
            state[botCommand.lovalue].values.push(lovalue);
        }

        activeBot.values = [];
    }
}

function processPartTwo(commands: Command[]) {
    const botCommands: { [key: number]: BotCommand } = {};
    const state: State = {};
    const outputState: { [key: number]: number } = {};

    commands.filter(c => c.type === "bot").forEach(c => {
        const bc = <BotCommand>c;
        botCommands[bc.id] = bc;
        state[bc.id] = { id: bc.id, values: [] }
    });

    commands.filter(c => c.type === "value").forEach(c => {
        const vc = <ValueCommand>c;
        state[vc.bot].values.push(vc.value);
    });

    while (true) {
        const activeBots = Object.keys(state).map(key => state[key]).filter(bot => bot.values.length > 1);
        if (activeBots.length === 0) {
            throw Error("ran out of bots");
        }
        const activeBot: Bot = activeBots[0];
        const hivalue = Math.max(...activeBot.values);
        const lovalue = Math.min(...activeBot.values);
        // console.log(activeBot);

        const botCommand = botCommands[activeBot.id];

        if (botCommand.hibot) {
            state[botCommand.hivalue].values.push(hivalue);
        } else {
            outputState[botCommand.hivalue] = hivalue;
        }
        if (botCommand.lobot) {
            state[botCommand.lovalue].values.push(lovalue);
        } else {
            outputState[botCommand.lovalue] = lovalue;
        }

        activeBot.values = [];

        if (outputState[0] && outputState[1] && outputState[2]) {
            return outputState[0] * outputState[1] * outputState[2];
        }
    }
}

main();