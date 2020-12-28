import { readInputLines, readInput, debugLog } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Combat {
    first: number[];
    second: number[];
}

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    const result = {
        first: [],
        second: []
    };
    let side = "first";
    let skip = false;
    for (const line of input.slice(1)) {
        if (skip) {
            skip = false;
            continue;
        }
        if (line === "") {
            side = "second";
            skip = true;
            continue;
        }
        result[side].push(+line);
    }
    return result;
};

const partOne = (input: Combat, debug: boolean) => {

    const first = input.first.slice();
    const second = input.second.slice();
    let round = 1;
    const states = new Map<string, boolean>();
    while (first.length * second.length !== 0) {
        debugLog(debug, `-- Round ${round} --`);
        debugLog(debug, `Player 1's deck: ${first.join(", ")}`);
        debugLog(debug, `Player 2's deck: ${second.join(", ")}`);

        const key = `${first.join()}:${second.join()}`;
        if (states.get(key)) {
            debugLog(debug, `-- TIE DETECTED --`);
            break;
        }
        states.set(key, true);

        const fcard = first.shift();
        const scard = second.shift();
        debugLog(debug, `Player 1 plays: ${fcard}`);
        debugLog(debug, `Player 2 plays: ${scard}`);

        if (fcard > scard) {
            first.push(fcard, scard);
        } else {
            second.push(scard, fcard);
        }
        debugLog(debug, "");
        round -=- 1;
    }

    debugLog(debug, `PLAYER ${first.length ===  0 ? 2 : 1} wins`);
    
    const winner = first.length ===  0 ? second : first;

    debugLog(debug, `== Post-game results ==`)
    debugLog(debug, `Player 1's deck: ${first.join(", ")}`);
    debugLog(debug, `Player 2's deck: ${second.join(", ")}`);

    return winner.reduce((acc, item, index) => acc + item * (winner.length - index), 0);
};

let counter = 0;

const runGame = ({first, second}: Combat, gameId: number, debug: boolean) => {
    let round = 1;
    debugLog(debug, `=== Game ${gameId} ===`);
    
    const states = new Map<string, boolean>();
    while (first.length * second.length !== 0) {
        debugLog(debug, `-- Round ${round} (Game ${gameId}) --`);
        debugLog(debug, `Player 1's deck: ${first.join(", ")}`);
        debugLog(debug, `Player 2's deck: ${second.join(", ")}`);

        const key = `${first.join()}:${second.join()}`;
        if (states.get(key)) {
            debugLog(debug, `-- TIE DETECTED --`);
            break;
        }
        states.set(key, true);

        const fcard = first.shift();
        const scard = second.shift();
        debugLog(debug, `Player 1 plays: ${fcard}`);
        debugLog(debug, `Player 2 plays: ${scard}`);

        if (fcard > scard) {
            debugLog(debug, `Player 1 wins round ${round} of game ${gameId}!`);
            first.push(fcard, scard);
        } else {
            debugLog(debug, `Player 2 wins round ${round} of game ${gameId}!`);
            second.push(scard, fcard);
        }
        debugLog(debug, "");
        round -=- 1;
    }

    debugLog(debug, `PLAYER ${first.length ===  0 ? 2 : 1} wins`);
    
    const winner = first.length ===  0 ? second : first;

    debugLog(debug, `== Post-game results ==`)
    debugLog(debug, `Player 1's deck: ${first.join(", ")}`);
    debugLog(debug, `Player 2's deck: ${second.join(", ")}`);
}


const partTwo = (input: Combat, debug: boolean) => {
    runGame(input, ++counter, debug);

    return 0;
};

const resultOne = (_: any, result: number) => {
    return `The winning players score is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The period of the orbit is ${result}`;
};

const showInput = (input: Combat) => {
    console.log(input);
};

const test = (_: Combat) => {
    console.log("----Test-----");
};

export const solutionTwentyTwo: Puzzle<Combat, number> = {
    day: 22,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
