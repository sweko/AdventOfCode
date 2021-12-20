import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { printMatrix } from "../extra/terminal-helper";
import { Puzzle } from "./model";

type Pixel = "."|"#";
type Map  = Pixel[];
type Image = Pixel[][];
interface Input {
    map: Map;
    image: Image;
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const map = lines[0].split("");
    const image = lines.slice(2).map(line => line.split(""));
    return {map, image} as Input;
};

const stepImage = (map: Map, image: Image, step: number): Image => {
    const infinity = getInfityStone(map, step);

    const expanded = [
        Array(image[0].length + 4).fill(infinity),
        Array(image[0].length + 4).fill(infinity),
        ...image.map(line => [infinity, infinity, ...line, infinity, infinity]),
        Array(image[0].length + 4).fill(infinity),
        Array(image[0].length + 4).fill(infinity),
    ];

    const result = [
        Array(image[0].length + 2).fill("."),
        ...image.map(line => Array(line.length + 2).fill(".")),
        Array(image[0].length + 2).fill("."),
    ];

    for (let rindex = 1; rindex < expanded.length - 1; rindex++) {
        for (let cindex = 1; cindex < expanded[rindex].length - 1; cindex++) {
            let lookup = 0;
            if (expanded[rindex - 1][cindex - 1] === "#" ) {
                lookup += 256;
            }
            if (expanded[rindex - 1][cindex] === "#" ) {
                lookup += 128;
            }
            if (expanded[rindex - 1][cindex + 1] === "#" ) {
                lookup += 64;
            }
            if (expanded[rindex][cindex - 1] === "#" ) {
                lookup += 32;
            }
            if (expanded[rindex][cindex] === "#" ) {
                lookup += 16;
            }
            if (expanded[rindex][cindex + 1] === "#" ) {
                lookup += 8;
            }
            if (expanded[rindex + 1][cindex - 1] === "#" ) {
                lookup += 4;
            }
            if (expanded[rindex + 1][cindex] === "#" ) {
                lookup += 2;
            }
            if (expanded[rindex + 1][cindex + 1] === "#" ) {
                lookup += 1;
            }
            result[rindex - 1][cindex - 1] = map[lookup];
        }
    }

    return result;
}

const partOne = (input: Input, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const step1 = stepImage(input.map, input.image, 0);
    const step2 = stepImage(input.map, step1, 1);

    const litPixels = step2.reduce((acc, line) => acc + line.filter(pixel => pixel === "#").length, 0);

    return litPixels;
};

const getInfityStone = (map: Map, step: number): Pixel => {
    const start = map[0];
    const end = map[map.length - 1];
    if (start === ".") {
        return "."
    }
    if (end === "#") {
        return step === 0 ? "." : "#";
    }
    return (step % 2 === 0) ? "." : "#";
}

const partTwo = (input: Input, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const limit = 50;
    let image = input.image;

    for (let step = 0; step < limit; step++) {
        image = stepImage(input.map, image, step);
    }

    const litPixels = image.reduce((acc, line) => acc + line.filter(pixel => pixel === "#").length, 0);

    return litPixels;
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
    let result = "";
    for (let index = 0; index < 20; index++) {
        result += getInfityStone(["#", "#", "."], index);
    }
    console.log(result);
};

export const solutionTwenty: Puzzle<Input, number> = {
    day: 20,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}


