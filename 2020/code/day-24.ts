import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { Hash } from "../extra/hash-helpers";

type Direction = "east" | "west" | "north-east" | "north-west" | "south-east" | "south-west";
type Coords = {
    x: number;
    y: number;
    z: number;
}

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    return input.map(line => {
        const result: Direction[] = [];
        while (line !== "") {
            if (line.startsWith("e")) {
                result.push("east");
                line = line.slice(1);
            }
            if (line.startsWith("w")) {
                result.push("west");
                line = line.slice(1);
            }
            if (line.startsWith("ne")) {
                result.push("north-east");
                line = line.slice(2);
            }
            if (line.startsWith("nw")) {
                result.push("north-west");
                line = line.slice(2);
            }
            if (line.startsWith("se")) {
                result.push("south-east");
                line = line.slice(2);
            }
            if (line.startsWith("sw")) {
                result.push("south-west");
                line = line.slice(2);
            }
        }
        return result;
    });
};

const moves: {[key in Direction]: (coord: Coords) => Coords} = {
    "east": (coord) => ({
        x: coord.x + 1,
        y: coord.y - 1,
        z: coord.z
    }),
    "west": (coord) => ({
        x: coord.x - 1,
        y: coord.y + 1,
        z: coord.z
    }),
    "north-east": (coord) => ({ 
        x: coord.x + 1,
        y: coord.y,
        z: coord.z - 1
    }),
    "south-west": (coord) => ({ 
        x: coord.x - 1,
        y: coord.y,
        z: coord.z + 1
    }),
    "north-west": (coord) => ({ 
        x: coord.x,
        y: coord.y + 1,
        z: coord.z - 1
    }),
    "south-east": (coord) => ({ 
        x: coord.x,
        y: coord.y - 1,
        z: coord.z + 1
    }),
}

const partOne = (input: Direction[][], debug: boolean) => {
    const origin: Coords = {
        x: 0,
        y: 0,
        z: 0
    };
    const state: {[key:string]: boolean} = {};
    for (const tilePath of input) {
        let location = origin;
        for (const direction of tilePath) {
            location = moves[direction](location);
        }
        const key = `${location.x}:${location.y}:${location.z}`;
        if (state[key]) {
            state[key] = false;
        } else {
            state[key] = true;
        };
    }

    const result = Object.keys(state).map(key => state[key]).filter(item => item).length;

    return result;
};

const getNeighbourKeys = ({x, y, z}:Coords):string[] => {
    return [
        `${x}:${y+1}:${z-1}`,
        `${x}:${y-1}:${z+1}`,
        `${x+1}:${y}:${z-1}`,
        `${x-1}:${y}:${z+1}`,
        `${x+1}:${y-1}:${z}`,
        `${x-1}:${y+1}:${z}`
    ]
}

const getNextState = (state: Hash<boolean>): Hash<boolean> => {
    const result: Hash<boolean> = {};

    for (const key in state) {
        const parts = key.split(":");
        const coords = {
            x: +parts[0],
            y: +parts[1],
            z: +parts[2],
        };
        const around = getNeighbourKeys(coords);

        const blacks = around.map(key => state[key]).filter(value => value).length;
        if (state[key]) {
            if ((blacks === 1) || (blacks === 2)) {
                result[key] = true;
            }
        } else {
            if (blacks === 2) {
                result[key] = true;
            }
        }

        if (result[key]) {
            for (const nkey of around) {
                result[nkey] = result[nkey] || false;
            }
        }
    }

    return result;
}

const partTwo = (input: Direction[][], debug: boolean) => {
    const origin: Coords = {
        x: 0,
        y: 0,
        z: 0
    };
    let state: Hash<boolean> = {};
    for (const tilePath of input) {
        let location = origin;
        for (const direction of tilePath) {
            location = moves[direction](location);
        }
        const key = `${location.x}:${location.y}:${location.z}`;
        if (state[key]) {
            state[key] = false;
        } else {
            state[key] = true;
        };
        const around = getNeighbourKeys(location);
        for (const nkey of around) {
            state[nkey] = state[nkey] || false;
        }
    }

    for (let index = 0; index < 100; index +=1) {
        state = getNextState(state);
        // const result = Object.keys(state).map(key => state[key]).filter(item => item).length;
        // console.log(result);
    }
    const result = Object.keys(state).map(key => state[key]).filter(item => item).length;
    return result;
};

const resultOne = (_: any, result: number) => {
    return `Total flipped tiles are ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Total flipped tiles are ${result}`;
};

const showInput = (input: Direction[][]) => {
    console.log(input);
};

const test = (_: Direction[][]) => {
    console.log("----Test-----");
};

export const solutionTwentyFour: Puzzle<Direction[][], number> = {
    day: 24,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
