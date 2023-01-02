import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Valve {
    type: "valve";
    name: string;
    flow: number;
    neighbours: string[];
}

interface Corridor {
    type: "corridor";
    name: string;
    neighbours: string[];
}

type Cell = Valve | Corridor;


type Volcano = Map<string, Cell>;

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const valves: Cell[] = lines.map(line => {
        const match = line.match(/^Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z]+(?:, [A-Z]+)*)/);
        const flow = parseInt(match[2]);
        if (flow === 0) {
            return {
                type: "corridor",
                name: match[1],
                neighbours: match[3].split(", ")
            }
        } else {
            return {
                type: "valve",
                name: match[1],
                flow, 
                neighbours: match[3].split(", ")
            }
        }
    });
    const result = new Map<string, Cell>();
    for (const valve of valves) {
        result.set(valve.name, valve);
    }

    return result;
};

const getDistances = (volcano: Volcano, start: string) => {
    const distances = new Map<string, number>();
    distances.set(start, 0);
    const queue = [start];
    while (queue.length > 0) {
        const current = queue.shift();
        const currentDistance = distances.get(current);
        const currentCell = volcano.get(current);
        for (const neighbour of currentCell.neighbours) {
            if (!distances.has(neighbour)) {
                distances.set(neighbour, currentDistance + 1);
                queue.push(neighbour);
            }
        }
    }
    const coridors = Array.from(volcano.values()).filter(cell => cell.type === "corridor").map(cell => cell.name);
    for (const corridor of coridors) {
        distances.delete(corridor);
    }
    distances.delete(start);
    return distances;
};

type OpenValve = { valve: string, open: number, flow: number };

const openValve = (cell: Cell, minutes: number, flows: OpenValve[]) => {
    if (cell.type === "corridor") {
        return flows;
    } else {
        return [...flows, { valve: cell.name, open: minutes, flow: cell.flow }]
    }
}

const getFlowValue = (flows: OpenValve[]) => flows.sum(openValve => openValve.flow * openValve.open);


const partOne = (volcano: Volcano, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const valves = Array.from(volcano.values()).filter(cell => cell.type === "valve") as Valve[];

    const distances = new Map<string, Map<string, number>>();
    for (const valve of valves) {
        distances.set(valve.name, getDistances(volcano, valve.name));
    }
    distances.set("AA", getDistances(volcano, "AA"));

    let callCount = 0;

    const getMaximumPresure = (start: string, minutes: number, flows: OpenValve[]):OpenValve[] => {
        callCount++;
        if (minutes <= 0) {
            return flows;
        }
        const currentDistances = distances.get(start);
        const currentValve = volcano.get(start);
        const nextFlows = openValve(currentValve, minutes, flows);
        let maxFlow = nextFlows;
        let maxValue = getFlowValue(nextFlows);
        for (const [neighbour, ndistance] of currentDistances) {
            if (nextFlows.some(flow => flow.valve === neighbour)) {
                continue;
            }
            const nflow = getMaximumPresure(neighbour, minutes - ndistance - 1, nextFlows);
            const nvalue = getFlowValue(nflow);
            if (nvalue > maxValue) {
                maxFlow = nflow;
                maxValue = nvalue;
            }
        }
        return maxFlow;
    }

    const maxFlow = getMaximumPresure("AA", 30, []);

    const result = getFlowValue(maxFlow);

    console.log(callCount);
    return result;
};

const partTwo = (volcano: Volcano, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const valves = Array.from(volcano.values()).filter(cell => cell.type === "valve") as Valve[];

    // calculate distances
    const distances = new Map<string, Map<string, number>>();
    for (const valve of valves) {
        const valveDistances = getDistances(volcano, valve.name);
        distances.set(valve.name, valveDistances);
    }

    distances.set("AA", getDistances(volcano, "AA"));

    let callCount = 0;

    const getMaximumPresure = (start: string, minutes: number, flows: OpenValve[], other: {next: string, minutes: number, kind: "human" | "elephant" }, level: number = 0): OpenValve[] => {
        callCount++;
        if (callCount % 13_456_789 === 0) {
            console.log(callCount.toLocaleString());
        }

        if (minutes <= 0) {
            // console.log(`${''.padStart(level*2)}  flows: ${flows.map(flow => `${flow.valve}(${flow.flow})`).join(', ')}`);
            return flows;
        }

        const valveDistances = distances.get(start);
        const valve = volcano.get(start);
        const flow = (valve.type === "valve") ? valve.flow : 0;
        const newFlow = flow ? [...flows, { valve: start, flow, open: minutes }] : [...flows];
        let max = getFlowValue(newFlow);
        let maxFlow = newFlow;
        for (const [valveName, valveDistance] of valveDistances) {
            if (newFlow.some(flow => flow.valve === valveName)) {
                continue;
            }
            if (valveName === other.next) {
                continue;
            }
            const nextMinutes = minutes - valveDistance - 1;
            if (nextMinutes <= other.minutes) {
                // pass to other
                // console.log(`${''.padStart(level*2)}${other.kind} at ${other.next} with ${other.minutes} minutes left ${callCount}`);
                const valveFlow = getMaximumPresure(other.next, other.minutes, newFlow, { next: valveName, minutes: nextMinutes, kind: other.kind === "human" ? "elephant" : "human" }, level + 1);
                const valveMax = getFlowValue(valveFlow);
                if (valveMax > max) {
                    maxFlow = valveFlow;
                    max = valveMax;
                }
            } else {
                // console.log(`${''.padStart(level*2)}${other.kind === "elephant" ? "human" : "elephant"} at ${start} with ${nextMinutes} minutes left ${callCount}`);
                const valveFlow = getMaximumPresure(valveName, nextMinutes, newFlow, other, level + 1);
                const valveMax = getFlowValue(valveFlow);
                if (valveMax > max) {
                    maxFlow = valveFlow;
                    max = valveMax;
                }
            }
        }
        return maxFlow;
    };

    const flow = getMaximumPresure("AA", 26, [], { next: "AA", minutes: 26, kind: "elephant" });
    console.log(`Total calls: ${callCount.toLocaleString()}`)
 
    return getFlowValue(flow);
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
