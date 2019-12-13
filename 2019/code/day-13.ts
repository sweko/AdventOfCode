import { readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { printMatrix } from "../extra/terminal-helper";
import { IntcodeSimulator } from "../extra/intcode-simulator";

const processInput = async (day: number) => {
    const input = await readInput(day);
    const numbers = input.split(",").map(c => parseInt(c, 10));
    return numbers;
};

interface TileData {
    x: number;
    y: number;
    tileId: number;
}

type GameBoard = { [key: string]: TileData };

const showBoard = (gameBoard: GameBoard) => {
    console.clear();
    const tiles = Object.values(gameBoard);
    const maxx = tiles.max(tile => tile.x);
    const maxy = tiles.max(tile => tile.y);
    const board = Array(maxy + 1).fill(0).map(_ => Array(maxx + 1).fill(0));

    for (const tile of tiles) {
        board[tile.y][tile.x] = tile.tileId;
    }

    printMatrix(board, (tileId) => {
        return (tileId === 0) ? " "
            : (tileId === 1) ? "#"
                : (tileId === 2) ? "+"
                    : (tileId === 3) ? "_"
                        : (tileId === 4) ? "o" : "x";
    });
}

const partOne = (instructions: number[], debug: boolean) => {
    const simulation = new IntcodeSimulator(instructions.slice(0), []);
    let outputs = [];
    const gameBoard: GameBoard = {};
    simulation.output = (value) => {
        outputs.push(value);
        if (outputs.length === 3) {
            const [x, y, tileId] = outputs;
            gameBoard[`${x}:${y}`] = { x, y, tileId };
            outputs = [];
        }
    };
    simulation.run();
    if (debug) {
        showBoard(gameBoard);
    }
    return Object.values(gameBoard).filter(tile => tile.tileId === 2).length;
};

const partTwo = (instructions: number[], debug: boolean) => {
    const i2 = instructions.slice(0);
    i2[0] = 2;
    const input = [];
    const simulation = new IntcodeSimulator(i2, input);
    let outputs = [];
    let ball: TileData;
    let paddle: TileData;
    let score: TileData;
    simulation.output = (value) => {
        outputs.push(value);
        if (outputs.length === 3) {
            const [x, y, tileId] = outputs;
            if (tileId === 3) {
                paddle = { x, y, tileId };
            } else if (tileId === 4) {
                ball = { x, y, tileId };
            } else if (x === -1 && y === 0) {
                score = { x, y, tileId };
            }
            outputs = [];
        }
    };

    simulation.run();
    while (simulation.getState() === "suspended") {

        if (debug) {
            console.log("Ball  : ", ball);
            console.log("Paddle: ", paddle);
            console.log("Score : ", score);
        }

        if (ball.x > paddle.x) {
            input.push(1);
        } else if (ball.x < paddle.x) {
            input.push(-1);
        } else {
            input.push(0);
        }

        simulation.resume();
        simulation.run();
    }
    return score.tileId;
};

const partTwoWithBoard = (instructions: number[], debug: boolean) => {
    const i2 = instructions.slice(0);
    i2[0] = 2;
    const input = [];
    const simulation = new IntcodeSimulator(i2, input);
    let outputs = [];
    const gameBoard: GameBoard = {};
    simulation.output = (value) => {
        outputs.push(value);
        if (outputs.length === 3) {
            const [x, y, tileId] = outputs;
            gameBoard[`${x}:${y}`] = { x, y, tileId };
            outputs = [];
        }
    };

    simulation.run();
    while (simulation.getState() === "suspended") {
        const tiles = Object.values(gameBoard);

        const ball = tiles.find(tile => tile.tileId === 4);
        const paddle = tiles.find(tile => tile.tileId === 3);
        const score = gameBoard["-1:0"];

        if (debug) {
            showBoard(gameBoard);
            console.log(simulation.getState());
            console.log("Ball  : ", ball);
            console.log("Paddle: ", paddle);
            console.log("Score : ", score);
        }

        if (ball.x > paddle.x) {
            input.push(1);
        } else if (ball.x < paddle.x) {
            input.push(-1);
        } else {
            input.push(0);
        }

        simulation.resume();
        simulation.run();
    }
    const score = gameBoard["-1:0"];
    return score.tileId;
};

const resultOne = (_: any, result: number) => {
    return `Total number of blocks is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Total score is ${result}`;
};

const showInput = (input: number[]) => {
    console.log(input);
};

const test = (input: number[]) => {
    const src = "104,1125899906842624,99";
    const simulator = new IntcodeSimulator(src.split(",").map(c => parseInt(c, 10)), []);
    simulator.run();
};

export const solution13: Puzzle<number[], number> = {
    day: 13,
    input: processInput,
    partOne,
    partTwo: partTwoWithBoard,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
