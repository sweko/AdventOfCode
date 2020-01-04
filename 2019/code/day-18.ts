import { readInputLines, readInput, debugLog } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { printMatrix } from "../extra/terminal-helper";

type Quadrant = "top-left" | "top-right" | "botton-left" | "bottom-right";

interface Point {
    x: number,
    y: number;
    state: State;
    name?: string;
    distance?: number;
    quadrant?: Quadrant
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

interface MazeTwo {
    cells: Point[][];
    keys: Point[];
    doors: Point[];
    robots: Point[];
    path: string[];
    pathstr?: string;
    distance: number;
    origin: { x: number, y: number };
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
        // shortcut calculations if there is better
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
    result.doors = [...result.doors.filter(d => d !== door)];

    // we might have a key without a door
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

        const descendants = floodFill(maze).map(key => moveRobot(maze, key)).filter(m => m).filter(m => m.distance < minPath);
        const finished = descendants.filter(m => m.keys.length === 0);
        const unfinished = descendants.filter(m => m.keys.length !== 0);
        for (const m of finished) {
            distanceCache[m.pathstr] = m.distance;
        }
        minPath = Object.values(distanceCache).min();
        for (const m of finished) {
            debugLog(debug, m.pathstr, m.distance, minPath, "\u001b[K");
        }
        if (runs % 1237 === 123) {
            debugLog(debug, "Current run: ", runs, " current path: ", maze.pathstr, "\u001b[K");
            debugLog(debug, "\u001b[2A");
        }

        mazes.push(...unfinished);
        mazes.sort((f, s) => f.pathstr.localeCompare(s.pathstr));
    }
    return minPath;
};

