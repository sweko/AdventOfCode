import { readInputLines, readInput, debugLog } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface BingoGame {
    numbers: number[];
    tickets: BingoTicket[];
}

class BingoTicket {

    public hits: number[] = [];
    public won: boolean = false;

    constructor(public numbers: number[][]) {
        this.numbers = numbers;
    }

    hasNumber(number: number) {
        return this.numbers.some(row => row.includes(number));
    }

    getRemaining() {
        return this.numbers.flat().filter(n => !this.hits.includes(n));
    }

    isWinner() {
        if (this.won) {
            return true;
        }

        if (this.numbers.some(row => row.every(n => this.hits.includes(n)))) {
            return true;
        }

        for (let cindex = 0; cindex < 5; cindex++) {
            const column = this.numbers.map(row => row[cindex]);
            if (column.every(n => this.hits.includes(n))) {
                return true;
            }
        }

        return false;
    }

    reset() {
        this.hits = [];
    }

};

const processInput = async (day: number) => {
    let lines = await readInputLines(day);
    const numbers = lines[0].split(",").map(n => parseInt(n, 10));
    lines = lines.slice(1);
    const regex = /^\s?(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)$/;
    const tickets: BingoTicket[] = [];
    while (lines.length > 0) {
        const ticket: number[][] = [];
        for (let i = 1; i <= 5; i++) {
            const match = lines[i].match(regex);
            if (!match) {
                throw Error(`Invalid line ${lines[i]}`);
            }
            const ticketLine = match.slice(1).map(n => parseInt(n, 10));
            ticket.push(ticketLine);
        }
        tickets.push(new BingoTicket(ticket));
        lines = lines.slice(6);
    }
    return {
        numbers,
        tickets
    }
};

const partOne = (input: BingoGame, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let winner: BingoTicket | null = null;
    const draws = input.numbers.slice();
    const tickets = input.tickets.slice();
    for (const ticket of tickets) {
        ticket.reset();
    }
    while (!winner) {
        const number = draws.shift();
        for (const ticket of tickets) {
            if (ticket.hasNumber(number)) {
                ticket.hits.push(number);
                if (ticket.isWinner()) {
                    winner = ticket;
                    break;
                }
            }
        }
    }

    const remainders = winner.getRemaining().reduce((acc, n) => acc + n);
    const called = winner.hits.pop();

    return remainders * called;
};

const partTwo = (input: BingoGame, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const draws = input.numbers.slice();
    const tickets = input.tickets.slice();
    for (const ticket of tickets) {
        ticket.reset();
    }

    let winner: BingoTicket | null = null;

    let winCount = 0;
    while (winCount != tickets.length) {
        const number = draws.shift();
        for (const ticket of tickets) {
            if (ticket.won) {
                continue;
            }
            if (ticket.hasNumber(number)) {
                ticket.hits.push(number);
                if (ticket.isWinner()) {
                    winCount -=- 1;
                    ticket.won = true;
                    winner = ticket;
                }
            }
        }
    }

    const remainders = winner.getRemaining().reduce((acc, n) => acc + n);
    const called = winner.hits.pop();

    return remainders * called;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: BingoGame) => {
    console.log("-----Input Numbers-----");
    console.log(input.numbers);
    console.log("-----Input Tickets-----");
    console.log(`Total ${input.tickets.length} present`);
    for (const ticket of input.tickets) {
        console.log(ticket);
        console.log("---------");
    }
};

const test = (_: BingoGame) => {
    console.log("----Test-----");
};

export const solutionFour: Puzzle<BingoGame, number> = {
    day: 4,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
