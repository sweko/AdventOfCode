import { readInputLines, loopMatrix } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { printMatrix } from "../extra/terminal-helper";

interface Image {
    width: number;
    height: number;
    data: string[][];
    asteroids: Point[];
}

interface Point {
    x: number;
    y: number;
}

function linesToImage(input: string[]) {
    const width = input[0].length;
    const height = input.length;
    const data = input.map(line => line.split(""));
    const asteroids: Point[] = [];
    loopMatrix(data, (x, y, element) => {
        if (element === "#") {
            asteroids.push({ x, y });
        }
    });
    return {
        width,
        height,
        data,
        asteroids
    };
}

const processInput = async (day: number): Promise<Image> => {
    const input = await readInputLines(day);
    return linesToImage(input);
};

const getOffset = (first: Point, second: Point): Point => ({
    x: second.x - first.x,
    y: second.y - first.y
})

const calcRatio = (point: Point) => point.x / point.y;

const calcRatioString = (point: Point) => {
    const ratio = calcRatio(point);
    if (point.x === 0) {
        const ydir = point.y / Math.abs(point.y);
        return `${ydir}:${ratio}`;
    }
    const xdir = point.x / Math.abs(point.x);
    return `${xdir}:${ratio}`;
}

const partOne = (image: Image, debug = false) => {
    const results = [];
    loopMatrix(image.data, (row, column, element) => {
        if (element === ".") {
            return;
        }
        const loc = { x: row, y: column };
        const offsets = image.asteroids
            .map(ast => getOffset(loc, ast))
            .filter(offset => !isNaN(calcRatio(offset)))
            .groupBy(offset => calcRatioString(offset))
            .length;
        results.push(offsets);
    });
    if (debug) {
        //printMatrix(result, (item) => item === 0 ? "." : item.toString());
    }
    return results.max();
};

const distance = (point: Point) => Math.abs(point.x) + Math.abs(point.y);

const calcQuadrant = (point: Point) => {
    if (point.x < 0 && point.y >= 0) return 1;
    if (point.x >= 0 && point.y > 0) return 2;
    if (point.x > 0 && point.y <= 0) return 3;
    if (point.x <= 0 && point.y < 0) return 4;
}

const partTwo = (image: Image, debug = false) => {
    // part one
    const result = image.data.map(line => line.map(_ => 0));
    loopMatrix(image.data, (row, column, element) => {
        if (element === ".") {
            return;
        }
        const loc = { x: row, y: column };
        const offsets = image.asteroids
            .map(ast => getOffset(loc, ast))
            .filter(offset => !isNaN(calcRatio(offset)))
            .groupBy(offset => calcRatioString(offset))
            .length;
        result[row][column] = offsets;
    });
    let max = 0;
    let origin = { x: 0, y: 0 };
    loopMatrix(result, (x, y, element) => {
        if (element > max) {
            max = element;
            origin = { x, y };
        }
    });

    const asteroidGroups = image.asteroids.map(ast => ({
        ...ast,
        offset: getOffset(origin, ast),
        ratio: calcRatio(getOffset(origin, ast)),
        quadrant: calcQuadrant(getOffset(origin, ast))
    })).filter(ast => !isNaN(ast.ratio))
        .sort((f, s) => {
            // quadrant
            if (f.quadrant > s.quadrant) return 1;
            if (f.quadrant < s.quadrant) return -1;
            // ratio
            if (f.ratio > s.ratio) return 1;
            if (f.ratio < s.ratio) return -1;
            //distance
            if (distance(f.offset) > distance(s.offset)) return 1;
            if (distance(f.offset) < distance(s.offset)) return -1;
            return 0;
        })
        .groupBy(
            ast => ({ quadrant: ast.quadrant, ratio: ast.ratio }),
            (first, second) => first.ratio === second.ratio && first.quadrant === second.quadrant
        );

    let index = 0;
    while (asteroidGroups.sum(ag => ag.items.length) !== 0) {
        for (const agroup of asteroidGroups) {
            if (agroup.items.length === 0) {
                continue;
            }
            index += 1;
            if (index === 200) {
                return agroup.items[0].y * 100 + agroup.items[0].x;
            }
            agroup.items.splice(0, 1);
        }
    }

    return -1;
};

const resultOne = (_: any, result: number) => {
    return `Maximum number of asteroids detected is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Coordinates of the 200th destruction are ${result}`;
};

const showInput = (image: Image) => {
    printMatrix(image.data)
    console.log(image.asteroids);
};

const test = (input: Image) => {
    const image = linesToImage(`.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`.split("\n"));
    //console.log(partOne(image));
    console.log(partTwo(image, true));
};

export const solutionTen: Puzzle<Image, number> = {
    day: 10,
    input: processInput,
    partOne,
    partTwo,
    resultOne,
    resultTwo,
    showInput,
    test,
}


