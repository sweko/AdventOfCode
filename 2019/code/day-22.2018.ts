import "../extra/array-helpers";
import { Puzzle } from "./model";
import { printMatrix } from "../extra/terminal-helper";
import { loopMatrix } from "../extra/aoc-helper";

interface Point {
    x: number;
    y: number;
}

interface Input {
    depth: number;
    target: Point;
}

const data = {
    modulo: 20183,
    xfactor: 16807,
    yfactor: 48271
}

const processInput = async (day: number) => {
    // return {
    //     depth: 510,
    //     target: {
    //         x: 10,
    //         y: 10
    //     }
    // };

    return {
        depth: 4080,
        target: {
            x: 14,
            y: 785
        }
    };

    // return {
    //     depth: 11820,
    //     target: {
    //         x: 7,
    //         y: 782
    //     }
    // }
};

const getType = (level: number) => level % 3;

const partOne = (input: Input, debug = false) => {
    const { depth, target } = input;
    const cave = Array(target.y + 1).fill(null).map(_ => Array(target.x + 1).fill(null));

    for (let xindex = 0; xindex <= input.target.x; xindex++) {
        for (let yindex = 0; yindex <= input.target.y; yindex++) {
            if ((xindex === 0) && (yindex === 0)) {
                cave[yindex][xindex] = depth % data.modulo;
                continue;
            }
            if ((xindex === target.x) && (yindex === target.y)) {
                cave[yindex][xindex] = depth % data.modulo;
                continue;
            }
            if (xindex === 0) {
                cave[yindex][xindex] = (yindex * data.yfactor + depth) % data.modulo;
                continue;
            }
            if (yindex === 0) {
                cave[yindex][xindex] = (xindex * data.xfactor + depth) % data.modulo;
                continue;
            }
            const geoIndex = cave[yindex - 1][xindex] * cave[yindex][xindex - 1];
            cave[yindex][xindex] = (geoIndex + depth) % data.modulo;
        }

    }

    if (debug) {
        printMatrix(cave, (level) => {
            const type = getType(level);
            return type === 0 ? "." : type === 1 ? "=" : type === 2 ? "|" : "X"
        })
    }

    return cave.sum(line => line.sum(item => getType(item)));
};

enum Equipment {
    //    None = 0,

    Torch = "torch",
    ClimbingGear = "climbing",
    Neither = "neither",

    // FullRocky = 3,
    // FullWet = 6,
    // FullNarrow = 5
}

type Terrain = "rocky" | "narrow" | "wet";
const terrains: Terrain[] = ["rocky", "wet", "narrow"];

// const allowed: { [key in Terrain]: Equipment } = {
//     rocky: Equipment.FullRocky,
//     wet: Equipment.FullWet,
//     narrow: Equipment.FullNarrow
// }

interface PricePoint {
    price: number;
    from: Point
}

interface Price {
    [Equipment.Torch]: PricePoint;
    [Equipment.ClimbingGear]: PricePoint;
    [Equipment.Neither]: PricePoint;
};

interface Cell extends Point {
    level: number,
    terrain: Terrain,
    price: Price
}

let markCount = 999999;
let markIndex = 0;

// const switchTool = (terrain: Terrain, current: Equipment) => {
//     const result = allowed[terrain] ^ current;
//     if (Equipment[result] === undefined) {
//         throw Error("Invalid call");
//     }
//     return result;
// }

const getTerrainType = (level: number) => terrains[level % 3];

// const canProceed = (terrain: Terrain, equipment: Equipment) => {
//     return (allowed[terrain] & equipment) !== 0;
// }

const getNeighbourPrice = (current: Cell, neighbour: Cell): Price => {
    // two cases, same terain, or different terrains
    if (current.terrain === neighbour.terrain) {
        // copy over and increase
        return {
            [Equipment.Neither]: {
                price: current.price[Equipment.Neither].price + 1,
                from: current
            },
            [Equipment.Torch]: {
                price: current.price[Equipment.Torch].price + 1,
                from: current
            },
            [Equipment.ClimbingGear]: {
                price: current.price[Equipment.ClimbingGear].price + 1,
                from: current
            }
        }
    } else {
        const forbiddenCurrent = Object.keys(current.price).find(key => isNaN(current.price[key].price)) as unknown as Equipment;
        const forbiddenNeighbour = Object.keys(neighbour.price).find(key => isNaN(neighbour.price[key].price)) as unknown as Equipment;

        const common = [Equipment.Neither, Equipment.Torch, Equipment.ClimbingGear]
            .find(item => item !== forbiddenCurrent && item !== forbiddenNeighbour)

        return {
            [common]: {
                price: current.price[common].price + 1,
                from: current
            },
            [forbiddenNeighbour]: {
                price: Number.NaN,
                from: undefined
            },
            [forbiddenCurrent]: {
                price: current.price[common].price + 8,
                from: current
            },
        } as unknown as Price;
    }
}

