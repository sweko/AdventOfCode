import { performance } from "perf_hooks";
import "../extra/array-helpers";
import { readInputLines } from "../extra/aoc-helper";
import { printMatrix } from "../extra/terminal-helper";

type Cell = "wall" | "empty" | "elf" | "goblin";

interface Coordinates {
    x: number;
    y: number;
}

interface Critter extends Coordinates {
    hitpoints: number;
    attack: number;
    type: "elf" | "goblin";
}

interface Situation {
    maze: Cell[][];
    elves: Critter[];
    goblins: Critter[];
}

const enemyMap = {
    elf: "goblin",
    goblin: "elf"
}

const enemiesMap = {
    elf: "goblins",
    goblin: "elves"
}


async function main() {
    const startInput = performance.now();

    const lines = await readInputLines();
    const situation = processLines(lines);

    //printMaze(situation);

    const endInput = performance.now();
    console.log(`Running time for input is ${Math.round(endInput - startInput)}ms`);

    const startOne = performance.now();
    let gameValue = processPartOne(copySituation(situation));
    const endOne = performance.now();

    console.log(`Part 1: Game value is ${gameValue.round}*${gameValue.health}= ${gameValue.round * gameValue.health}`);
    console.log(`Running time for part 1 is ${Math.round(endOne - startOne)}ms`);

    const startTwo = performance.now();
    gameValue = processPartTwo(copySituation(situation));
    const endTwo = performance.now();

    console.log(`Part 2: Game value is ${gameValue.round}*${gameValue.health}= ${gameValue.round * gameValue.health}`);
    console.log(`Running time for part 2 is ${Math.round(endOne - startOne)}ms`);
}

function copySituation(situation: Situation): Situation {
    return {
        maze: situation.maze.map(row => row.slice()),
        elves: situation.elves.map(elf => ({ ...elf })),
        goblins: situation.goblins.map(goblin => ({ ...goblin }))
    }
}

function processLines(lines: string[]) {
    const elves: Critter[] = [];
    const goblins: Critter[] = [];
    const maze = lines.map((line, row) => line.split("").map((char, column) => {
        if (char === "#") {
            return "wall";
        }
        if (char === "G") {
            goblins.push({ x: row, y: column, hitpoints: 200, attack: 3, type: "goblin" });
            return "goblin";
        }
        if (char === "E") {
            elves.push({ x: row, y: column, hitpoints: 200, attack: 3, type: "elf" });
            return "elf";
        }
        return "empty";
    }));
    const situation = { maze, elves, goblins };
    return situation;
}

function printMaze(situation: Situation) {
    const lines = [];
    const { maze, elves, goblins } = situation;
    for (let rindex = 0; rindex < maze.length; rindex++) {
        const row = maze[rindex];
        const line = [];
        for (let cindex = 0; cindex < row.length; cindex++) {
            const block = row[cindex];
            if (block === "wall") {
                line.push("#");
            } else if (block === "elf") {
                line.push("E");
            } else if (block === "goblin") {
                line.push("G");
            } else {
                line.push(".")
            }
        }
        lines.push(line.join(""));
    }

    for (const line of lines) {
        console.log(line);
    }

    console.log(elves);
    console.log(goblins);
    return lines;

}

function getNeighbours(coords: Coordinates) {
    return [
        { x: coords.x - 1, y: coords.y },
        { x: coords.x, y: coords.y - 1 },
        { x: coords.x, y: coords.y + 1 },
        { x: coords.x + 1, y: coords.y }
    ]

}

function attackAt(situation: Situation, attacker: Critter, victim: Critter) {
    const { maze, elves, goblins } = situation;
    victim.hitpoints -= attacker.attack;
    if (victim.hitpoints < 0) {
        if (victim.type === "elf") {
            const index = elves.indexOf(victim);
            //console.log(`Elf at ${victim.x},${victim.y} dies`);
            elves.splice(index, 1);
        } else {
            const index = goblins.indexOf(victim);
            //console.log(`Goblin at ${victim.x},${victim.y} dies`);
            goblins.splice(index, 1);
        }
        maze[victim.x][victim.y] = "empty";
    }
}

function tryAttack(situation: Situation, hunter: Critter) {
    const { maze } = situation;
    const enemies = getNeighbours(hunter)
        .filter(coord => maze[coord.x][coord.y] === enemyMap[hunter.type])
        .map(coord => situation[enemiesMap[hunter.type]].find((unit: Critter) => unit.x === coord.x && unit.y === coord.y));

    // if (enemies.length > 1) {
    //     console.log("found multiple enemies", enemies);
    // }

    if (enemies.length === 0) {
        return false;
    }
    const enemy = enemies.minFind(victim => victim.hitpoints);
    //console.log(`${hunter.type} at ${hunter.x},${hunter.y} attacking ${enemyMap[hunter.type]} at ${enemy.x},${enemy.y}`);
    attackAt(situation, hunter, enemy)
    return true;
}

