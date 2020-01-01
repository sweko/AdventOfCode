import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { printMatrix } from "../extra/terminal-helper";

interface Point {
    x: number,
    y: number;
    state: State;
    name?: string;
    distance?: number;
}

enum State {
    Wall,
    Empty,
    Key,
    Door,
    Robot
}

interface Maze {
    cells: Point[][];
    keys: Point[];
    doors: Point[];
    robot: Point;
    path: string[];
    pathstr?: string;
    distance: number;
}

const processInput = async (day: number): Promise<Maze> => {
    const lines = await readInputLines(day);
    let robot: Point;
    const doors: Point[] = [];
    const keys: Point[] = [];
    const cells: Point[][] = lines.map((line, x) => line.split("").map((char, y) => {
        if (char === "#") return { x, y, state: State.Wall };
        if (char === ".") return { x, y, state: State.Empty };
        if (char === "@") {
            robot = { x, y, state: State.Robot, distance: 0 }
            return { x, y, state: State.Robot, distance: 0, name: "@" };
        }
        if (char === char.toLowerCase()) {
            keys.push({ x, y, state: State.Key, name: char })
            return { x, y, state: State.Key, name: char };
        }
        doors.push({ x, y, state: State.Door, name: char })
        return { x, y, state: State.Door, name: char };
    }));
    keys.sort((f, s) => f.name.localeCompare(s.name));
    doors.sort((f, s) => f.name.localeCompare(s.name));
    return { cells, keys, doors, robot, path: [], distance: 0 }
};

const checkNeighbour = (point: Point) => {
    if (point.state === State.Empty && point.distance === undefined) return { reachable: true };
    if (point.state === State.Key && point.distance === undefined) return { reachable: true, key: point.name };
    return { reachable: false };
}

const floodFill = (maze: Maze) => {
    const active = [maze.robot];
    const distances: Point[] = [];
    while (active.length > 0) {
        const current = active.shift();

        let neighbour = maze.cells[current.x - 1][current.y];
        const up = checkNeighbour(neighbour);
        if (up.reachable) {
            neighbour.distance = current.distance + 1;
            if (up.key) {
                distances.push(neighbour);
            } else {
                active.push(neighbour)
            }
        }

        neighbour = maze.cells[current.x + 1][current.y];
        const down = checkNeighbour(neighbour);
        if (down.reachable) {
            neighbour.distance = current.distance + 1;
            if (down.key) {
                distances.push(neighbour);
            } else {
                active.push(neighbour)
            }
        }

        neighbour = maze.cells[current.x][current.y - 1];
        const left = checkNeighbour(neighbour);
        if (left.reachable) {
            neighbour.distance = current.distance + 1;
            if (left.key) {
                distances.push(neighbour);
            } else {
                active.push(neighbour)
            }
        }

        neighbour = maze.cells[current.x][current.y + 1];
        const right = checkNeighbour(neighbour);
        if (right.reachable) {
            neighbour.distance = current.distance + 1;
            if (right.key) {
                distances.push(neighbour);
            } else {
                active.push(neighbour)
            }
        }
    }
    return distances;
}

const distanceCache = {};
const fullCache = {};

const moveRobot = (maze: Maze, destination: Point) => {

    const spath = destination.name.toUpperCase() + maze.path.slice().sort().join("");
    const cacheValue = fullCache[spath];

    if (cacheValue && cacheValue < destination.distance) {
        // console.log(`Found cache value for ${maze.pathstr}, i.e. ${spath} with value ${cacheValue}`);
        // console.log(`  Current distance is ${destination.distance}`);

        return undefined;
    }

    fullCache[spath] = destination.distance;

    if (destination.state !== State.Key) {
        throw Error("Destination is not a key")
    }
    const result: Maze = {
        distance: maze.distance,
        path: maze.path.slice(),
        doors: maze.doors.map(d => ({ x: d.x, y: d.y, name: d.name, state: State.Door })),
        keys: maze.keys.map(k => ({ x: k.x, y: k.y, name: k.name, state: State.Key })),
        cells: maze.cells.map(row => row.map(p => (({ x: p.x, y: p.y, name: p.name, state: p.state })))),
        robot: undefined
    }
    // set the distance
    result.distance = destination.distance;
    // add the destination to the path
    result.path.push(destination.name);
    result.pathstr = result.path.join("");

    // remove the taken key from the available keys
    result.keys = [...result.keys.filter(k => k.name !== destination.name)];

    // move the robot to the key position
    result.robot = {
        state: State.Robot,
        x: destination.x,
        y: destination.y,
        distance: result.distance,
        name: "@"
    };
    result.cells[destination.x][destination.y] = result.robot;

    // remove the old robot
    result.cells[maze.robot.x][maze.robot.y] = {
        x: maze.robot.x,
        y: maze.robot.y,
        state: State.Empty
    };

    // remove the door from the maze and the doors collection
    const door = result.doors.find(d => d.name === destination.name.toUpperCase());
    // console.log("Door is", door);
    result.doors = [...result.doors.filter(d => d !== door)];
    if (door) {
        result.cells[door.x][door.y] = {
            x: door.x,
            y: door.y,
            state: State.Empty
        };
    }

    return result;
}

const partOne = (input: Maze, debug: boolean) => {
    let mazes = [input];

    let minPath = Number.POSITIVE_INFINITY;

    let runs = 0;

    while (mazes.length) {
        runs += 1;
        const maze = mazes.shift();
        // printMatrix(maze.cells, point => point.name || (point.state === State.Empty ? "." : "#"));
        // console.log(maze.distance);

        let reachable = floodFill(maze);
        // console.log(reachable);

        const descendants = reachable.map(key => moveRobot(maze, key))
            .filter(m => m)
            .filter(m => m.distance < minPath);
        const finished = descendants.filter(m => m.keys.length === 0);
        const unfinished = descendants.filter(m => m.keys.length !== 0);
        for (const m of finished) {
            distanceCache[m.pathstr] = m.distance;
        }
        minPath = Object.values(distanceCache).min();
        for (const maze of finished) {
            console.log(maze.pathstr, maze.distance, minPath, "\u001b[K");
        }
        if (runs % 1237 === 123) {
            console.log("Current run: ", runs, " current path: ", maze.pathstr, "\u001b[K");
            console.log("\u001b[2A");
        }

        mazes.push(...unfinished);
        mazes.sort((f, s) => f.pathstr.localeCompare(s.pathstr));
        // if (mazes.length % 1234 === 123) {
        //     console.log(mazes.length);
        //     console.log(mazes[0].path.join());
        // }

        // console.log("--------------");
    }

    // for (const maze of distances) {
    //     console.log(maze.path.join(""), maze.distance);
    // }
    console.log("Total runs:", runs)
    return minPath;
};

const partTwo = (input: Maze, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    return 0;
};

const resultOne = (_: any, result: number) => {
    return `Minimal steps to collect all keys are ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The period of the orbit is ${result}`;
};

const showInput = (input: Maze) => {
    console.log(input);
};

const test = (_: Maze) => {
    console.log("----Test-----");
};

export const solution18: Puzzle<Maze, number> = {
    day: 18,
    input: processInput,
    partOne,
    //partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
