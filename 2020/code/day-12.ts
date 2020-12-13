import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

type Side = "N" | "S" | "W" | "E";

const sides = ['N', 'E', 'S', 'W', 'N', 'E', 'S'];

type Direction = "L" | "R"

type Forward = "F"

type Command = Side | Direction | Forward;

interface Move {
    kind: Command;
    value: number;
}

interface Location {
    x: number,
    y: number
}

interface Ship {
    location: Location,
    facing: Side
}

interface Ship2 {
    location: Location;
    waypoint: Location;
}

const leftToRight = (value: 90 | 180 | 270) => 360-value;

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    const regex = /^(W|N|E|S|L|R|F)(\d+)$/
    return input.map(line => {
        const match = line.match(regex);
        return {
            kind: match[1] as Command,
            value: +match[2]
        };
    });
};

const moveEast = ({location: {x, y}, facing}: Ship, value: number): Ship => ({location: {x: x+value, y}, facing });
const moveWest = ({location: {x, y}, facing}: Ship, value: number): Ship => ({location: {x: x-value, y}, facing });
const moveNorth = ({location: {x, y}, facing}: Ship, value: number): Ship => ({location: {x, y: y+value}, facing });
const moveSouth = ({location: {x, y}, facing}: Ship, value: number): Ship => ({location: {x, y: y-value}, facing });

const movesOne: {[key: string]: (ship: Ship, value: number)=>Ship} = {
    'W': moveWest,
    'E': moveEast,
    'N': moveNorth,
    'S': moveSouth,
    'L': (ship:Ship, value:number) => {
        value = leftToRight(value as 90|180|270);
        return movesOne['R'](ship, value);
    },
    'R': (ship:Ship, value:number) => {
        const facingIndex = sides.indexOf(ship.facing);
        const newFacing = sides[facingIndex + (value / 90)] as Side;
        return {
            ...ship,
            facing: newFacing
        }
    },
    'F': (ship:Ship, value:number) => movesOne[ship.facing](ship, value)
}

const partOne = (input: Move[], debug: boolean) => {
    let ship: Ship = { 
        location: {x:0, y:0},
        facing: "E"
    }

    for (const move of input) {
        ship = movesOne[move.kind](ship, move.value);
    }

    return Math.abs(ship.location.x) + Math.abs(ship.location.y);
};


const movesTwo: {[key: string]: (ship: Ship2, value: number)=>Ship2} = {
    'W': (ship: Ship2, value: number) => {
        return {
            ...ship,
            waypoint: {
                ...ship.waypoint,
                x: ship.waypoint.x - value,
            }
        };
    },
    'E': (ship: Ship2, value: number) => {
        return {
            ...ship,
            waypoint: {
                ...ship.waypoint,
                x: ship.waypoint.x + value,
            }
        };
    },
    'N': (ship: Ship2, value: number) => {
        return {
            ...ship,
            waypoint: {
                ...ship.waypoint,
                y: ship.waypoint.y + value,
            }
        };
    },
    'S': (ship: Ship2, value: number) => {
        return {
            ...ship,
            waypoint: {
                ...ship.waypoint,
                y: ship.waypoint.y - value,
            }
        };
    },
    'L': (ship: Ship2, value: number) => {
        value = leftToRight(value as 90|180|270);
        return movesTwo['R'](ship, value);
    },
    'R': (ship: Ship2, value: number) => {
        if (value === 90) {
            return {
                ...ship,
                waypoint: {
                    x: ship.waypoint.y,
                    y: -ship.waypoint.x
                }
            }
        }
        if (value === 180) {
            return {
                ...ship,
                waypoint: {
                    x: -ship.waypoint.x,
                    y: -ship.waypoint.y
                }
            }
        }
        if (value === 270) {
            return {
                ...ship,
                waypoint: {
                    x: -ship.waypoint.y,
                    y: ship.waypoint.x
                }
            }
        }
        throw Error("NE MOZHE");
    },
    'F': (ship:Ship2, value:number) => {
        return {
            ...ship,
            location: {
                x: ship.location.x + value * ship.waypoint.x,
                y: ship.location.y + value * ship.waypoint.y,
            }
        }
    }
}


const partTwo = (input: Move[], debug: boolean) => {
    let ship: Ship2 = { 
        location: {x:0, y:0},
        waypoint: {x: 10, y: 1}
    }

    for (const move of input) {
        ship = movesTwo[move.kind](ship, move.value);
        //console.log(ship);
    }

    return Math.abs(ship.location.x) + Math.abs(ship.location.y);
};

const result = (_: any, result: number) => {
    return `The distance of the ship is ${result}`;
};

const showInput = (input: Move[]) => {
    console.log(input);
};

const test = (_: Move[]) => {
    console.log("----Test-----");
};

export const solutionTwelve: Puzzle<Move[], number> = {
    day: 12,
    input: processInput,
    partOne,
    partTwo,
    resultOne: result,
    resultTwo: result,
    showInput,
    test,
}
