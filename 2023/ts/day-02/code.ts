// Solution for day 2 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

interface Game {
    id: number;
    balls: Ballsack[];
}

interface Ballsack {
    red: number;
    green: number;
    blue: number;
}

const getEmpty = (): Ballsack => {
    return {
        red: 0,
        green: 0,
        blue: 0
    }
}

const lineToGame = (line: string): Game => {
    const matcher = /Game (\d+): (.*)/;
    const matches = line.match(matcher);
    if (!matches) {
        throw new Error("Failed");
    }
    const id = +matches[1];
    const ballsacks = matches[2].split("; ");
    const result: Ballsack[] = [];
    for (const ballsack of ballsacks) {
        const element = getEmpty();;
        const balls = ballsack.split(", ");
        for (const ball of balls) {
            const [count, kind] = ball.split(" ");
            //@ts-ignore
            element[kind] = +count;
        }
        result.push(element);
    }
    return {
        id,
        balls: result
    }
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const games = lines.map(lineToGame)
    return games;
};

const compareBallsacks = (gameSack: Ballsack, maxSack: Ballsack) => {
    if (gameSack.red > maxSack.red) {
        return false;
    }
    if (gameSack.green > maxSack.green) {
        return false;
    }
    if (gameSack.blue > maxSack.blue) {
        return false;
    }
    return true;
}

const partOne = (input: Game[], debug: boolean) => {
    const maxBallsack = {
        red: 12,
        green: 13,
        blue: 14
    }
    const validGames = input.filter(game => game.balls.every(bs => compareBallsacks(bs, maxBallsack)));

    return validGames.sum(game => game.id);
};

const partTwo = (input: Game[], debug: boolean) => {
    const mins = input.map(game => ({
        id: game.id,
        minBallsack: game.balls.reduce((acc, bs) => {
            if (acc.red < bs.red) {
                acc.red = bs.red;
            }
            if (acc.green < bs.green) {
                acc.green = bs.green;
            }
            if (acc.blue < bs.blue) {
                acc.blue = bs.blue;
            }
            return acc;
        }, getEmpty())
    }));

    const powers = mins.map(({minBallsack: bs}) => bs.red * bs.green * bs.blue);
    return powers.sum();
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Game[]) => {
    console.log(input);
};

const test = (_: Game[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Game[], number> = {
    day: 2,
    input: () => processInput(2),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}