import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Target {
    x: {from: number, to: number};
    y: {from: number, to: number};
}

const processInput = async (day: number) => {
    return {
        x: {from: 150, to: 171},
        y: {from: -129, to: -70},
    };
    // return {
    //     x: {from: 20, to: 30},
    //     y: {from: -10, to: -5},
    // };
};

// const partOne = (input: Target, debug: boolean) => (- input.y.from - 1) * (-input.y.from) / 2;

const partOne = (input: Target, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const speed = - input.y.from - 1;
    return speed * (speed+1) / 2;
};

const hitsTarget = (speed: {x: number, y: number}, target: Target): boolean => {
    let {x: xspeed, y: yspeed} = speed;
    let x = 0;
    let y = 0;
    while (true) {
        x += xspeed;
        y += yspeed;
        if (x > target.x.to) {
            return false;
        }
        if (y < target.y.from) {
            return false;
        }
        if ((x >= target.x.from) && (y <= target.y.to)) {
            return true;
        }
        if (xspeed !== 0) {
            xspeed -= 1;
        }
        yspeed -= 1;
    }
}


const partTwo = (input: Target, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const minx = 0;
    const maxx = input.x.to;

    const miny = input.y.from;
    const maxy = - input.y.from - 1;

    let count = 0;
    for (let x = minx; x <= maxx; x++) {
        for (let y = miny; y <= maxy; y++) {
            if (hitsTarget({x, y}, input)) {
                count++;
            }
        }
    }

    return count;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Target) => {
    console.log(input);
};

const test = (_: Target) => {
    console.log("----Test-----");
};

export const solutionSeventeen: Puzzle<Target, number> = {
    day: 17,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
