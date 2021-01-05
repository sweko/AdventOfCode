import { readInputLines } from "../extra/aoc-helper";
import { printMatrix } from "../extra/terminal-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

type Side = "top" | "bottom" | "left" | "right";

type Direction = "straight" | "reverse";

interface Tile {
    id: number;
    values: boolean[][];
}

type LineNumbers = {
    [key in Direction]: number;
};

type TileNumbers = {
    [key in Side]: LineNumbers;
};

type TileState = {
    id: number;
    data: boolean[][]
} & {
    [key in Side]: number;
};

type TileMatch = {
    state: TileState;
    id: number;
} & {
    [key in Side]: number;
};

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

const emptyTile = (size:number): boolean[][] => new Array(size).fill(null).map(_ => new Array(size).fill(false));

const getTileStates = ({id, values}:Tile): TileState[] => {
    const size = values.length;

    const states = new Array(8).fill(undefined).map(_ => ({
        id,
        top: -1,
        bottom: -1,
        left: -1,
        right: -1,
        data: emptyTile(size)
    }));
    for (let row = 0; row < size; row += 1) {
        for (let column = 0; column < size; column +=1) {
            states[0].data[row][column] = values[row][column];
            states[1].data[row][column] = values[row][size-1-column];
            states[2].data[row][column] = values[size-1-row][column];
            states[3].data[row][column] = values[size-1-row][size-1-column];

            states[4].data[row][column] = values[column][row];
            states[5].data[row][column] = values[size-1-column][row];
            states[6].data[row][column] = values[column][size-1-row];
            states[7].data[row][column] = values[size-1-column][size-1-row];
        }
    }

    for (const state of states) {
        const topline = state.data[0];
        const bottomline = state.data[state.data.length-1];
        const leftline = state.data.map(row => row[0]);
        const rightline = state.data.map(row => row[row.length-1]);

        state.top = asNumber(topline);
        state.bottom = asNumber(bottomline);
        state.left = asNumber(leftline),
        state.right = asNumber(rightline)
    };

    return states;
}

const extractImage = (data: boolean[][]) => data.slice(1, data.length-1).map(line => line.slice(1, line.length-1));

const getMatchingTiles = (tileInput: Tile[]): TileMatch[] => {
    const tiles = tileInput.flatMap(tile => getTileStates(tile));

    let rest = tiles.slice();
    const current = rest.pop();
    rest = rest.filter(state => state.id !== current.id);

    const matched = [{
        state: current,
        id: current.id,
        top: undefined,
        left: undefined,
        right: undefined,
        bottom: undefined
    }];

    while (rest.length !== 0) {
        for (const piece of matched.filter(tile => tile.top === undefined)) {
            const candidates = rest.filter(state => state.bottom === piece.state.top);
            if (candidates.length > 1) {
                debugger;
            }
            if (candidates.length === 0) {
                piece.top = null; // corner or side
                continue;
            }
            const item = {
                state: candidates[0],
                id: candidates[0].id,
                top: undefined,
                left: undefined,
                right: undefined,
                bottom: piece.id
            }
            piece.top = item.id;
            rest = rest.filter(state => state.id !== item.id);

            // find other connections
            const itemtop = matched.find(t => t.bottom === undefined && t.state.bottom == item.state.top);
            if (itemtop) {
                itemtop.bottom = item.id;
                item.top = itemtop.id;
            }

            const itemleft = matched.find(t => t.right === undefined && t.state.right == item.state.left);
            if (itemleft) {
                itemleft.right = item.id;
                item.left = itemleft.id;
            }

            const itemright = matched.find(t => t.left === undefined && t.state.left == item.state.right);
            if (itemright) {
                itemright.left = item.id;
                item.right = itemright.id;
            }

            matched.push(item);
        };

        for (const piece of matched.filter(tile => tile.bottom === undefined)) {
            const candidates = rest.filter(state => state.top === piece.state.bottom);
            if (candidates.length > 1) {
                debugger;
            }
            if (candidates.length === 0) {
                piece.bottom = null; // corner or side
                continue;
            }
            const item = {
                state: candidates[0],
                id: candidates[0].id,
                top: piece.id,
                left: undefined,
                right: undefined,
                bottom: undefined
            }
            piece.bottom = item.id;
            rest = rest.filter(state => state.id !== item.id);

            // find other connections
            const itembottom = matched.find(t => t.top === undefined && t.state.top == item.state.bottom);
            if (itembottom) {
                itembottom.top = item.id;
                item.bottom = itembottom.id;
            }

            const itemleft = matched.find(t => t.right === undefined && t.state.right == item.state.left);
            if (itemleft) {
                itemleft.right = item.id;
                item.left = itemleft.id;
            }

            const itemright = matched.find(t => t.left === undefined && t.state.left == item.state.right);
            if (itemright) {
                itemright.left = item.id;
                item.right = itemright.id;
            }

            matched.push(item);
        };

        for (const piece of matched.filter(tile => tile.left === undefined)) {
            const candidates = rest.filter(state => state.right === piece.state.left);
            if (candidates.length > 1) {
                debugger;
            }
            if (candidates.length === 0) {
                piece.left = null; // corner or side
                continue;
            }
            const item = {
                state: candidates[0],
                id: candidates[0].id,
                top: undefined,
                left: undefined,
                right: piece.id,
                bottom: undefined
            }
            piece.left = item.id;
            rest = rest.filter(state => state.id !== item.id);

            // find other connections
            const itemtop = matched.find(t => t.bottom === undefined && t.state.bottom == item.state.top);
            if (itemtop) {
                itemtop.bottom = item.id;
                item.top = itemtop.id;
            }

            const itemleft = matched.find(t => t.right === undefined && t.state.right == item.state.left);
            if (itemleft) {
                itemleft.right = item.id;
                item.left = itemleft.id;
            }

            const itembottom = matched.find(t => t.top === undefined && t.state.top == item.state.bottom);
            if (itembottom) {
                itembottom.top = item.id;
                item.bottom = itembottom.id;
            }

            matched.push(item);
        };

        for (const piece of matched.filter(tile => tile.right === undefined)) {
            const candidates = rest.filter(state => state.left === piece.state.right);
            if (candidates.length > 1) {
                debugger;
            }
            if (candidates.length === 0) {
                piece.right = null; // corner or side
                continue;
            }
            const item = {
                state: candidates[0],
                id: candidates[0].id,
                top: undefined,
                left: piece.id,
                right: undefined,
                bottom: undefined
            }
            piece.right = item.id;
            rest = rest.filter(state => state.id !== item.id);

            // find other connections
            const itemtop = matched.find(t => t.bottom === undefined && t.state.bottom == item.state.top);
            if (itemtop) {
                itemtop.bottom = item.id;
                item.top = itemtop.id;
            }

            const itembottom = matched.find(t => t.top === undefined && t.state.top == item.state.bottom);
            if (itembottom) {
                itembottom.top = item.id;
                item.bottom = itembottom.id;
            }

            const itemright = matched.find(t => t.left === undefined && t.state.left == item.state.right);
            if (itemright) {
                itemright.left = item.id;
                item.right = itemright.id;
            }

            matched.push(item);
        };
    }

    for (const tile of matched) {
        if (tile.top === undefined) {
            tile.top = null;
        }
        if (tile.bottom === undefined) {
            tile.bottom = null;
        }
        if (tile.left === undefined) {
            tile.left = null;
        }
        if (tile.right === undefined) {
            tile.right = null;
        }
    }

    return matched;
}

