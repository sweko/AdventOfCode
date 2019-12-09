import { readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { printMatrix } from "../extra/terminal-helper";

interface Image {
    width: number,
    height: number,
    layers: number[][];
}

const processInput = async (day: number) => {
    const input = await readInput(day);
    const width = 25;
    const height = 6;
    const layers = input.split("").map(c => Number(c)).splitAt(width * height);
    return {
        width,
        height,
        layers
    };
};

const partOne = (image: Image) => {
    const result = image.layers
        .map(l => l.groupReduce(d => d, acc => acc + 1, 0))
        .minFind(digits => digits.find(d => d.key === 0).value);

    const ones = result.find(d =>d.key === 1).value;
    const twos = result.find(d =>d.key === 2).value;

    return ones * twos;
};

const partTwo = (image: Image) => {
    const result = image.layers[0];
    for (const layer of image.layers.slice(1)) {
        for (let index = 0; index < layer.length; index++) {
            const pixel = layer[index];
            if (result[index] === 2) {
                result[index] = pixel;
            }
        }
    }
    printMatrix(result.splitAt(image.width), (item) => item===0 ? " ": "#");
    return 0;
};

const resultOne = (_: any, result: number) => {
    return `Ones by twos is ${result}`;
};

const resultTwo = () => {
    return `See above...`;
};

const showInput = (input: Image) => {
    console.log(input);
};

const test = (input: Image) => {

};

export const solutionEight: Puzzle<Image, number> = {
    day: 8,
    input: processInput,
    partOne,
    partTwo,
    resultOne,
    resultTwo,
    showInput,
    test,
}
