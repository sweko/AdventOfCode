import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

enum RPS {
    Rock = 1,
    Paper = 2,
    Scissors = 3
};

interface Round {
    first: "A" | "B" | "C";
    second: "X" | "Y" | "Z";
}

const ABC2RPS = (input: "A" | "B" | "C") => {
    switch (input) {
        case "A": return RPS.Rock;
        case "B": return RPS.Paper;
        case "C": return RPS.Scissors;
    }
}

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    return input.map(line => {
        const [first, second] = line.split(" ")
        return { first, second } as Round;
    });
};

const getRoundValue = ({first, second}: {first: RPS, second: RPS}) => {
    const shape: number = second;
    let game: number = -1;
    if (first === second) {
        game = 3;
    } else if (
        (first === RPS.Rock && second === RPS.Scissors) ||
        (first === RPS.Paper && second === RPS.Rock) ||
        (first === RPS.Scissors && second === RPS.Paper)
    ) {
        game = 0;
    } else {
        game = 6;
    }
    return shape+game;
}

const partOne = (input: Round[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const XYZ2RPS = (input: "X" | "Y" | "Z") => {
        switch (input) {
            case "X": return RPS.Rock;
            case "Y": return RPS.Paper;
            case "Z": return RPS.Scissors;
        }
    }

    const rounds = input.map(round => ({
        first: ABC2RPS(round.first),
        second: XYZ2RPS(round.second)
    }));

    const total = rounds.map(getRoundValue).sum();

    return total;
};

const partTwo = (input: Round[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const XYZ2RPS = (opp: "A" | "B" | "C", outcome: "X" | "Y" | "Z") => {
        if (outcome === "Y") {
            return ABC2RPS(opp);
        }
        if (outcome === "Z") {
            if (opp === "A") {
                return RPS.Paper;
            }
            if (opp === "B") {
                return RPS.Scissors;
            }
            if (opp === "C") {
                return RPS.Rock;
            }
        }
        if (outcome === "X") {
            if (opp === "A") {
                return RPS.Scissors;
            }
            if (opp === "B") {
                return RPS.Rock;
            }
            if (opp === "C") {
                return RPS.Paper;
            }
        }
    }

    const rounds = input.map(round => ({
        first: ABC2RPS(round.first),
        second: XYZ2RPS(round.first, round.second)
    }));

    const total = rounds.map(getRoundValue).sum();
    return total;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Round[]) => {
    console.log(input);
};

const test = (_: Round[]) => {
    console.log("----Test-----");
};

export const solutionTwo: Puzzle<Round[], number> = {
    day: 2,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
