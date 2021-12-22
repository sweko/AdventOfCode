import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Command {
    action: "on" | "off";
    x: { from: number, to: number };
    y: { from: number, to: number };
    z: { from: number, to: number };
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const rx =/^(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)$/;
    const result = lines.map(line => {
        const match = line.match(rx);
        if (!match) {
            throw new Error(`Invalid line: ${line}`);
        }
        const [, action, xFrom, xTo, yFrom, yTo, zFrom, zTo] = match;
        return {
            action,
            x: { from: parseInt(xFrom, 10), to: parseInt(xTo, 10) },
            y: { from: parseInt(yFrom, 10), to: parseInt(yTo, 10) },
            z: { from: parseInt(zFrom, 10), to: parseInt(zTo, 10) }
        } as Command;
    });
    return result;
};

const partOne = (input: Command[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const low = -50;
    const high = 100;
    const translated = input.map(command => ({
        action: command.action,
        x: { from: command.x.from - low, to: command.x.to - low },
        y: { from: command.y.from - low, to: command.y.to - low },
        z: { from: command.z.from - low, to: command.z.to - low }
    })).filter(command => {
        // assumes no big cuboids contain the origin (verified by input)
        if (command.x.from < 0) {
            return false;
        }
        if (command.y.from < 0) {
            return false;
        }
        if (command.z.from < 0) {
            return false;
        }
        if (command.x.to > high) {
            return false;
        }
        if (command.y.to > high) {
            return false;
        }
        if (command.z.to > high) {
            return false;
        }
        return true;
    });

    const reactor: number[][][] = new Array(high+1).fill(0)
        .map(_ => new Array(high+1).fill(0)
        .map(_ => new Array(high+1).fill(0)));



    for (const command of translated) {
        for (let x = command.x.from; x <= command.x.to; x++) {
            for (let y = command.y.from; y <= command.y.to; y++) {
                for (let z = command.z.from; z <= command.z.to; z++) {
                    if (command.action === "on") {
                        reactor[x][y][z] = 1;
                    } else {
                        reactor[x][y][z] = 0;
                    }
                }
            }
        }
    }

    const ons = reactor.sum(x => x.sum(y => y.sum()));
    return ons;
};

const partTwo = (input: Command[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    return 0;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Command[]) => {
    console.log(input);
};

const test = (_: Command[]) => {
    console.log("----Test-----");
};

export const solutionTwentyTwo: Puzzle<Command[], number> = {
    day: 22,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
