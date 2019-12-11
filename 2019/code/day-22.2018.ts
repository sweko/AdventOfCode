import "../extra/array-helpers";
import { Puzzle } from "./model";
import { printMatrix } from "../extra/terminal-helper";
import { loopMatrix } from "../extra/aoc-helper";

interface Point {
    x: number;
    y: number;
}

interface Input {
    depth: number;
    target: Point;
}

const data = {
    modulo: 20183,
    xfactor: 16807,
    yfactor: 48271
}

const processInput = async (day: number) => {
    return {
        depth: 4080,
        target: {
            x: 14,
            y: 785
        }
    };
};

const getType = (level: number) => level % 3;

const partOne = (input: Input, debug = false) => {
    const { depth, target } = input;
    const cave = Array(target.y + 1).fill(null).map(_ => Array(target.x + 1).fill(null));

    for (let xindex = 0; xindex <= input.target.x; xindex++) {
        for (let yindex = 0; yindex <= input.target.y; yindex++) {
            if ((xindex === 0) && (yindex === 0)) {
                cave[yindex][xindex] = depth % data.modulo;
                continue;
            }
            if ((xindex === target.x) && (yindex === target.y)) {
                cave[yindex][xindex] = depth % data.modulo;
                continue;
            }
            if (xindex === 0) {
                cave[yindex][xindex] = (yindex * data.yfactor + depth) % data.modulo;
                continue;
            }
            if (yindex === 0) {
                cave[yindex][xindex] = (xindex * data.xfactor + depth) % data.modulo;
                continue;
            }
            const geoIndex = cave[yindex - 1][xindex] * cave[yindex][xindex - 1];
            cave[yindex][xindex] = (geoIndex + depth) % data.modulo;
        }

    }

    if (debug) {
        printMatrix(cave, (level) => {
            const type = getType(level);
            return type === 0 ? "." : type === 1 ? "=" : type === 2 ? "|" : "X"
        })
    }

    return cave.sum(line => line.sum(item => getType(item)));
};

const partTwo = (input: Input, debug = false) => {
    return 0;
};

const resultOne = (_: any, result: number) => {
    return `The total risk level is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `There are ${result} rooms distant a 1000 or more doors`;
};

const showInput = (input: Input) => {
    console.log(input);
};

const test = () => {
    const input: Input = {
        target: {
            x: 10,
            y: 10,
        },
        depth: 510
    }
    console.log(partOne(input, true));
};

export const solution22_2018: Puzzle<Input, number> = {
    day: 222018,
    input: processInput,
    partOne,
    //partTwo,
    resultOne,
    resultTwo,
    showInput,
    test,
}


