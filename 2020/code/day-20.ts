import { strict } from "assert";
import { reverse } from "dns";
import { getEnabledCategories } from "trace_events";
import { readInputLines, readInput } from "../extra/aoc-helper";
import { printMatrix } from "../extra/terminal-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Tile<T=boolean> {
    id: number;
    values: T[][];
}

interface TileMetadata<T=boolean> {
    id: number;
    numbers: TileNumbers;
    states: TileStates<T>
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

interface TileState<T=boolean> {
    straight: T[][];
    reverse: T[][];
}

interface TileStates<T> {
    id: number;
    top: TileState<T>;
    bottom: TileState<T>;
    left: TileState<T>;
    right: TileState<T>;
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
            reverse: asNumber(topline.slice().reverse())
        },
        bottom: {
            straight: asNumber(bottomline),
            reverse: asNumber(bottomline.slice().reverse())
        },
        left: {
            straight: asNumber(leftline),
            reverse: asNumber(leftline.slice().reverse())
        },
        right: {
            straight: asNumber(rightline),
            reverse: asNumber(rightline.slice().reverse())
        }
    }
}

const getCornerIds = (input: Tile[]):[number, number, number, number] => {
    const tiles = input.map(tile => ({
        id: tile.id,
        numbers: getTileNumbers(tile)
    }));

    const corners = tiles.flatMap(tile => [
        { id: tile.id, value: Math.min(tile.numbers.top.straight, tile.numbers.top.reverse) },
        { id: tile.id, value: Math.min(tile.numbers.bottom.straight, tile.numbers.bottom.reverse) },
        { id: tile.id, value: Math.min(tile.numbers.left.straight, tile.numbers.left.reverse) },
        { id: tile.id, value: Math.min(tile.numbers.right.straight, tile.numbers.right.reverse) },
    ])
        .groupBy(item => item.value)
        .filter(group => group.items.length % 2 !== 0)
        .map(group => group.items)
        .flat()
        .groupBy(item => item.id)
        .filter(group => group.items.length >= 2)
        .map(group => group.key);

    if (corners.length !== 4) {
        console.log(corners);
        throw new Error("FOUR CORNERS NOT FOUND");
    }
    return corners as any;
}

const partOne = (input: Tile[], debug: boolean) => {
    const corners = getCornerIds(input);
    return corners[0] * corners[1] * corners[2] * corners[3];
};

const emptyTile = <T>(size:number, dfault: T): T[][] => new Array(size).fill(null).map(_ => new Array(size).fill(dfault));

const getTileStates = <T>({id, values}:Tile<T>, dfault: T): TileStates<T> => {
    const size = values.length;

    const topStraight = emptyTile(size, dfault);
    const topReverse = emptyTile(size, dfault);
    const bottomStraight = emptyTile(size, dfault);
    const bottomReverse = emptyTile(size, dfault);
    const leftStraight = emptyTile(size, dfault);
    const leftReverse = emptyTile(size, dfault);
    const rightStraight = emptyTile(size, dfault);
    const rightReverse = emptyTile(size, dfault);
    for (let row = 0; row < size; row += 1) {
        for (let column = 0; column < size; column +=1) {
            topStraight[row][column] = values[row][column];
            topReverse[row][column] = values[row][size-1-column];
            bottomStraight[row][column] = values[size-1-row][column];
            bottomReverse[row][column] = values[size-1-row][size-1-column];

            leftStraight[row][column] = values[column][row];
            leftReverse[row][column] = values[size-1-column][row];
            rightStraight[row][column] = values[column][size-1-row];
            rightReverse[row][column] = values[size-1-column][size-1-row];
        }
    }

    return {
        id,
        top: {
            straight: topStraight,
            reverse: topReverse,
        },
        bottom: {
            straight: bottomStraight,
            reverse: bottomReverse,
        },
        left: {
            straight: leftStraight,
            reverse: leftReverse,
        },
        right: {
            straight: rightStraight,
            reverse: rightReverse
        }
    };

    // return [
    //     {
    //         top: top.straight, 
    //         bottom: bottom.straight,
    //         left: left.straight, 
    //         right: right.straight
    //     },
    //     {
    //         top: left.reverse, 
    //         bottom: right.reverse,
    //         left: bottom.straight,
    //         right: top.straight
    //     },
    //     {
    //         top: bottom.reverse,
    //         bottom: top.reverse,
    //         left: right.reverse,
    //         right: left.reverse
    //     },
    //     {
    //         top: right.straight,
    //         bottom: left.straight,
    //         left: top.reverse,
    //         right: bottom.reverse,
    //     },
    //     {
    //         top: top.reverse,
    //         bottom: bottom.reverse,
    //         left: right.straight,
    //         right: left.straight
    //     },
    //     {
    //         top: right.reverse,
    //         bottom: left.reverse,
    //         left: bottom.reverse,
    //         right: top.reverse,
    //     },
    //     {
    //         top: bottom.straight,
    //         bottom: top.straight,
    //         left: left.reverse,
    //         right: right.reverse,
    //     },
    //     {
    //         top: left.straight,
    //         bottom: right.straight,
    //         left: top.straight,
    //         right: bottom.straight
    //     }
    // ];
}

