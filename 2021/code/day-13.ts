import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { printMatrix } from "../extra/terminal-helper";
import { Puzzle } from "./model";

interface Dot {
    x: number;
    y: number;
}

interface Fold {
    direction: "x" | "y"; 
    amount: number;
}

interface Input {
    dots: Dot[];
    folds: Fold[];
}

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    const dots = input.takeWhile(line => line !== "").map(line => {
        const [x, y] = line.split(",").map(n => parseInt(n, 10));
        return { x, y };
    });
    console.log(dots);
    const folds = input.slice(dots.length + 1).map(line => {
        const direction = line[11] as "x" | "y";
        const amount = parseInt(line.slice(13), 10);
        return { direction, amount };
    });
    console.log(folds);
    return { dots, folds };
};

function foldDot(fold: Fold, dot: Dot): Dot {
    if (fold.direction === "x") {
        if (dot.x === fold.amount) {
            throw new Error(`Dot at the fold line x = ${fold.amount}`);
        }
        if (dot.x < fold.amount) {
            return dot;
        }
        const x = 2 * fold.amount - dot.x;
        return { x, y: dot.y };
    } else {
        if (dot.y === fold.amount) {
            throw new Error(`Dot at the fold line y = ${fold.amount}`);
        }
        if (dot.y < fold.amount) {
            return dot;
        }
        const y = 2 * fold.amount - dot.y;
        return { x: dot.x, y };
    }
}

const partOne = (input: Input, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    // only the first fold is used
    const fold = input.folds[0];
    const dots = input.dots.map(dot => foldDot(fold, dot));

    const uniqueDots = [...new Set(dots.map(dot => dot.x + "," + dot.y))];
    return uniqueDots.length;
};

const partTwo = (input: Input, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    let dots = input.dots.map(dot => ({...dot}));

    for (const fold of input.folds) {
        dots = dots.map(dot => foldDot(fold, dot));
    }

    const maxx = dots.max(dot => dot.x);
    const maxy = dots.max(dot => dot.y);

    const matrix = Array(maxy + 1).fill(0).map(() => Array(maxx + 1).fill(0));
    for (const dot of dots) {
        matrix[dot.y][dot.x] = 1;
    }
    printMatrix(matrix, x => x ? "#" : " ");
    return 0;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Input) => {
    console.log(input);
};

const test = (_: Input) => {
    console.log("----Test-----");
};

export const solutionThirteen: Puzzle<Input, number> = {
    day: 13,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}


