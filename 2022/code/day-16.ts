import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Valve {
    kind: "valve";
    name: string;
    flow: number;
    neighbours: string[];
}

interface Coridor {
    kind: "coridor";
    name: string;
    neighbours: string[];
}

type Cell = Valve | Coridor;

type Volcano = Map<string, Cell>;

type DistanceMap = Map<string, Map<string, number>>;

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const valves: Cell[] = lines.map(line => {
        const match = line.match(/^Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z]+(?:, [A-Z]+)*)/);
        const flow = parseInt(match[2]);
        if (flow === 0) {
            return {
                kind: "coridor",
                name: match[1],
                neighbours: match[3].split(", ")
            }
        } else {
            return {
                kind: "valve",
                name: match[1],
                flow: flow,
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

const getDistances = (start: string, volcano: Volcano) => {
    const distances = new Map<string, number>([[start, 0]]);
    const queue: string[] = [start];
    while (queue.length > 0) {
        const current = queue.shift();
        const currentCell = volcano.get(current);
        const currentDistance = distances.get(current);
        for (const neighbour of currentCell.neighbours) {
            if (!distances.has(neighbour)) {
                distances.set(neighbour, currentDistance + 1);
                queue.push(neighbour);
            }
        }
    }
    const coridors = Array.from(volcano.values()).filter(node => node.kind === "coridor").map(node => node.name);
    for (const coridor of coridors) {
            distances.delete(coridor);
    }
    distances.delete(start);
    return distances;
};

const getReleaseValue = (from: string, to: Valve, minutes: number, distances: DistanceMap) => {
    const distance = distances.get(from).get(to.name);
    const releaseTime = minutes - distance - 1;
    if (releaseTime <= 0) {
        return 0;
    }
    return releaseTime * to.flow;
};

const getMaximalValue = (start: string, minutes: number, distances: DistanceMap, volcano: Volcano) => {
    // assume that we're opening a valve every second minute
    // const valves = Array.from(distances.keys()).filter(key => key !== start);
    // const presures = valves.map(valve => {
    //     const presure = getReleaseValue(start, valve, minutes, distances);
    //     return {
    //         valve: valve.name,
    //         presure
    //     }
    // }).sort((a, b) => b.presure - a.presure);

    // return presures[0];
};

type Flow = { valve: string, flow: number, open: number };

const getFlowValue = (flows: Flow[]): number => flows.sum(flow => flow.open * flow.flow);

const partOne = (volcano: Volcano, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const valves = Array.from(volcano.values()).filter(cell => cell.kind === "valve") as Valve[];

    // calculate distances
    const distances = new Map<string, Map<string, number>>();
    for (const valve of valves) {
        const valveDistances = getDistances(valve.name, volcano);
        distances.set(valve.name, valveDistances);
    }

    distances.set("AA", getDistances("AA", volcano));

    const getMaximumPresure = (start: string, minutes: number, flows: Flow[]): Flow[] => {
        if (minutes <= 0) {
            return flows;
        }
        const valveDistances = distances.get(start);
        const valve = volcano.get(start);
        const flow = (valve.kind === "valve") ? valve.flow : 0;
        const newFlow = flow ? [...flows, { valve: start, flow, open: minutes }] : [...flows];
        let max = getFlowValue(newFlow);
        let maxFlow = newFlow;
        for (const [valveName, valveDistance] of valveDistances) {
            if (newFlow.some(flow => flow.valve === valveName)) {
                continue;
            }
            const valveFlow = getMaximumPresure(valveName, minutes - valveDistance - 1, newFlow);
            const valveMax = getFlowValue(valveFlow);
            if (valveMax > max) {
                maxFlow = valveFlow;
                max = valveMax;
            }
        }
        return maxFlow;
    };

    const flow = getMaximumPresure("AA", 30, []);
 
    return getFlowValue(flow);
};

const partTwo = (volcano: Volcano, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const valves = Array.from(volcano.values()).filter(cell => cell.kind === "valve") as Valve[];

    // calculate distances
    const distances = new Map<string, Map<string, number>>();
    for (const valve of valves) {
        const valveDistances = getDistances(valve.name, volcano);
        distances.set(valve.name, valveDistances);
    }

    distances.set("AA", getDistances("AA", volcano));

    let callCount = 0;

    const getMaximumPresure = (start: string, minutes: number, flows: Flow[], other: {next: string, minutes: number, kind: "human" | "elephant" }, level: number = 0): Flow[] => {
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
        const flow = (valve.kind === "valve") ? valve.flow : 0;
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