const getTilesMetadata = <T>(input: Tile<T>[]):TileMetadata<T> => {
    const tiles = input.map(tile => ({
        id: tile.id,
        numbers: getTileNumbers(tile),
        states: getTileStates(tile, false);
    }));
}

const getCorners = (input: Tile[]):[Tile, Tile, Tile, Tile] => {
    const tiles = input.map(tile => ({
        id: tile.id,
        numbers: getTileNumbers(tile)
    }));

    const x0 = tiles.flatMap(tile => [
        { id: tile.id, value: Math.min(tile.numbers.top.straight, tile.numbers.top.reverse) },
        { id: tile.id, value: Math.min(tile.numbers.bottom.straight, tile.numbers.bottom.reverse) },
        { id: tile.id, value: Math.min(tile.numbers.left.straight, tile.numbers.left.reverse) },
        { id: tile.id, value: Math.min(tile.numbers.right.straight, tile.numbers.right.reverse) },
    ]);

    const x1 = x0.groupBy(item => item.value);
    const x2 = x1.filter(group => group.items.length % 2 !== 0);
    const x3 = x2.map(group => group.items).flat();
    const x4 = x3.groupBy(item => item.id);
    const x5 = x4.filter(group => group.items.length >= 2);
    const x6 = x5.map(group => group.key);

    if (x6.length !== 4) {
        console.log(x0);
        throw new Error("FOUR CORNERS NOT FOUND");
    }
    return x6 as any;
}

const partTwo = (input: Tile[], debug: boolean) => {
    showInput(input);
    const imageSide = Math.sqrt(input.length);
    const tileSize = input[0].values.length;

    const corners = getCorners(input);

    // const tiles = input.map(tile => ({
    //     id: tile.id,
    //     states: getTileStates(getTileNumbers(tile))
    // }));

    
    
    // const image: Tile[][] = new Array(imageSide).fill(null)
    //     .map(_ => new Array(imageSide).fill(null).map(_ => emptyTile(tileSize)));

    // //set corner tiles;
    // image[0]

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
    const tile:Tile<string> = {
        id: -1,
        values: [
            [ 'a', 'b', 'c'],
            [ 'd', 'e', 'f'],
            [ 'g', 'h', 'i'],
        ]
    };

    const states = getTileStates(tile, "");
    printMatrix(states.top.straight);
    console.log("--");
    printMatrix(states.top.reverse);
    console.log("--");
    printMatrix(states.bottom.straight);
    console.log("--");
    printMatrix(states.bottom.reverse);
    console.log("--states.left.straight--");
    printMatrix(states.left.straight);
    console.log("--states.left.reverse--");
    printMatrix(states.left.reverse);
    console.log("--states.right.straight--");
    printMatrix(states.right.straight);
    console.log("--states.right.reverse--");
    printMatrix(states.right.reverse);
    console.log("--");

    return;
    printMatrix(states.top.straight);
    printMatrix(states.top.straight);
    printMatrix(states.top.straight);
    printMatrix(states.top.straight);
    printMatrix(states.top.straight);
    printMatrix(states.top.straight);

    // console.log(JSON.stringify(, null, 2));
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


