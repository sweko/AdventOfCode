import { readInputLines, readInput, debugLog } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { printMatrix } from "../extra/terminal-helper";

const processInput = async (day: number) => {
    let lines = await readInputLines(day);
    const tops = lines.slice(0, 2)
        .map(line => line.split("").map((key, index) => ({ index, key })).filter(item => item.key !== " "));
    const topPortals = tops[0].map((item, index) => ({ index: item.index - 2, name: item.key + tops[1][index].key }));
    const bottoms = lines.slice(lines.length - 2, lines.length)
        .map(line => line.split("").map((key, index) => ({ index, key })).filter(item => item.key !== " "));
    const bottomPortals = bottoms[0].map((item, index) => ({ index: item.index - 2, name: item.key + bottoms[1][index].key }));

    lines = lines.slice(0, lines.length - 2).slice(2);
    const frontPortals = lines.map((line, index) => ({ index, name: line.slice(0, 2) })).filter(portal => portal.name !== "  ");
    const backPortals = lines.map((line, index) => ({ index, name: line.slice(line.length - 2) })).filter(portal => portal.name !== "  ");
    lines = lines.map(line => line.slice(2, line.length - 2));

    const maze: string[][] = lines.map(line => line.split("").map(char => char === "." ? "." : char === "#" ? "#" : " "));
    for (const portal of topPortals) {
        maze[0][portal.index] = portal.name;
    }
    for (const portal of bottomPortals) {
        maze[maze.length - 1][portal.index] = portal.name;
    }
    for (const portal of frontPortals) {
        maze[portal.index][0] = portal.name;
    }
    for (const portal of backPortals) {
        maze[portal.index][maze[0].length - 1] = portal.name;
    }
    // printMaze(maze);


    const above = lines.findIndex(line => line.indexOf(" ") !== -1);
    lines = lines.slice(above);
    const below = lines.findIndex(line => line.indexOf(" ") === -1);
    lines = lines.slice(0, below);

    const from = lines[0].indexOf(" ");
    const to = lines[0].lastIndexOf(" ");
    lines = lines.map(line => line.slice(0, to + 1).slice(from));

    const leftPortals = lines.map((line, index) => ({ index: index + above, name: line.slice(0, 2) })).filter(portal => portal.name !== "  ");
    for (const portal of leftPortals) {
        maze[portal.index][from - 1] = portal.name;
    }

    const rightPortals = lines.map((line, index) => ({ index: index + above, name: line.slice(line.length - 2) })).filter(portal => portal.name !== "  ");
    for (const portal of rightPortals) {
        maze[portal.index][to + 1] = portal.name;
    }

    lines = lines.map(line => line.slice(2, line.length - 2));

    const aboves = lines.slice(0, 2)
        .map(line => line.split("").map((key, index) => ({ index, key })).filter(item => item.key !== " "));
    const abovePortals = aboves[0].map((item, index) => ({ index: item.index + from + 2, name: item.key + aboves[1][index].key }));
    for (const portal of abovePortals) {
        maze[above - 1][portal.index] = portal.name;
    }

    const belows = lines.slice(lines.length - 2, lines.length)
        .map(line => line.split("").map((key, index) => ({ index, key })).filter(item => item.key !== " "));
    const belowPortals = belows[0].map((item, index) => ({ index: item.index + from + 2, name: item.key + belows[1][index].key }));

    for (const portal of belowPortals) {
        maze[above + below][portal.index] = portal.name;
    }

    return maze;
};

const printMaze = (maze: string[][]) => {
    const portalNamesCache = "ABCDEFGHIJKLMNOPQRSTUVWXYZЉЊУИПДФГЛЗЏБШЧ".split("");
    const portalNames = {};

    printMatrix(maze, value => {
        if (value === ".") return ".";
        if (value === "#") return "#";
        if (value === " ") return " ";
        if (!portalNames[value]) {
            portalNames[value] = portalNamesCache.shift();
        }
        return portalNames[value];
    });
}