const floodFillTwo = (maze: MazeTwo) => {
    const active = [...maze.robots];
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

const distanceCacheTwo = {};
const fullCacheTwo = {};

const moveRobotTwo = (maze: MazeTwo, destination: Point) => {

    const spath = destination.name.toUpperCase() + maze.path.slice().sort().join("");
    const cacheValue = fullCacheTwo[spath];

    if (cacheValue && cacheValue < destination.distance) {
        // shortcut calculations if there is better
        return undefined;
    }

    fullCacheTwo[spath] = destination.distance;

    if (destination.state !== State.Key) {
        throw Error("Destination is not a key")
    }
    const result: MazeTwo = {
        distance: destination.distance,
        path: maze.path.slice(),
        doors: maze.doors.map(d => ({ x: d.x, y: d.y, name: d.name, state: State.Door })),
        keys: maze.keys.map(k => ({ x: k.x, y: k.y, name: k.name, state: State.Key })),
        cells: maze.cells.map(row => row.map(p => (({ x: p.x, y: p.y, name: p.name, state: p.state })))),
        robots: maze.robots.map(r => ({ x: r.x, y: r.y, name: r.name, state: State.Robot, quadrant: r.quadrant, distance: destination.distance })),
        origin: maze.origin
    }

    // add the destination to the path
    result.path.push(destination.name);
    result.pathstr = result.path.join("");

    // remove the taken key from the available keys
    result.keys = [...result.keys.filter(k => k.name !== destination.name)];

    // which robot?

    let quadrant: Quadrant;
    if (destination.x > result.origin.x) {
        if (destination.y > result.origin.y)
            quadrant = "bottom-right";
        else
            quadrant = "botton-left";
    } else {
        if (destination.y > result.origin.y)
            quadrant = "top-right";
        else
            quadrant = "top-left";
    };
    const robot = result.robots.find(r => r.quadrant === quadrant);
    // remove the old robot
    result.cells[robot.x][robot.y] = {
        x: robot.x,
        y: robot.y,
        state: State.Empty
    };

    // move the correct robot to the key position
    robot.x = destination.x;
    robot.y = destination.y;
    result.cells[destination.x][destination.y] = robot;

    // remove the door from the maze and the doors collection
    const door = result.doors.find(d => d.name === destination.name.toUpperCase());
    result.doors = [...result.doors.filter(d => d !== door)];

    // we might have a key without a door
    if (door) {
        result.cells[door.x][door.y] = {
            x: door.x,
            y: door.y,
            state: State.Empty
        };
    }

    return result;
}

const partTwo = (input: Maze, debug: boolean) => {
    //#region maze transformation
    const maze: MazeTwo = {
        distance: 0,
        path: [],
        doors: input.doors.map(d => ({ x: d.x, y: d.y, name: d.name, state: State.Door })),
        keys: input.keys.map(k => ({ x: k.x, y: k.y, name: k.name, state: State.Key })),
        cells: input.cells.map(row => row.map(p => (({ x: p.x, y: p.y, name: p.name, state: p.state })))),
        robots: [],
        origin: { x: input.robot.x, y: input.robot.y }
    }
    maze.cells[input.robot.x + 1][input.robot.y] = { x: input.robot.x + 1, y: input.robot.y, state: State.Wall };
    maze.cells[input.robot.x - 1][input.robot.y] = { x: input.robot.x - 1, y: input.robot.y, state: State.Wall };
    maze.cells[input.robot.x][input.robot.y + 1] = { x: input.robot.x, y: input.robot.y + 1, state: State.Wall };
    maze.cells[input.robot.x][input.robot.y - 1] = { x: input.robot.x, y: input.robot.y - 1, state: State.Wall };
    maze.cells[input.robot.x][input.robot.y] = { x: input.robot.x, y: input.robot.y, state: State.Wall };

    maze.robots.push(
        { x: input.robot.x + 1, y: input.robot.y + 1, state: State.Robot, name: "@", distance: 0, quadrant: "bottom-right" },
        { x: input.robot.x + 1, y: input.robot.y - 1, state: State.Robot, name: "@", distance: 0, quadrant: "botton-left" },
        { x: input.robot.x - 1, y: input.robot.y + 1, state: State.Robot, name: "@", distance: 0, quadrant: "top-right" },
        { x: input.robot.x - 1, y: input.robot.y - 1, state: State.Robot, name: "@", distance: 0, quadrant: "top-left" }
    )
    maze.cells[input.robot.x + 1][input.robot.y + 1] = maze.robots[0];
    maze.cells[input.robot.x + 1][input.robot.y - 1] = maze.robots[1];
    maze.cells[input.robot.x - 1][input.robot.y + 1] = maze.robots[2];
    maze.cells[input.robot.x - 1][input.robot.y - 1] = maze.robots[3];
    //#endregion

    const mazes = [maze];

    let minPath = Number.POSITIVE_INFINITY;

    let runs = 0;

    while (mazes.length) {
        runs += 1;
        const current = mazes.shift();

        const descendants = floodFillTwo(current).map(key => moveRobotTwo(current, key)).filter(m => m).filter(m => m.distance < minPath);
        const finished = descendants.filter(m => m.keys.length === 0);
        const unfinished = descendants.filter(m => m.keys.length !== 0);
        for (const m of finished) {
            distanceCacheTwo[m.pathstr] = m.distance;
        }
        minPath = Object.values(distanceCacheTwo).min();
        for (const m of finished) {
            debugLog(debug, m.pathstr, m.distance, minPath, "\u001b[K");
        }
        if (runs % 1237 === 123) {
            debugLog(debug, "Current run: ", runs, " current path: ", current.pathstr, "\u001b[K");
            debugLog(debug, "\u001b[2A");
        }

        mazes.push(...unfinished);
        mazes.sort((f, s) => f.pathstr.localeCompare(s.pathstr));
    }

    // 1640 - gotten after almost 24 hours of processing
    return minPath;
};

const resultOne = (_: any, result: number) => {
    return `Minimal steps to collect all keys are ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Minimal steps to collect all keys are ${result}`;
};

const showInput = (input: Maze) => {
};

const test = (_: Maze) => {
    console.log("----Test-----");
};

export const solution18: Puzzle<Maze, number> = {
    day: 18,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
