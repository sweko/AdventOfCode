import { readInputLines } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface CelestialBody {
    id: string;
    parentId: string;
    level: number;
    satelites: CelestialBody[];
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const orbits = lines.map(line => line.split(")"));
    return orbits as [string, string][];
};

const fillSatelites = (orbits: [string, string][], planet: CelestialBody): CelestialBody => {
    const satelites = orbits.filter(o => o[0] === planet.id);
    planet.satelites = satelites.map(s => ({
        id: s[1],
        parentId: planet.id,
        level: planet.level + 1,
        satelites: []
    }));

    for (const satelite of planet.satelites) {
        fillSatelites(orbits, satelite);
    }

    return planet;
}

const sumOrbits = (planet: CelestialBody): number => {
    return planet.level + planet.satelites.sum(s => sumOrbits(s));
}

const orbitToTree = (orbits: [string, string][]) => {
    const children = orbits.map(o => o[1]);
    const parents = orbits.map(o => o[0]);
    const rootId = parents.find(p => !children.includes(p));
    let root: CelestialBody = {
        id: rootId,
        parentId: '',
        level: 0,
        satelites: []
    };
    return fillSatelites(orbits, root);
}

const partOne = (orbits: [string, string][]) => {
    const root = orbitToTree(orbits);
    return sumOrbits(root);
};

const toArray = (root: CelestialBody): CelestialBody[] => {
    // flat map is slow
    // return [root, ...root.satelites.flatMap(s => toArray(s))];
    const result = [root];
    for (const satelite of root.satelites) {
        result.push(...toArray(satelite));
    }
    return result;
}

const getParents = (body: CelestialBody, bodies: CelestialBody[]) : string[] =>{
    if (!body.parentId) {
        return [body.id];
    }
    const parent = bodies.find(b => b.id === body.parentId);
    return [...getParents(parent, bodies), body.id];
}

const partTwo = (orbits: [string, string][]) => {
    const root = orbitToTree(orbits);
    const bodies = toArray(root);

    let youPath = getParents(bodies.find(b => b.id === "YOU"), bodies);
    let sanPath = getParents(bodies.find(b => b.id === "SAN"), bodies);

    while (youPath[0] === sanPath[0]) {
        youPath = youPath.slice(1);
        sanPath = sanPath.slice(1);
    }

    return youPath.length + sanPath.length - 2;
};

const resultOne = (_: any, result: number) => {
    return `Total number of orbits is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The minimum number of orbital transfers is ${result}`;
};

const showInput = (input: [string, string][]) => {
    console.log(input);
};

const test = (input: [string, string][]) => {
    console.log(input);
    console.log(input.groupBy(o => o[1]).filter(g => g.items.length > 1));
};

export const solutionSix: Puzzle<[string, string][], number> = {
    day: 6,
    input: processInput,
    partOne,
    partTwo,
    resultOne,
    resultTwo,
    showInput,
    test,
}
