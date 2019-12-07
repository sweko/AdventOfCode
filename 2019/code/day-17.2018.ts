import { readInputLines } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { printMatrix } from "../extra/terminal-helper";
import { Puzzle } from "./model";

interface Range {
    from: number;
    to: number;
}

interface Wall {
    x: Range,
    y: Range
}

interface Raster {
    map: string[][];
    source: number;
}

interface Point {
    x: number,
    y: number
}


const wallRegex = /^(x|y)=(\d+), (x|y)=(\d+)\.\.(\d+)$/i;

const lineToWall = (line: string) => {
    const match = line.match(wallRegex);
    const parameters = {
        constant: parseInt(match[2]),
        from: parseInt(match[4]),
        to: parseInt(match[5]),
    };
    const wall: Wall = {
        x: (match[1] === 'x') ? {
            from: parameters.constant,
            to: parameters.constant
        } : {
                from: parameters.from,
                to: parameters.to
            },
        y: (match[1] === 'y') ? {
            from: parameters.constant,
            to: parameters.constant
        } : {
                from: parameters.from,
                to: parameters.to
            },
    };
    return wall;
};

const wallToRaster = (walls: Wall[]): Raster => {
    const minX = walls.min(wall => wall.x.from) - 1;
    const maxX = walls.max(wall => wall.x.to) + 1 - minX + 1;
    const maxY = walls.max(wall => wall.y.to);

    const walls2 = walls.map(wall => ({
        x: {
            from: wall.x.from - minX,
            to: wall.x.to - minX,
        },
        y: wall.y
    }));

    const map = new Array(maxY).fill(null).map(_ => new Array(maxX).fill(" "));

    for (const wall of walls2) {
        for (let x = wall.x.from; x <= wall.x.to; x += 1) {
            for (let y = wall.y.from; y <= wall.y.to; y += 1) {
                map[y - 1][x] = "#";
            }
        }
    };

    return {
        map,
        source: 500 - minX
    };
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);

    const walls = lines.map(lineToWall);
    return walls;
};

const partOne = (walls: Wall[]) => {
    return 0;
};

const resultOne = (_: any, result: number) => {
    return `Value at position zero is ${result}`;
};

const showInput = (walls: Wall[]) => {
    const result = wallToRaster(walls);

    //printMatrix(result.map);
    runPipe(result);



    // console.log(minX, maxX);
    // console.log(minY, maxY);
};

const get = (raster: Raster, source: Point) => {
    return raster.map[source.x][source.y];
}

const set = (raster: Raster, source: Point, value: string) => {
    raster.map[source.x][source.y] = value;
}

const runPipe = (raster: Raster): Raster => {
    let source = { x: 0, y: raster.source };

    //fall down
    while (get(raster, source) === " ") {
        set(raster, source, "~");
        source = { x: source.x + 1, y: source.y };
    }
    //fill and backtrack
    let offset = -1;
    while (get(raster, {x: source.x + offset, y: source.x}) === " ") {

        offset -=1;
    }


    printMatrix(raster.map);
    return raster;
}

const test = () => {
    const inputLines = [
        "x=495, y=2..7",
        "y=7, x=495..501",
        "x=501, y=3..7",
        "x=498, y=2..4",
        "x=506, y=1..2",
        "x=498, y=10..13",
        "x=504, y=10..13",
        "y=13, x=498..504"
    ];
    const walls = inputLines.map(lineToWall);
    showInput(walls);
};

export const solution17_2018: Puzzle<Wall[], number> = {
    day: 172018,
    input: processInput,
    partOne,
    //    partTwo,
    resultOne,
    //    resultTwo,
    showInput,
    test,
}