const addToImage = (baseImage: boolean[][], tile: boolean[][], row: number, column: number) => {
    const data = extractImage(tile);
    const size = data.length;
    const xoffset = row * size;
    const yoffset = column * size;
    for (let x = 0; x<size; x+=1) {
        for (let y=0; y<size; y+=1) {
            baseImage[x+xoffset][y+yoffset] = data[x][y];
        }
    }
}

const monsterOffset = [
    { x: -1, y:	18 },
    { x: 0, y:	5 },
    { x: 0, y:	6 },
    { x: 0, y:	11 },
    { x: 0, y:	12 },
    { x: 0, y:	17 },
    { x: 0, y:	18 },
    { x: 0, y:	19 },
    { x: 1, y:	1 },
    { x: 1, y:	4 },
    { x: 1, y:	7 },
    { x: 1, y:	10 },
    { x: 1, y:	13 },
    { x: 1, y:	16 },
]

const checkMonster = (image: string[][], row: number, col: number) => monsterOffset.every(({x, y}) => image[x+row] && image[x+row][y+col] === "#");

const partTwo = (input: Tile[], debug: boolean) => {
    const matched = getMatchingTiles(input);
    const tileSize = input[0].values.length-2;
    const tilePerRow = Math.sqrt(input.length);
    const baseImage = emptyTile(tileSize*tilePerRow);

    let current = matched.find(tile => tile.top === null && tile.left === null);
    let row = 0;
    let column = 0;
    let dir: Side = "right";

    while (current) {
        addToImage(baseImage, current.state.data, row, column);
        if (dir === "right" && current.right) {
            current = matched.find(tile => tile.id === current.right);
            column += 1;
        } else if (dir === "left" && current.left) {
            current = matched.find(tile => tile.id === current.left);
            column -= 1;
        } else {
            dir = (dir === "right") ? "left" : "right";
            current = matched.find(tile => tile.id === current.bottom);
            row +=1;
            if (row === tilePerRow) {
                break;
            }
        }
    }

    const images = getTileStates({id: -1, values: baseImage}).map(ts => ts.data.map(row => row.map(cell => cell ? "#": ".")));
    let monsters = 0;
    for (const image of images) {
        for (let x =0; x < image.length; x +=1) {
            for (let y =0; y < image.length; y +=1) {
                if (image[x][y] === "#") {
                    if (checkMonster(image, x, y)) {
                        monsters -=- 1;
                    }
                }
            }
        }
    }

    const monsterSize = 15;

    const totalHash = images[0].sum(row => row.sum(cell => cell === "#" ? 1 : 0));
    
    return totalHash - monsterSize * monsters;
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