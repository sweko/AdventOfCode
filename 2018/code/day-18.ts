import { performance } from "perf_hooks";
import "../extra/array-helpers";
import { readInputLines, loopMatrix } from "../extra/aoc-helper";
import { printMatrix, generateModuloPrinter } from "../extra/terminal-helper";

type Field = Acre[][];

type Acre = "." | "|" | "#";

type Point = { row: number, column: number };

async function main() {
    const startInput = performance.now();
    const lines = await readInputLines();

    const field: Field = lines.map(line => line.split("") as Acre[]);

    const endInput = performance.now();
    console.log(`Running time for input is ${Math.round(endInput - startInput)}ms`);

    const startOne = performance.now();
    let resourceValue = processPartOne(field);
    const endOne = performance.now();

    console.log(`Part 1: Field value is: ${resourceValue}`);
    console.log(`Running time for part 1 is ${Math.round(endOne - startOne)}ms`);

    const startTwo = performance.now();
    resourceValue = processPartTwo(field);
    const endTwo = performance.now();

    console.log(`Part 2: Field value is: ${resourceValue}`);
    console.log(`Running time for part 2 is ${Math.round(endTwo - startTwo)}ms`);
}

const getNeighbours = (point: Point, field: Field): { [key in Acre]?: number } => [
    { row: point.row - 1, column: point.column - 1 },
    { row: point.row - 1, column: point.column },
    { row: point.row - 1, column: point.column + 1 },
    { row: point.row, column: point.column - 1 },
    { row: point.row, column: point.column + 1 },
    { row: point.row + 1, column: point.column - 1 },
    { row: point.row + 1, column: point.column },
    { row: point.row + 1, column: point.column + 1 },
].filter(point => point.row >= 0 && point.row < field.length && point.column >= 0 && point.column < field[0].length)
    .groupReduce(point => field[point.row][point.column], (acc, item) => acc + 1, 0)
    .reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
    }, {});


const transitions: { [key in Acre]: (Point, Field) => Acre } = {
    ".": (point: Point, field: Field) => {
        const neighbours = getNeighbours(point, field);
        if (neighbours["|"] >= 3) {
            return "|";
        }
        return "."
    },
    "|": (point: Point, field: Field) => {
        const neighbours = getNeighbours(point, field);
        if (neighbours["#"] >= 3) {
            return "#";
        }
        return "|"
    },
    "#": (point: Point, field: Field) => {
        const neighbours = getNeighbours(point, field);
        if (neighbours["#"] >= 1 && neighbours["|"] >= 1) {
            return "#";
        }
        return "."
    }
};


function processPartOne(field: Field): number {
    for (let index = 0; index < 10; index++) {
        field = field.map((row, rindex) => row.map((cell, cindex) => transitions[cell]({ row: rindex, column: cindex }, field)));
    }
    const counts = {
        ".": 0,
        "|": 0,
        "#": 0
    };
    loopMatrix(field, (x, y, cell) => {
        counts[cell] += 1;
    })

    return counts["|"] * counts["#"];
}

function processPartTwo(field: Field): number {
    const memo = [];
    let index = 0;
    const seconds = 999999999;
    let cycleStart = -1;
    let cycleLength = -1;

    while (true) {
        field = field.map((row, rindex) => row.map((cell, cindex) => transitions[cell]({ row: rindex, column: cindex }, field)));
        const fieldList = field.map(row => row.join("")).join("");
        const oldIndex = memo.findIndex(item => item.string === fieldList);
        if (oldIndex !== -1) {
            console.log(`found duplicate at ${index} with ${oldIndex}`);
            console.log(`cycle length = ${index-oldIndex}`);
            cycleStart = oldIndex;
            cycleLength = index - oldIndex;
            break;
        };
        memo[index] = {
            field: field, 
            string: fieldList
        }
        index += 1;
    }

    const secondsIndex = (seconds - cycleStart) % cycleLength + cycleStart;

    console.log(secondsIndex);

    const counts = {
        ".": 0,
        "|": 0,
        "#": 0
    };
    loopMatrix(memo[secondsIndex].field, (x, y, cell) => {
        counts[cell] += 1;
    })

    return counts["|"] * counts["#"];
}

main();