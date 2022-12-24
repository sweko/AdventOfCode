import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface InputValve {
    name: string;
    flow: number;
    neighbours: string[];
}

interface Valve {
    name: string;
    flow: number;
    neighbours: Map<string, Valve>;
}


type Volcano = Map<string, InputValve>;

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const valves: InputValve[] = lines.map(line => {
        const match = line.match(/^Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z]+(?:, [A-Z]+)*)/);
        return {
            name: match[1],
            flow: parseInt(match[2]),
            neighbours: match[3].split(", ")
        }
    });
    const result = new Map<string, InputValve>();
    for (const valve of valves) {
        result.set(valve.name, valve);
    }

    return result;
};

interface Path {
    path: string[];
    opens: Set<string>;
}

const getNextPaths = ({path, opens}: Path, input: Volcano): Path[] => {
    let step = path[path.length - 1];
    if (step === "open") {
        step = path[path.length - 2];
    }

    //console.log("Step", step);
    
    const currentValve = input.get(step);
    const result: Path[] = [];
    for (const neighbour of currentValve.neighbours) {
        //console.log(`Neighbour ${neighbour}`);
        
        let prev = path.length - 1;
        let doPath = true;
        while ((prev >= 0) && (path[prev] !== "open")) {
            if (neighbour === path[prev]) {
                doPath = false;
                break;
            }
            prev -= 1;
        }

        if ((path[prev] === "open") && (path[prev - 1] === neighbour)) {
            doPath = false;
        }

        if (doPath) {
            const next = [...path, neighbour];
            result.push({
                path: next,
                opens: new Set([...opens])
            });
        }
    }

    if (currentValve.flow !== 0 && !opens.has(currentValve.name)) {
        const next = [...path, "open"];
        result.push({
            path: next,
            opens: new Set([...opens, currentValve.name])
        });
    }
    return result;
}

const evaluatePath = (path: string[], input: Volcano) => {
    let currentValve: string = "";
    let totalFlow = 0;
    let presure = 0;

    for (let index = 0; index <= 30; index++) {
        presure += totalFlow;

        const step = path[index];
        if (step) {
            if (step === "open") {
                totalFlow += input.get(currentValve).flow;
            } else {
                currentValve = step;
            }
        }
    }
    return presure;
}

const partOne = (input: Volcano, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const valves =[...input.values()];
    for (const valve of valves) {
        for (const nei of valve.neighbours) {
            const neighbour = input.get(nei);
            if (!neighbour.neighbours.includes(valve.name)) {
                console.log(`Valve ${valve.name} is not a true neighbour of ${neighbour.name}`);
            }
        }
    }

    // const path = ["AA", "DD", "open", "CC", "BB", "open", "AA", "II", "JJ", "open", "II", "AA", "DD", "EE", "FF", "GG", "HH", "open", "GG", "FF", "EE", "open", "DD", "CC", "open"];
    // console.log(evaluatePath(path, input));

    const initialPath: Path = {
        path: ["AA"],
        opens: new Set()
    };

    let paths = [initialPath];
    let minute = 0;
    while (minute < 30) {
        paths = paths.flatMap(path => getNextPaths(path, input));
        minute += 1;
        // console.log(`Minute ${minute}: ${paths.length} paths`);
    }

   // console.log(paths);

    // const path =  ["AA", "DD", "open", "CC", "BB", "open", "AA", "II", "JJ", "open", "II", "AA", "DD", "EE", "FF", "GG", "HH", "open", ]//"GG", "FF", "EE", "open", "DD", "CC", "open""];
    // console.log(getNextPaths({path, opens: new Set(["DD", "BB", "JJ", "HH"])}, input));

    return paths.map(path => evaluatePath(path.path, input)).max();
};

const partTwo = (input: Volcano, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    return 0;
};

const resultOne = (_: Volcano, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: Volcano, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Volcano) => {
    console.log(input);
};

const test = (_: Volcano) => {
    console.log("----Test-----");
};

export const solutionSixteen: Puzzle<Volcano, number> = {
    day: 16,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
