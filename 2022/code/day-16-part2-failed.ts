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
    return Array.from(distances.entries());
};

type OpenValve = { valve: string, open: number, flow: number, opener: 'human' | 'elephant' };

const isValve = (cell: Cell): cell is Valve => cell.type === "valve";

const isCorridor = (cell: Cell): cell is Corridor => cell.type === "corridor";

const openValve = (cell: Cell, minutes: number, flows: OpenValve[]) => {
    if (cell.type === "corridor") {
        return flows;
    } else {
        return [...flows, { valve: cell.name, open: minutes, flow: cell.flow, opener: 'human' } as OpenValve]
    }
}

const getFlowValue = (flows: OpenValve[]) => flows.sum(openValve => openValve.flow * openValve.open);


const partOne = (volcano: Volcano, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const valves = Array.from(volcano.values()).filter(cell => cell.type === "valve") as Valve[];

    const distances = new Map<string, [string, number][]>();
    for (const valve of valves) {
        distances.set(valve.name, getDistances(volcano, valve.name));
    }
    distances.set("AA", getDistances(volcano, "AA"));

    let callCount = 0;

    let currentMax = Number.NEGATIVE_INFINITY;

    const getEstimateMaximum = (minutes: number, flows: OpenValve[]): number => {
        if (minutes <= 0) {
            return Number.NEGATIVE_INFINITY;
        }
        // what is the maximum flow we can get from this point, if we open the rest of the valves sequentially
        const localFlows = [...flows];
        const unreachedValves = valves
            .filter(valve => !flows.some(flow => flow.valve === valve.name))
            .map(valve => [valve.name, valve.flow] as [string, number])
            .toSorted((a, b) => b[1] - a[1]);

        let leftMinutes = minutes;
        while (leftMinutes > 0) {
            const next = unreachedValves.shift();
            if (!next) {
                break;
            }
            const cell = volcano.get(next[0]);
            if (!isValve(cell)) {
                continue;
            }
            localFlows.push({ valve: next[0], open: leftMinutes - 1, flow: cell.flow, opener: 'human' })
            leftMinutes -= 2;
        }

        return getFlowValue(localFlows);
    }

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
            // skip visited neighbours
            if (nextFlows.some(flow => flow.valve === neighbour)) {
                continue;
            }
            const nextMinute = minutes - ndistance - 1; // reduce by the distance travelled and the time to open the valve

            // this is the prunning place, the place in which we prune
            if (getEstimateMaximum(nextMinute, nextFlows) < currentMax) {
                continue;
            }

            const nflow = getMaximumPresure(neighbour, nextMinute, nextFlows);
            const nvalue = getFlowValue(nflow);
            if (nvalue > maxValue) {
                maxFlow = nflow;
                maxValue = nvalue;
            }
        }
        if (maxValue > currentMax) {
            currentMax = maxValue;
            console.log(`New max: ${currentMax}`);
        }
        return maxFlow;
    }

    const maxFlow = getMaximumPresure("AA", 30, []);

    const result = getFlowValue(maxFlow);

    console.log(`Total calls: ${callCount.toLocaleString()}`)

    return result;
};

const partTwo = (volcano: Volcano, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const valves = Array.from(volcano.values()).filter(cell => cell.type === "valve") as Valve[];

    // calculate distances
    const distances = new Map<string, [string, number][]>();
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
            return flows;
        }

        const valveDistances = distances.get(start)
            .filter(([_, distance]) => distance < minutes)
            .filter(([valveName, _]) => !flows.some(flow => flow.valve === valveName));

        const valve = volcano.get(start);
        const flow = (valve.type === "valve") ? valve.flow : 0;
        const newFlow = flow ? [...flows, { valve: start, flow, open: minutes, opener: 'human' } as OpenValve] : [...flows];
        let max = getFlowValue(newFlow);
        let maxFlow = newFlow;
        for (const [valveName, valveDistance] of valveDistances) {
            if (valveName === other.next) {
                continue;
            }
            const nextMinutes = minutes - valveDistance - 1;
            if (nextMinutes <= other.minutes) {
                // pass to other
                const valveFlow = getMaximumPresure(other.next, other.minutes, newFlow, { next: valveName, minutes: nextMinutes, kind: other.kind === "human" ? "elephant" : "human" }, level + 1);
                const valveMax = getFlowValue(valveFlow);
                if (valveMax > max) {
                    maxFlow = valveFlow;
                    max = valveMax;
                }
            } else {
                const valveFlow = getMaximumPresure(valveName, nextMinutes, newFlow, other, level + 1);
                const valveMax = getFlowValue(valveFlow);
                if (valveMax > max) {
                    maxFlow = valveFlow;
                    max = valveMax;
                }
            }
        }
        if (maxFlow.length === newFlow.length) {
            const valveFlow = getMaximumPresure(other.next, other.minutes, newFlow, { next: "", minutes: -1, kind: other.kind === "human" ? "elephant" : "human" }, level + 1);
            const valveMax = getFlowValue(valveFlow);
            if (valveMax > max) {
                maxFlow = valveFlow;
                max = valveMax;
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