const partOne = (maze: string[][], debug: boolean) => {
    const nonportals = ["#", ".", " "];
    const walls = ["#", " "];

    const portals = maze
        .flatMap((row, x) => row
            .map((cell, y) => ({ x, y, name: cell }))
            .filter(cell => !nonportals.includes(cell.name)))
        .groupBy(p => p.name)
        .map(kvp => ({ name: kvp.key, ends: kvp.items.map(({ x, y }) => ({ x, y })) }))

    const start = portals.find(p => p.name === "AA").ends[0];

    const distances: number[][] = maze.map(_ => _.map(_ => undefined));

    distances[start.x][start.y] = 0;

    const queue = [start];

    while (queue.length !== 0) {
        const active = queue.shift();
        const distance = distances[active.x][active.y];
        const cell = maze[active.x][active.y];
        const portal = portals.find(p => p.name === cell);
        if (portal && portal.name === "ZZ") {
            if (debug) {
                printMatrix(distances, value => value === undefined ? "     " : (value + "").padStart(5));
            }
            return distance;
        }
        if (portal && portal.ends.length === 2) {
            //find other end
            const first = portal.ends[0];
            let other: { x: number; y: number; };
            if ((first.x === active.x) && (first.y === active.y)) {
                other = portal.ends[1];
            } else {
                other = first;
            }
            const pdist = distances[other.x][other.y];
            if ((pdist === undefined) || (pdist > distance + 1)) {
                distances[other.x][other.y] = distance + 1;
                queue.push(other);
            }
        }

        if (active.x > 0) {
            const neighbour = maze[active.x - 1][active.y];
            const dist = distances[active.x - 1][active.y];
            if (!walls.includes(neighbour)) {
                if ((dist === undefined) || (dist > distance + 1)) {
                    queue.push({ x: active.x - 1, y: active.y });
                    distances[active.x - 1][active.y] = distance + 1;
                }
            }
        }

        if (active.x < maze.length - 1) {
            const neighbour = maze[active.x + 1][active.y];
            const dist = distances[active.x + 1][active.y];
            if (!walls.includes(neighbour)) {
                if ((dist === undefined) || (dist > distance + 1)) {
                    queue.push({ x: active.x + 1, y: active.y });
                    distances[active.x + 1][active.y] = distance + 1;
                }
            }
        }

        if (active.y > 0) {
            const neighbour = maze[active.x][active.y - 1];
            const dist = distances[active.x][active.y - 1];
            if (!walls.includes(neighbour)) {
                if ((dist === undefined) || (dist > distance + 1)) {
                    queue.push({ x: active.x, y: active.y - 1 });
                    distances[active.x][active.y - 1] = distance + 1;
                }
            }
        }

        if (active.y < maze[0].length - 1) {
            const neighbour = maze[active.x][active.y + 1];
            const dist = distances[active.x][active.y + 1];
            if (!walls.includes(neighbour)) {
                if ((dist === undefined) || (dist > distance + 1)) {
                    queue.push({ x: active.x, y: active.y + 1 });
                    distances[active.x][active.y + 1] = distance + 1;
                }
            }
        }
    }

    return -1;
};

const isOuter = (maze: string[][], portal: { x: number, y: number }) => {
    if (portal.x === 0) return true;
    if (portal.x === maze.length - 1) return true;
    if (portal.y === 0) return true;
    if (portal.y === maze[0].length - 1) return true;
    return false;
}

