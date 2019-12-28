import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

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
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    let robot: Point;
    const doors: Point[] = [];
    const keys: Point[] = [];
    const cells: Point[][] = lines.map((line, x) => line.split("").map((char, y) => {
        if (char === "#") return { x, y, state: State.Wall };
        if (char === ".") return { x, y, state: State.Empty };
        if (char === "@") {
            robot = { x, y, state: State.Robot, distance: 0 }
            return { x, y, state: State.Robot, distance: 0 };
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
    return { cells, keys, doors, robot }
};

const checkNeighbour = (point: Point) => {
    if (point.state === State.Empty && point.distance === undefined) return { reachable: true };
    if (point.state === State.Key && point.distance === undefined) return { reachable: true, key: point.name };
    return {reachable: false};
}

const floodFill = (maze: Maze) => {
    const active = [maze.robot];
    const distances = [];
    while (active.length > 0) {
        const current = active.shift();

        let neighbour = maze.cells[current.x - 1][current.y];
        const up = checkNeighbour(neighbour);
        if (up.reachable) {
            neighbour.distance = current.distance + 1;
            active.push(neighbour)
            if (up.key) {
                distances.push(neighbour);
            }
        }
        
        neighbour = maze.cells[current.x + 1][current.y];
        const down = checkNeighbour(neighbour);
        if (down.reachable) {
            neighbour.distance = current.distance + 1;
            active.push(neighbour)
            if (down.key) {
                distances.push(neighbour);
            }
        }

        neighbour = maze.cells[current.x][current.y-1];
        const left = checkNeighbour(neighbour);
        if (left.reachable) {
            neighbour.distance = current.distance + 1;
            active.push(neighbour)
            if (left.key) {
                distances.push(neighbour);
            }
        }

        neighbour = maze.cells[current.x][current.y+1];
        const right = checkNeighbour(neighbour);
        if (right.reachable) {
            neighbour.distance = current.distance + 1;
            active.push(neighbour)
            if (right.key) {
                distances.push(neighbour);
            }
        }
    }
    return distances;
}

const partOne = (maze: Maze, debug: boolean) => {
    const reachable = floodFill(maze);
    console.log(reachable);

    return 0;
};

const partTwo = (input: Maze, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    return 0;
};

const resultOne = (_: any, result: number) => {
    return `Total system energy is ${result}`;
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
