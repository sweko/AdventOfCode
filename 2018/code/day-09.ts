import { readInput } from "../extra/aoc-helper";
import { performance } from "perf_hooks";
import "../extra/array-helpers";

interface Node {
    value: number;
    prev: Node;
    next: Node;
}

async function main() {
    const startInput = performance.now();

    // const [players, marbles] = [9, 25];
    // const [players, marbles] = [10, 1618]; // points: high score is 8317            Y
    // const [players, marbles] = [13, 7999]; // points: high score is 146373
    // const [players, marbles] = [17, 1104]; // points: high score is 2764
    // const [players, marbles] = [21, 6111]; // points: high score is 54718
    // const [players, marbles] = [30, 5807]; // points: high score is 37305
    const [players, marbles] = [446, 71522]

    const endInput = performance.now();
    console.log(`Running time for input is ${Math.round(endInput - startInput)}ms`);

    const startOne = performance.now();
    let highScore = processPartOne(players, marbles);
    const endOne = performance.now();

    console.log(`Part 1: high score for ${players} players, ${marbles} marbles is ${highScore}`);
    console.log(`Running time for part 1 is ${Math.round(endOne - startOne)}ms`);

    const startTwo = performance.now();
    highScore = processPartTwo(players, marbles);
    const endTwo = performance.now();

    console.log(`Part 2: high score for ${players} players, ${marbles} marbles is ${highScore}`);
    console.log(`Running time for part 2 is ${Math.round(endTwo - startTwo)}ms`);
}

function getIndex<T>(array: T[], index: number) {
    if (index >= 0 && index < array.length) {
        return index;
    }
    if (index < 0) {
        index += array.length;
    }
    return index % array.length;
}

function playMarbleGameArray(players: number, marbles: number): number {
    const field = [0];
    let currentIndex = 0;
    let currentPlayer = 0;
    const scores = Array(players).fill(0);

    for (let marble = 1; marble <= marbles; marble++) {
        currentPlayer = (currentPlayer + 1) % players;
        if (marble % 23 === 0) {
            currentIndex = getIndex(field, currentIndex - 7);
            scores[currentPlayer] += marble + field[currentIndex];
            field.splice(currentIndex, 1);
        } else {
            currentIndex = getIndex(field, currentIndex + 2);
            field.splice(currentIndex, 0, marble);
        }
    }
    return scores.max();
}

function playMarbleGame(players: number, marbles: number) {
    let currentMarble: Node = { value: 0, prev: null, next: null };
    currentMarble.prev = currentMarble;
    currentMarble.next = currentMarble;
    let currentPlayer = 0;
    const scores = Array(players).fill(0);
    for (let marble = 1; marble <= marbles; marble++) {
        currentPlayer = (currentPlayer + 1) % players;
        if (marble % 23 === 0) {
            for (let index = 0; index < 7; index++) {
                currentMarble = currentMarble.prev;
            }
            scores[currentPlayer] += marble + currentMarble.value;
            currentMarble.next.prev = currentMarble.prev;
            currentMarble.prev.next = currentMarble.next;
            currentMarble = currentMarble.next;
        }
        else {
            currentMarble = currentMarble.next;
            const nextMarble = currentMarble.next;
            let newMarble = { value: marble, prev: currentMarble, next: nextMarble };
            currentMarble.next = newMarble;
            nextMarble.prev = newMarble;
            currentMarble = newMarble;
        }
    }
    return scores.max();
}

function processPartOne(players: number, marbles: number): number {
    return playMarbleGame(players, marbles);
}

function processPartTwo(players: number, marbles: number): number {
    return playMarbleGame(players, marbles * 100);
}

main();