const partTwo = (maze: string[][], debug: boolean) => {
    const nonportals = ["#", ".", " "];
    const walls = ["#", " "];

    const portals = maze
        .flatMap((row, x) => row
            .map((cell, y) => ({ x, y, name: cell }))
            .filter(cell => !nonportals.includes(cell.name)))
        .groupBy(p => p.name)
        .map(kvp => ({ name: kvp.key, ends: kvp.items.map(({ x, y }) => ({ x, y })) }))

    const start = portals.find(p => p.name === "AA").ends[0];

    const distances: number[][][] = [maze.map(_ => _.map(_ => undefined))];

    distances[0][start.x][start.y] = 0;

    const queue = [{...start, depth: 0}];

    while (queue.length !== 0) {
        const active = queue.shift();
        const distance = distances[active.depth][active.x][active.y];
        const cell = maze[active.x][active.y];
        const portal = portals.find(p => p.name === cell);

        if (portal) {
            if (active.depth === 0) {
                if (portal.name === "AA") {
                    debugLog(debug, "Started processing");
                } else if (portal.name === "ZZ") {
                    if (false) {
                        for (let index = 0; index < distances.length; index++) {
                            const distMap = distances[index];
                            console.log("--------LEVEL ",index,"-----------");
                            printMatrix(distMap, value => value === undefined ? "     " : (value + "").padStart(5));
                        }
                    }
                    return distance;
                } else if (isOuter(maze, active)) {
                    continue;
                } else {
                    // inner door, going down (possibly)
                    if (!distances[active.depth+1]) {
                        distances[active.depth+1] = maze.map(_ => _.map(_ => undefined));
                    }

                    //find other end
                    const first = portal.ends[0];
                    let other: { x: number; y: number; };
                    if ((first.x === active.x) && (first.y === active.y)) {
                        other = portal.ends[1];
                    } else {
                        other = first;
                    }
                    const pdist = distances[active.depth + 1][other.x][other.y];
                    if ((pdist === undefined) || (pdist > distance + 1)) {
                        distances[active.depth + 1][other.x][other.y] = distance + 1;
                        queue.push({...other, depth: active.depth + 1});
                        debugLog(debug, "Going down to depth", active.depth + 1, "through gate", portal.name);
                    }
                }
            } else {
                if ((portal.name === "AA") || (portal.name === "ZZ")) {
                    continue
                } else if (isOuter(maze, active)) {
                    // outer door, going up (possibly)

                    //find other end
                    const first = portal.ends[0];
                    let other: { x: number; y: number; };
                    if ((first.x === active.x) && (first.y === active.y)) {
                        other = portal.ends[1];
                    } else {
                        other = first;
                    }
                    const pdist = distances[active.depth - 1][other.x][other.y];
                    if ((pdist === undefined) || (pdist > distance + 1)) {
                        distances[active.depth - 1][other.x][other.y] = distance + 1;
                        queue.push({...other, depth: active.depth -1});
                        debugLog(debug, "Going up to depth", active.depth -1, "through gate", portal.name);
                    }
                } else {
                    // inner door, going down (possibly)
                    if (!distances[active.depth+1]) {
                        distances[active.depth+1] = maze.map(_ => _.map(_ => undefined));
                    }

                    //find other end
                    const first = portal.ends[0];
                    let other: { x: number; y: number; };
                    if ((first.x === active.x) && (first.y === active.y)) {
                        other = portal.ends[1];
                    } else {
                        other = first;
                    }
                    const pdist = distances[active.depth + 1][other.x][other.y];
                    if ((pdist === undefined) || (pdist > distance + 1)) {
                        distances[active.depth + 1][other.x][other.y] = distance + 1;
                        queue.push({...other, depth: active.depth + 1});
                        debugLog(debug, "Going down to depth", active.depth + 1, "through gate", portal.name);
                    }
                }
            }
        }


        if (active.x > 0) {
            const neighbour = maze[active.x - 1][active.y];
            const dist = distances[active.depth][active.x - 1][active.y];
            if (!walls.includes(neighbour)) {
                if ((dist === undefined) || (dist > distance + 1)) {
                    queue.push({ x: active.x - 1, y: active.y, depth: active.depth });
                    distances[active.depth][active.x - 1][active.y] = distance + 1;
                }
            }
        }

        if (active.x < maze.length - 1) {
            const neighbour = maze[active.x + 1][active.y];
            const dist = distances[active.depth][active.x + 1][active.y];
            if (!walls.includes(neighbour)) {
                if ((dist === undefined) || (dist > distance + 1)) {
                    queue.push({ x: active.x + 1, y: active.y, depth: active.depth  });
                    distances[active.depth][active.x + 1][active.y] = distance + 1;
                }
            }
        }

        if (active.y > 0) {
            const neighbour = maze[active.x][active.y - 1];
            const dist = distances[active.depth][active.x][active.y - 1];
            if (!walls.includes(neighbour)) {
                if ((dist === undefined) || (dist > distance + 1)) {
                    queue.push({ x: active.x, y: active.y - 1, depth: active.depth  });
                    distances[active.depth][active.x][active.y - 1] = distance + 1;
                }
            }
        }

        if (active.y < maze[0].length - 1) {
            const neighbour = maze[active.x][active.y + 1];
            const dist = distances[active.depth][active.x][active.y + 1];
            if (!walls.includes(neighbour)) {
                if ((dist === undefined) || (dist > distance + 1)) {
                    queue.push({ x: active.x, y: active.y + 1, depth: active.depth  });
                    distances[active.depth][active.x][active.y + 1] = distance + 1;
                }
            }
        }
    }

    return -1;
};

const resultOne = (_: any, result: number) => {
    return `Minimal path to ZZ is ${result} steps long`;
};

const showInput = (input: string[][]) => {
};

const test = (_: string[][]) => {
    console.log("----Test-----");
};

export const solution20: Puzzle<string[][], number> = {
    day: 20,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultOne,
    showInput,
    test,
}