function floodFill(situation: Situation, source: Coordinates): number[][] {
    const { maze } = situation;

    //console.log("source ", source);

    const distances: number[][] = Array(situation.maze.length).fill(0).map(row => Array(situation.maze[0].length).fill(Number.POSITIVE_INFINITY));
    const nextcells: Coordinates[] = [...getNeighbours(source).filter(item => maze[item.x] && maze[item.x][item.y] === "empty")];
    distances[source.x][source.y] = 0;

    while (nextcells.length !== 0) {
        const cell = nextcells.shift();
        if (distances[cell.x][cell.y] !== Number.POSITIVE_INFINITY) {
            continue;
        }
        const neighbours = getNeighbours(cell);

        distances[cell.x][cell.y] = neighbours.min(item => distances[item.x][item.y]) + 1;
        nextcells.push(...neighbours
            .filter(item => maze[item.x] && maze[item.x][item.y] === "empty")
            .filter(item => distances[item.x][item.y] === Number.POSITIVE_INFINITY));
    }

    return distances;
}

function makeMove(situation: Situation, hunter: Critter, targets: Coordinates[]) {
    //console.log(`Looking for target for ${hunter.type} at ${hunter.x},${hunter.y}`);
    const { maze, elves, goblins } = situation;

    if (tryAttack(situation, hunter)) {
        return true;
    };

    // no available targets
    if (targets.length === 0) {
        return null;
    }

    // flood fill everything (slowest possible implementation)
    const targetDistances = floodFill(situation, hunter);

    // find closest target
    const target = targets
        .sort(sorter)
        .minFind(target => targetDistances[target.x][target.y])

    if (target === null) {
        //console.log("Sitting still, no targets");
        return false;
    }

    // get distances from target
    const hunterDistances = floodFill(situation, target);
    const stepDirection = getNeighbours(hunter).minFind(neighbor => hunterDistances[neighbor.x][neighbor.y]);

    maze[hunter.x][hunter.y] = "empty";

    hunter.x = stepDirection.x;
    hunter.y = stepDirection.y;

    maze[hunter.x][hunter.y] = hunter.type;

    tryAttack(situation, hunter);
}

const sorter = (first: Critter, second: Critter) => (first.x - second.x) || (first.y - second.y);

function processPartOne(situation: Situation): { round: number, health: number } {
    const { maze, elves, goblins } = situation;
    let round = 1;
    let result;
    while (true) {
        const units = [...elves, ...goblins].sort(sorter);
        let finished = false;

        for (let index = 0; index < units.length; index++) {
            if (elves.length === 0) {
                result = { round: round - 1, health: goblins.sum(g => g.hitpoints) };
                finished = true;
                break;
            }
            if (goblins.length === 0) {
                result = { round: round - 1, health: elves.sum(e => e.hitpoints) };
                finished = true;
                break;
            }

            const critter = units[index];
            if (critter.hitpoints <= 0) {
                continue;
            }
            const ranges = {
                "goblin": elves.flatMap(elf => getNeighbours(elf)).filter(range => maze[range.x][range.y] === "empty"),
                "elf": goblins.flatMap(goblin => getNeighbours(goblin)).filter(range => maze[range.x][range.y] === "empty")
            }
            makeMove(situation, critter, ranges[critter.type]);
        }

        if (finished) {
            break;
        }

        //console.log(`--- Round finished ${round} ---`);
        // printMaze(situation);
        round += 1;

        // if (round > 45) {
        //     result = {};
        //     break;
        // }
    }
    //printMaze(situation);
    return result;
}

function processPartTwo(initialSituation: Situation): { round: number, health: number } {
    let attackPower = 3;
    while (true) {
        const situation = copySituation(initialSituation);
        for (const elf of situation.elves) {
            elf.attack = attackPower;
        }
        const outcome = processPartOne(situation);
        //printMaze(situation);

        if (situation.elves.length === 0) {
            console.log(`Elves lose at ${attackPower} attackPower`);
        } else if (situation.elves.length !== initialSituation.elves.length) {
            console.log(`${initialSituation.elves.length - situation.elves.length} elves die at at ${attackPower} attackPower`);
        } else {
            console.log(`Elves win flawlessly at ${attackPower} attackPower`);
            return outcome;
        }
        attackPower +=1;
    }
}

main();