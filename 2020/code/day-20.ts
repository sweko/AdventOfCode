import { strict } from "assert";
import { reverse } from "dns";
import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Tile {
    id: number;
    values: boolean[][];
}

interface LineNumbers {
    straight: number;
    reverse: number;
}

interface TileNumbers {
    top: LineNumbers;
    bottom: LineNumbers;
    left: LineNumbers;
    right: LineNumbers;
}

interface TileState {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    const result: Tile[] = [];
    let tile = null;
    for (const line of input) {
        if (tile === null) {
            const id = +line.slice(5, 9);
            tile = { 
                id,
                values: []
            };
            continue;
        }
        if (line === "") {
            result.push(tile);
            tile = null;
            continue;
        }
        tile.values.push(line.split("").map(char => char === "#"));
    }
    result.push(tile);
    console.log(result[0]);
    console.log(result[result.length-1]);
    return result;
};

const asNumber = (values: boolean[]):number => values.reduce((acc, item) => acc * 2 + (item ? 1: 0) , 0);

const getTileNumbers = ({values}: Tile): TileNumbers => {
    const topline = values[0];
    const bottomline = values[values.length-1];
    const leftline = values.map(row => row[0]);
    const rightline = values.map(row => row[row.length-1]);

    return {
        top: {
            straight: asNumber(topline),
            reverse: asNumber(topline.reverse())
        },
        bottom: {
            straight: asNumber(bottomline),
            reverse: asNumber(bottomline.reverse())
        },
        left: {
            straight: asNumber(leftline),
            reverse: asNumber(leftline.reverse())
        },
        right: {
            straight: asNumber(rightline),
            reverse: asNumber(rightline.reverse())
        }
    }
}

const getTileStates = ({top, bottom, left, right}:TileNumbers): TileState[] => {
    return [
        {
            top: top.straight, 
            bottom: bottom.straight,
            left: left.straight, 
            right: right.straight
        },
        {
            top: left.reverse, 
            bottom: right.reverse,
            left: bottom.straight,
            right: top.straight
        },
        {
            top: bottom.reverse,
            bottom: top.reverse,
            left: right.reverse,
            right: left.reverse
        },
        {
            top: right.straight,
            bottom: left.straight,
            left: top.reverse,
            right: bottom.reverse,
        },
        {
            top: top.reverse,
            bottom: bottom.reverse,
            left: right.straight,
            right: left.straight
        },
        {
            top: right.reverse,
            bottom: left.reverse,
            left: bottom.reverse,
            right: top.reverse,
        },
        {
            top: bottom.straight,
            bottom: top.straight,
            left: left.reverse,
            right: right.reverse,
        },
        {
            top: left.straight,
            bottom: right.straight,
            left: top.straight,
            right: bottom.straight
        }
    ];
}

const partOne = (input: Tile[], debug: boolean) => {
    // const tiles = input.map(tile => ({ 
    //     id: tile.id, 
    //     states: getTileStates(getTileNumbers(tile))
    // }));

    const tiles = input.map(tile => ({ 
        id: tile.id, 
        numbers: getTileNumbers(tile)
    }));

    const corners = tiles.flatMap(tile => [
        { id: tile.id, value: Math.min(tile.numbers.top.straight, tile.numbers.top.reverse)},
        { id: tile.id, value: Math.min(tile.numbers.bottom.straight, tile.numbers.bottom.reverse)},
        { id: tile.id, value: Math.min(tile.numbers.left.straight, tile.numbers.left.reverse)},
        { id: tile.id, value: Math.min(tile.numbers.right.straight, tile.numbers.right.reverse)},
    ])
    .groupBy(item => item.value)
    .filter(group => group.items.length % 2 !== 0)
    .map(group => group.items).flat()
    .groupBy(item => item.id)
    .filter(group => group.items.length >= 2)
    .map(group => group.key);

    if (corners.length !== 4) {
        console.log(corners);
        throw new Error("FOUR CORNERS NOT FOUND");
    }


    return corners[0] * corners[1] * corners[2] * corners[3];
};

const partTwo = (input: Tile[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    return 0;
};

const resultOne = (_: any, result: number) => {
    return `The product of the corners is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The water roughness is ${result}`;
};

const showInput = (input: Tile[]) => {
    console.log(input);
};

const test = (_: Tile[]) => {
    console.log("----Test-----");
};

export const solutionTwenty: Puzzle<Tile[], number> = {
    day: 20,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