const partTwo = (input: Input, debug = false) => {
    // 1088 - incorrect
    // 1082 - incorrect
    // 1083 - incorrect
    // 1084 - 
    // 1085 - 
    // 1086 - incorrect
    // 1087 - incorrect (other data set)
    // { level: 4080, price: 1081, terrain: 'rocky', equipment: 2 }

    const { depth, target } = input;
    const extra = 50;
    const cave: Cell[][] = Array(target.y + 1 + extra).fill(null).map(_ => Array(target.x + 1 + extra).fill(null));

    // generate cave
    for (let xindex = 0; xindex <= input.target.x + extra; xindex++) {
        for (let yindex = 0; yindex <= input.target.y + extra; yindex++) {
            if ((xindex === 0) && (yindex === 0)) {
                cave[yindex][xindex] = {
                    level: depth % data.modulo, price: {
                        [Equipment.Torch]: {
                            price: 0,
                            from: undefined
                        },
                        [Equipment.ClimbingGear]: {
                            price: 7,
                            from: undefined
                        },
                        [Equipment.Neither]: {
                            price: Number.NaN,
                            from: undefined
                        },
                    }, terrain: "rocky",
                    x: yindex,
                    y: xindex
                };
                continue;
            } else if ((xindex === target.x) && (yindex === target.y)) {
                cave[yindex][xindex] = { level: depth % data.modulo, price: undefined, terrain: "rocky", x: yindex, y: xindex };
            } else if (xindex === 0) {
                cave[yindex][xindex] = { level: (yindex * data.yfactor + depth) % data.modulo, price: undefined, terrain: "rocky", x: yindex, y: xindex };
            } else if (yindex === 0) {
                cave[yindex][xindex] = { level: (xindex * data.xfactor + depth) % data.modulo, price: undefined, terrain: "rocky", x: yindex, y: xindex };
            } else {
                const geoIndex = cave[yindex - 1][xindex].level * cave[yindex][xindex - 1].level;
                cave[yindex][xindex] = { level: (geoIndex + depth) % data.modulo, price: undefined, terrain: "rocky", x: yindex, y: xindex };
            }
            const cell = cave[yindex][xindex];
            cell.terrain = getTerrainType(cell.level);
            cell.price = {
                [Equipment.Torch]: {
                    price: cell.terrain === "wet" ? Number.NaN : Number.POSITIVE_INFINITY,
                    from: undefined
                },
                [Equipment.ClimbingGear]: {
                    price: cell.terrain === "narrow" ? Number.NaN : Number.POSITIVE_INFINITY,
                    from: undefined
                },
                [Equipment.Neither]: {
                    price: cell.terrain === "rocky" ? Number.NaN : Number.POSITIVE_INFINITY,
                    from: undefined
                }
            }
        }
    }

    const marked: [number, number][] = [[0, 0]];
    const processNeighbour = (current: Cell, x: number, y: number) => {
        const neighbour = cave[x][y];
        const neighbourPrice = getNeighbourPrice(current, neighbour);
        let doMark = false;

        if (neighbourPrice[Equipment.Neither].price < neighbour.price[Equipment.Neither].price) {
            doMark = true;
            neighbour.price[Equipment.Neither] = neighbourPrice[Equipment.Neither];
        }

        if (neighbourPrice[Equipment.Torch].price < neighbour.price[Equipment.Torch].price) {
            doMark = true;
            neighbour.price[Equipment.Torch] = neighbourPrice[Equipment.Torch];
        }

        if (neighbourPrice[Equipment.ClimbingGear].price < neighbour.price[Equipment.ClimbingGear].price) {
            doMark = true;
            neighbour.price[Equipment.ClimbingGear] = neighbourPrice[Equipment.ClimbingGear];
        }

        if (doMark) {
            markIndex += 1;
            // this can be moved to priority queue, but brute force is fast enough
            marked.push([x, y]);
            
            if (debug && (markIndex % markCount === 0)) {
                console.log(`Marking from [${current.x}:${current.y}] cell [${x}:${y}] with price ${neighbour.price}`);
            }
        }
    }

    while (marked.length != 0) {
        const [x, y] = marked.shift();
        const current = cave[x][y];

        if (x !== input.target.y + extra) {
            processNeighbour(current, x + 1, y); //down
        }

        if (y !== input.target.x + extra) {
            processNeighbour(current, x, y + 1); //right
        }

        if (x !== 0) {
            processNeighbour(current, x - 1, y); //up
        }

        if (y != 0) {
            processNeighbour(current, x, y - 1); //left
        }
    }

    if (debug) {
        // printMatrix(cave, (level) => {
        //     return level.terrain === "rocky" ? "."
        //         : level.terrain === "wet" ? "="
        //             : level.terrain === "narrow" ? "|" : "X"
        // });

        // console.log("-----------");

        // printMatrix(cave, (level) => {
        //     return `${level.price}:${Equipment[level.equipment]}:${level.terrain}`+"\t"
        // });
    }

    const result = cave[target.y][target.x];
    if (debug) {
        console.log(result);
    }

    return result.price[Equipment.Torch].price;
};

const resultOne = (_: any, result: number) => {
    return `The total risk level is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The fastest way is ${result} minutes`;
};

const showInput = (input: Input) => {
    console.log(input);
};

const test = () => {

};


// 1093 - too high
export const solution22_2018: Puzzle<Input, number> = {
    day: 222018,
    input: processInput,
    partOne,
    partTwo,
    resultOne,
    resultTwo,
    showInput,
    test,
}


