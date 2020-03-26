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
    None = 0,
    Torch = 1,
    ClimbingGear = 2,
    Neither = 4,

    FullRocky = 3,
    FullWet = 6,
    FullNarrow = 5
}

type Terrain = "rocky" | "narrow" | "wet";
const terrains: Terrain[] = ["rocky", "wet", "narrow"];

const allowed: { [key in Terrain]: Equipment } = {
    rocky: Equipment.FullRocky,
    wet: Equipment.FullWet,
    narrow: Equipment.FullNarrow
}

interface Cell {
    level: number,
    terrain: Terrain,
    price: number,
    equipment?: Equipment
}

let markCount = 1234;
let markIndex = 0;

const switchTool = (terrain: Terrain, current: Equipment) => {
    const result = allowed[terrain] ^ current;
    // if (markIndex % markCount === 0) {
    //     console.log(`switching from ${Equipment[current]} to ${Equipment[result]}`);
    // }
    if (Equipment[result]===undefined) {
        throw Error("Invalid call");
    }
    return result;
}

const getTerrainType = (level: number) => terrains[level % 3];

const canProceed = (terrain: Terrain, equipment: Equipment ) => {
    return (allowed[terrain] & equipment) !== 0;
}

const partTwo = (input: Input, debug = false) => {
    const { depth, target } = input;
    const extra = 50;
    const cave: Cell[][] = Array(target.y + 1 + extra).fill(null).map(_ => Array(target.x + 1 + extra).fill(null));

    // generate cave
    for (let xindex = 0; xindex <= input.target.x + extra; xindex++) {
        for (let yindex = 0; yindex <= input.target.y + extra; yindex++) {
            if ((xindex === 0) && (yindex === 0)) {
                cave[yindex][xindex] = { level: depth % data.modulo, price: 0, terrain: "rocky", equipment: Equipment.Torch };
            } else if ((xindex === target.x) && (yindex === target.y)) {
                cave[yindex][xindex] = { level: depth % data.modulo, price: Number.POSITIVE_INFINITY, terrain: "rocky", equipment: Equipment.None };
            } else if (xindex === 0) {
                cave[yindex][xindex] = { level: (yindex * data.yfactor + depth) % data.modulo, price: Number.POSITIVE_INFINITY, terrain: "rocky", equipment: Equipment.None };
            } else if (yindex === 0) {0
                cave[yindex][xindex] = { level: (xindex * data.xfactor + depth) % data.modulo, price: Number.POSITIVE_INFINITY, terrain: "rocky", equipment: Equipment.None };
            } else {
                const geoIndex = cave[yindex - 1][xindex].level * cave[yindex][xindex - 1].level;
                cave[yindex][xindex] = { level: (geoIndex + depth) % data.modulo, price: Number.POSITIVE_INFINITY, terrain: "rocky", equipment: Equipment.None };
            }
            cave[yindex][xindex].terrain = getTerrainType(cave[yindex][xindex].level);
        }
    }

    const marked: [number, number][] = [[0, 0]];
    const processNeighbour = (current: Cell, x: number, y: number) => {
        const neighbour = cave[x][y];
        if (neighbour.price <= current.price) {
            return;
        }
        const isToolApplicable = canProceed(neighbour.terrain, current.equipment)
        let price: number, equipment: Equipment;

        if (isToolApplicable) {
            price = current.price + 1;
            equipment = current.equipment;
        } else {
            price = current.price + 8;
            equipment = switchTool(current.terrain, current.equipment);
        }

        if (neighbour.price > price) {
            neighbour.price = price;
            neighbour.equipment = equipment & allowed[neighbour.terrain];
            markIndex += 1;
            if (markIndex % markCount === 0) {
                console.log(`Marking cell [${x}:${y}] with equipment ${Equipment[equipment]} and price ${price}`);
            }
            marked.push([x, y]);
        } else if (neighbour.price === price) {
            const changedEquipement = (neighbour.equipment | equipment) & allowed[neighbour.terrain];
            if (neighbour.equipment !== changedEquipement) {
                markIndex += 1;
                if (markIndex % markCount === 0) {
                    console.log(`Marking cell [${x}:${y}] with equipment ${Equipment[equipment]} and price ${price}`);
                    console.log(`    changing ${Equipment[neighbour.equipment]}  to ${Equipment[(neighbour.equipment | equipment) & allowed[neighbour.terrain]]}`);
                }
                neighbour.equipment = changedEquipement;
                marked.push([x, y]);
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

    console.log(cave[target.y][target.x]);
    console.log(Equipment[cave[target.y][target.x].equipment])

    return -1;
};

const resultOne = (_: any, result: number) => {
    return `The total risk level is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The total risk level + 100 is ${result}`;
};

const showInput = (input: Input) => {
    console.log(input);
};

const test = () => {
    // switch tool tests
    console.log("--switch tool tests--");

    console.log(Equipment[switchTool("narrow", Equipment.FullRocky)]);


    console.log(Equipment[switchTool("narrow", Equipment.Neither)]===Equipment[Equipment.Torch]);
    console.log(Equipment[switchTool("narrow", Equipment.Torch)]===Equipment[Equipment.Neither]);
    try {
        switchTool("narrow", Equipment.ClimbingGear);
    } catch (e) {
        console.log(e.message === "Invalid call");
    }

    console.log(Equipment[switchTool("rocky", Equipment.ClimbingGear)]===Equipment[Equipment.Torch]);
    console.log(Equipment[switchTool("rocky", Equipment.Torch)]===Equipment[Equipment.ClimbingGear]);
    try {
        switchTool("rocky", Equipment.Neither);
    } catch (e) {
        console.log(e.message === "Invalid call");
    }

    console.log(Equipment[switchTool("wet", Equipment.Neither)]===Equipment[Equipment.ClimbingGear]);
    console.log(Equipment[switchTool("wet", Equipment.ClimbingGear)]===Equipment[Equipment.Neither]);
    try {
        switchTool("wet", Equipment.Torch);
    } catch (e) {
        console.log(e.message === "Invalid call");
    }

    //can proceed tests
    console.log("--can proceed tests--");
    console.log(canProceed("rocky", Equipment.ClimbingGear));
    console.log(canProceed("rocky", Equipment.Neither));
    console.log(canProceed("rocky", Equipment.Torch));
    console.log(canProceed("rocky", Equipment.FullNarrow));
    console.log(canProceed("rocky", Equipment.FullRocky));
    console.log(canProceed("rocky", Equipment.FullWet));
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


