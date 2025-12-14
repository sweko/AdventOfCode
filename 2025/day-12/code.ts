// Solution for day 12 of advent of code 2025

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";

type Region = {
    width: number;
    height: number;
    shapeCounts: number[];
};

type Shape = {
    index: number,
    content: ("."|"#")[][];
};

type Input = {
    shapes: Shape[];
    regions: Region[];
}

const processInput = (day: number):Input => {
    const lines = readInputLines(day);
    const shapes: Shape[] = [];

    let index = 0;
    const shapeRegex = /^(\d+):$/;
    // Parse shapes
    while (index < lines.length) {
        const line = lines[index].trim();
        const match = line.match(shapeRegex);

        if (!match) {
            // start of regions data
            break;
        }

        // Start of a shape
        const shape: Shape = {
            index: parseInt(match[1], 10),
            content: []
        };
        index += 1; // Move to next line after shape index
        while (lines[index] !== "") {
            const shapeLine = lines[index].split("") as ("."|"#")[];
            shape.content.push(shapeLine);
            index += 1;
        }
        shapes.push(shape);
        index += 1; // Skip the empty line
    }

    const regionLines = lines.slice(index);
    const regionRegex = /^(\d+)x(\d+): (\d+(?: \d+)*)$/;

    const regions = regionLines.map(line => {
        const match = line.match(regionRegex);
        if (match) {
            const width = parseInt(match[1], 10);
            const height = parseInt(match[2], 10);
            const shapeCounts = match[3].split(" ").map(numStr => parseInt(numStr, 10));
            return { width, height, shapeCounts };
        }
        throw new Error("Invalid region line: " + line);
    });

    return { shapes, regions };
};

const partOne = ({shapes, regions}: Input, debug: boolean) => {
    const shapesAreas = shapes.map(({content}) => content.map(row => row.filter(cell => cell === "#").length).sum());

    const maybeRegions = regions.filter(region => {
        const totalArea = region.width * region.height;
        const shapesAreaSum = region.shapeCounts.map((count, idx) => count * shapesAreas[idx]).sum();
        return totalArea >= shapesAreaSum;
    });

    const boundingWidth = shapes.map(s => s.content[0].length).max();
    const boundingHeight = shapes.map(s => s.content.length).max();

    const yesRegions = maybeRegions.filter(region => {
        const widthFits = Math.floor(region.width / boundingWidth);
        const heightFits = Math.floor(region.height / boundingHeight);
        const totalFits = widthFits * heightFits;
        const totalShapes = region.shapeCounts.sum();
        return totalFits >= totalShapes;
    });

    const trueMaybeRegions = maybeRegions.filter(region => {
        const widthFits = Math.floor(region.width / boundingWidth);
        const heightFits = Math.floor(region.height / boundingHeight);
        const totalFits = widthFits * heightFits;
        const totalShapes = region.shapeCounts.sum();
        return totalFits < totalShapes;
    });

    if (trueMaybeRegions.length > 0) {
        console.log("Regions that may fit but need further checking:", trueMaybeRegions);
        throw new Error("Further checking not implemented");
    }
    return yesRegions.length;
};

const partTwo = (input: Input, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    return -1;
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

export const solution: Puzzle<Input, number> = {
    day: 12,
    input: () => processInput(12),
    partOne,
 //   partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}