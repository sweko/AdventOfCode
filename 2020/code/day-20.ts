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

const emptyTile = <T>(size:number, dfault: T): Tile<T> => ({
    id: 0,
    values: new Array(size).fill(null).map(_ => new Array(size).fill(dfault))
});

const getTileStates = <T>({id, values}:Tile<T>, dfault: T): Tile<T>[] => {//TileStates<T> => {
    const size = values.length;

    const result = new Array(8).fill(null).map(_ => emptyTile(size, dfault));

    // const topStraight = emptyTile(size, dfault);
    // const topReverse = emptyTile(size, dfault);
    // const bottomStraight = emptyTile(size, dfault);
    // const bottomReverse = emptyTile(size, dfault);
    // const leftStraight = emptyTile(size, dfault);
    // const leftReverse = emptyTile(size, dfault);
    // const rightStraight = emptyTile(size, dfault);
    // const rightReverse = emptyTile(size, dfault);
    for (let row = 0; row < size; row += 1) {
        for (let column = 0; column < size; column +=1) {
            result[0].values[row][column] = values[row][column];
            result[1].values[row][column] = values[row][size-1-column];
            result[2].values[row][column] = values[size-1-row][size-1-column];
            result[3].values[row][column] = values[size-1-row][column];
            result[4].values[row][column] = values[column][row];
            result[5].values[row][column] = values[size-1-column][row];
            result[6].values[row][column] = values[column][size-1-row];
            result[7].values[row][column] = values[size-1-column][size-1-row];
        }
    }
    return result;

    // return {
    //     top: {
    //         straight: topStraight.values,
    //         reverse: topReverse.values,
    //     },
    //     bottom: {
    //         straight: bottomStraight.values,
    //         reverse: bottomReverse.values,
    //     },
    //     left: {
    //         straight: leftStraight.values,
    //         reverse: leftReverse.values,
    //     },
    //     right: {
    //         straight: rightStraight.values,
    //         reverse: rightReverse.values
    //     }
    // };

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


const getCorners = (input: Tile[]):[Tile, Tile, Tile, Tile] => {
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



const partTwo = (input: Tile[], debug: boolean) => {
    const imageSide = Math.sqrt(input.length);
    const tileSize = input[0].values.length;

    // const tiles = input.map(tile => ({
    //     id: tile.id,
    //     states: getTileStates(getTileNumbers(tile))
    // }));

    // const corners = getCornerIds(input);
    
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

    for (const state of getTileStates(tile, "")) {
        printMatrix(state.values);
        console.log("----");
        
    }
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


