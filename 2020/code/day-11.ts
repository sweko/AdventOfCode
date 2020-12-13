import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { printMatrix } from "../extra/terminal-helper";
import { Puzzle } from "./model";

type State = "occupied" | "empty" | "floor";

type Lounge = State[][];

const printMap = {
    "occupied": "#",
    "empty": "L",
    "floor": "."
}

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    return input.map(line => line.split("").map(char => char === "L" ? "empty": "floor"));
};

const getUnitStateOne = (state: Lounge, x: number, y: number) : State => {

    if (state[x][y] === "floor") {
        return "floor";
    }

    let neightbours = 0;
    if (state[x][y-1] === "occupied") neightbours +=1;
    if (state[x][y+1] === "occupied") neightbours +=1;

    if (state[x-1]) {
        if (state[x-1][y-1] === "occupied") neightbours +=1;
        if (state[x-1][y] === "occupied") neightbours +=1;
        if (state[x-1][y+1] === "occupied") neightbours +=1;
    }

    if (state[x+1]) {
        if (state[x+1][y-1] === "occupied") neightbours +=1;
        if (state[x+1][y] === "occupied") neightbours +=1;
        if (state[x+1][y+1] === "occupied") neightbours +=1;
    }

    if ((state[x][y] === "empty") && (neightbours === 0)) {
        return "occupied";
    }

    if ((state[x][y] === "occupied") && (neightbours >= 4)) {
        return "empty";
    }

    return state[x][y];
}

const getNextStateOne = (state: Lounge): Lounge => state.map((row, x) => row.map((_, y) => getUnitStateOne(state, x, y)));

const getChecksum = (state: Lounge): string => state.map(row => row.map(cell => printMap[cell]).join("")).join("");

const partOne = (input: Lounge, debug: boolean) => {

    let checksum = getChecksum(input);
    const previous = [];
    let state = input.map(row => row.slice());

    do {
        previous.push(checksum);
        state = getNextStateOne(state);
        checksum = getChecksum(state);
    } while (!previous.includes(checksum));

    return state.sum(row => row.filter(cell => cell === "occupied").length);
};

const getUnitStateTwo = (state: Lounge, x: number, y: number) : State => {

    if (state[x][y] === "floor") {
        return "floor";
    }

    let neightbours = 0;

    let xn = x, yn = y-1;
    while(state[xn][yn] === "floor") {
        yn -=1;
    }
    if (state[xn][yn] === "occupied") neightbours +=1;

    xn = x, yn = y+1;
    while(state[xn][yn] === "floor") {
        yn +=1;
    }
    if (state[xn][yn] === "occupied") neightbours +=1;

    xn = x-1; yn = y-1;
    while(state[xn] && state[xn][yn] === "floor") {
        xn -= 1;
        yn -= 1;
    }
    if (state[xn] && state[xn][yn] === "occupied") neightbours +=1;

    xn = x-1; yn = y;
    while(state[xn] && state[xn][yn] === "floor") {
        xn -= 1;
    }
    if (state[xn] && state[xn][yn] === "occupied") neightbours +=1;

    xn = x-1; yn = y+1;
    while(state[xn] && state[xn][yn] === "floor") {
        xn -= 1;
        yn += 1;
    }
    if (state[xn] && state[xn][yn] === "occupied") neightbours +=1;

    xn = x+1; yn = y-1;
    while(state[xn] && state[xn][yn] === "floor") {
        xn += 1;
        yn -= 1;
    }
    if (state[xn] && state[xn][yn] === "occupied") neightbours +=1;

    xn = x+1; yn = y;
    while(state[xn] && state[xn][yn] === "floor") {
        xn += 1;
    }
    if (state[xn] && state[xn][yn] === "occupied") neightbours +=1;

    xn = x+1; yn = y+1;
    while(state[xn] && state[xn][yn] === "floor") {
        xn += 1;
        yn += 1;
    }
    if (state[xn] && state[xn][yn] === "occupied") neightbours +=1;

    if ((state[x][y] === "empty") && (neightbours === 0)) {
        return "occupied";
    }

    if ((state[x][y] === "occupied") && (neightbours >= 5)) {
        return "empty";
    }

    return state[x][y];
}

const getNextStateTwo = (state: Lounge): Lounge => state.map((row, x) => row.map((_, y) => getUnitStateTwo(state, x, y)));


const partTwo = (input: Lounge, debug: boolean) => {
    let checksum = getChecksum(input);
    const previous = [];
    let state = input.map(row => row.slice());

    do {
        previous.push(checksum);
        state = getNextStateTwo(state);
        checksum = getChecksum(state);
    } while (!previous.includes(checksum));

    return state.sum(row => row.filter(cell => cell === "occupied").length);
};

const result = (_: any, result: number) => {
    return `Total number of occupied chairs is ${result}`;
};

const showInput = (input: Lounge) => {
    console.log(input);
};

const test = (_: Lounge) => {
    console.log("----Test-----");
};

export const solutionEleven: Puzzle<Lounge, number> = {
    day: 11,
    input: processInput,
    partOne,
    partTwo,
    resultOne: result,
    resultTwo: result,
    showInput,
    test,
}
