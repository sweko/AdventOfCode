import { readInputLines, loopMatrix } from "../extra/aoc-helper";
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
    const minX = walls.min(wall => wall.x.from) - 2;
    const maxX = walls.max(wall => wall.x.to) + 1 - minX + 1;
    const maxY = walls.max(wall => wall.y.to);
    const minY = walls.min(wall => wall.y.from);

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
        map: map.slice(minY - 1),
        source: 500 - minX
    };
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);

    const walls = lines.map(lineToWall);
    const raster = wallToRaster(walls);
    return raster;
};

const partOne = (raster: Raster, debug = false) => {
    let source = { x: 0, y: raster.source };
    runSource(raster, source);
    // if (debug) {
    //     printMatrix(raster.map);
    // }
    let count = 0;
    loopMatrix(raster.map, (_, __, element) => {
        if (element === "~") {
            count += 1;
        }
    })
    return count;
};

const partTwo = (raster: Raster, debug = false) => {
    let source = { x: 0, y: raster.source };
    runSource(raster, source);
    loopMatrix(raster.map, (x, y, element) => {
        if (element === "~") {
            let pos = {x, y};
            while (get(raster, pos)==="~") pos = left(pos);
            if (get(raster, pos) !== "#") {
                set(raster, {x, y}, " ");
                return;
            }
            pos = {x, y};
            while (get(raster, pos)==="~") pos = right(pos);
            if (get(raster, pos) !== "#") {
                set(raster, {x, y}, " ");
                return;
            }
        }
    });

    loopMatrix(raster.map, (x, y, element) => {
        if (element === "~") {
            let pos = {x, y};
            while (get(raster, pos)==="~") pos = below(pos);
            if (get(raster, pos) !== "#") {
                set(raster, {x, y}, " ");
                return;
            }
        }
    });

    if (debug) {
        printMatrix(raster.map);
    }
    let count = 0;
    loopMatrix(raster.map, (_, __, element) => {
        if (element === "~") {
            count += 1;
        }
    })
    return count;
};

const resultOne = (_: any, result: number) => {
    return `Total number of wet fields is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    // 27084 - too high
    // 16 points at loc 322 identified
    // Answer is 27068
    return `Total number of water fields is ${result}`;
};

const showInput = (_:any) => {
};

const get = (raster: Raster, source: Point) => {
    return raster.map[source.x][source.y];
}

const set = (raster: Raster, source: Point, value: string, force = false) => {
    raster.map[source.x][source.y] = value;
}

const below = (point: Point) => ({ x: point.x + 1, y: point.y });
const above = (point: Point) => ({ x: point.x - 1, y: point.y });
const left = (point: Point) => ({ x: point.x, y: point.y - 1 });
const right = (point: Point) => ({ x: point.x, y: point.y + 1 });

const runSource = (raster: Raster, source: { x: number; y: number; }, level = 0) => {
    if (get(raster, below(source)) === "~") {
        return;
    }
    while (get(raster, source) === " ") {
        set(raster, source, "~");
        source = below(source);
        if (source.x === raster.map.length) {
            //console.log("GLU GLU");
            return;
        }
    }
    if (get(raster, source) === "~") {
        //test left (should be water with air above until wall);
        let current = left(source);
        while (get(raster, current) === "~") {
            current = left(current)
        }
        if (get(raster, current) !== "#") {
            return;
        }
        current = right(source);
        while (get(raster, current) === "~") {
            current = right(current)
        }
        if (get(raster, current) !== "#") {
            return;
        }
    }
    source = above(source);
    let isInContainer = true;
    let lsource = null, rsource = null;
    //fill and backtrack
    while (isInContainer) {
        set(raster, source, "~");
        //fill left and right
        let current = left(source);
        while (["#", "~"].includes(get(raster, below(current))) && [" ", "~"].includes(get(raster, current))) {
            set(raster, current, "~");
            current = left(current);
        }
        if (get(raster, below(current)) === " ") {
            isInContainer = false;
            lsource = current;
        }

        current = right(source);
        while (["#", "~"].includes(get(raster, below(current))) && [" ", "~"].includes(get(raster, current))) {
            set(raster, current, "~");
            current = right(current);
        }
        if (get(raster, below(current)) === " ") {
            isInContainer = false;
            rsource = current;
        }
        if (lsource) {
            //console.log("running left", lsource, level);
            runSource(raster, lsource, level + 1);
        }
        if (rsource) {
            //console.log("running right", rsource, level, "-->", lsource);
            runSource(raster, rsource, level + 1);
        }
        source = above(source);
    }
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

export const solution17_2018: Puzzle<Raster, number> = {
    day: 172018,
    input: processInput,
    partOne,
    partTwo,
    resultOne,
    resultTwo,
    showInput,
    test,
}


