import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

type Resources = "ore" | "clay" | "obsidian" | "geode";

type ResourceValue = {
    [key in Resources]: number;
}


type RobotCosts = {
    [key in Resources]: Partial<ResourceValue>;
}


class Blueprint {

    constructor(public index: number, public costs: RobotCosts) {

    }

    show() {
        console.log(`Blueprint ${this.index}:
        Each ore robot costs ${this.costs.ore.ore} ore.
        Each clay robot costs ${this.costs.clay.ore} ore.
        Each obsidian robot costs ${this.costs.obsidian.ore} ore and ${this.costs.obsidian.clay} clay.
        Each geode robot costs ${this.costs.geode.ore} ore and ${this.costs.geode.obsidian} obsidian.`)
    }

    evaluate() {
        return this.evaluateStep(24, { ore: 1, clay: 0, obsidian: 0, geode: 0 }, { ore: 0, clay: 0, obsidian: 0, geode: 0 });
    }

    // private canMake(resources: ResourceValue, cost: Partial<ResourceValue>) {
    //     if (cost.ore > resources.ore) {
    //         return false;
    //     }
    //     if (cost.clay > resources.clay) {
    //         return false;
    //     }
    //     if (cost.obsidian > resources.obsidian) {
    //         return false;
    //     }
    //     if (cost.geode > resources.geode) {
    //         return false;
    //     }
    //     return true;
    // }

    // private makeRobot(resources: ResourceValue, robots: ResourceValue, type: Resources) {
    //     return {
    //         rrobots: {
    //             ...robots,
    //             [type]: robots[type] + 1
    //         },
    //         rresources: {
    //             ...resources,
    //             ore: resources.ore - (this.costs[type].ore || 0),
    //             clay: resources.clay - (this.costs[type].clay || 0),
    //             obsidian: resources.obsidian - (this.costs[type].obsidian || 0),
    //             geode: resources.geode - (this.costs[type].geode || 0)
    //         }
    //     }
    // }

    private memo = new Map<string, number>();

    private calls = 0;
    private hits = 0;

    private max = -Infinity;

    private evaluateStep(minutesLeft: number, robots: ResourceValue, resources: ResourceValue, prev: Resources[] = []): number {
        this.calls++;

        if (this.calls % 1_000_000 === 0) {
            console.log(`Calls: ${this.calls.toLocaleString()}, hits: ${this.hits.toLocaleString()}, ratio: ${(this.hits / this.calls * 100).toLocaleString()}%`);
        }

        const key = `${minutesLeft}:(${robots.ore},${robots.clay},${robots.obsidian},${robots.geode}):(${resources.ore},${resources.clay},${resources.obsidian},${resources.geode})`;
        if (this.memo.has(key)) {
            this.hits++;
            return this.memo.get(key);
        }

        // we might end up overshooting the minutes
        if (minutesLeft <= 0) {
            const total = resources.geode + minutesLeft * robots.geode;
            if (total > this.max) {
                this.max = total;
                console.log(`We have ${this.max} geodes with ${prev.join(", ")} robots`);
            }

            return total;
        }

        const canHaveGeode = robots.obsidian > 0;
        const canHaveObsidian = robots.clay > 0;

        let result = -1;
        // try to make an geode robot
        if (canHaveGeode) {
            const geode = this.makeGeode(resources, robots, minutesLeft, prev);
            result = Math.max(result, geode);
        }

        // try to make an obsidian robot
        if (canHaveObsidian) {
            const obsidian = this.makeObsidian(resources, robots, minutesLeft, prev);
            result = Math.max(result, obsidian);
        }

        // we can always make a clay robot
        const clay = this.makeClay(resources, robots, minutesLeft, prev);
        result = Math.max(result, clay);

        // we can always make an ore robot
        const ore = this.makeOre(resources, robots, minutesLeft, prev);
        result = Math.max(result, ore);

        this.memo.set(key, result);

        return result;
    }

    private makeOre(resources: ResourceValue, robots: ResourceValue, minutesLeft: number, prev: Resources[]) {

        const neededOre = this.costs.ore.ore - resources.ore;
        const minutes = Math.max(Math.ceil(neededOre / robots.ore), 0) + 1;

        const nextResources = {
            ore: resources.ore + robots.ore * minutes - this.costs.ore.ore,
            clay: resources.clay + robots.clay * minutes,
            obsidian: resources.obsidian + robots.obsidian * minutes,
            geode: resources.geode + robots.geode * minutes
        };
        const nextRobots = {
            ore: robots.ore + 1,
            clay: robots.clay,
            obsidian: robots.obsidian,
            geode: robots.geode
        };

        const next: Resources[] = [...prev, "ore"];
        //console.log(`Making ${next.join(", ")} robot with ${minutesLeft - minutes} minutes left`);
        const ore = this.evaluateStep(minutesLeft - minutes, nextRobots, nextResources, next);
        return ore;
    }

    private makeClay(resources: ResourceValue, robots: ResourceValue, minutesLeft: number, prev: Resources[]) {
        const neededOre = this.costs.clay.ore - resources.ore;
        const minutes = Math.max(Math.ceil(neededOre / robots.ore), 0) + 1;

        const nextResources = {
            ore: resources.ore + robots.ore * minutes - this.costs.clay.ore,
            clay: resources.clay + robots.clay * minutes,
            obsidian: resources.obsidian + robots.obsidian * minutes,
            geode: resources.geode + robots.geode * minutes
        };
        const nextRobots = {
            ore: robots.ore,
            clay: robots.clay + 1,
            obsidian: robots.obsidian,
            geode: robots.geode
        };

        const next: Resources[] = [...prev, "clay"];
        //console.log(`Making ${next.join(", ")} robot with ${minutesLeft - minutes} minutes left`);
        const clay = this.evaluateStep(minutesLeft - minutes, nextRobots, nextResources, next);
        return clay;
    }

    private makeObsidian(resources: ResourceValue, robots: ResourceValue, minutesLeft: number, prev: Resources[]) {
        const neededClay = this.costs.obsidian.clay - resources.clay;
        const neededOre = this.costs.obsidian.ore - resources.ore;

        const oreMinutes = Math.ceil(neededOre / robots.ore);
        const clayMinutes = Math.ceil(neededClay / robots.clay);

        const minutes = Math.max(oreMinutes, clayMinutes, 0) + 1;

        const nextResources = {
            ore: resources.ore + robots.ore * minutes - this.costs.obsidian.ore,
            clay: resources.clay + robots.clay * minutes - this.costs.obsidian.clay,
            obsidian: resources.obsidian + robots.obsidian * minutes,
            geode: resources.geode + robots.geode * minutes
        };
        const nextRobots = {
            ore: robots.ore,
            clay: robots.clay,
            obsidian: robots.obsidian + 1,
            geode: robots.geode
        };

        const next: Resources[] = [...prev, "obsidian"];
        //console.log(`Making ${next.join(", ")} robot with ${minutesLeft - minutes} minutes left`);
        const obsidian = this.evaluateStep(minutesLeft - minutes, nextRobots, nextResources, next);
        return obsidian;
    }

    private makeGeode(resources: ResourceValue, robots: ResourceValue, minutesLeft: number, prev: Resources[]) {
        const neededObsidian = this.costs.geode.obsidian - resources.obsidian;
        const neededOre = this.costs.geode.ore - resources.ore;

        const oreMinutes = Math.ceil(neededOre / robots.ore);
        const obsidianMinutes = Math.ceil(neededObsidian / robots.obsidian);

        const minutes = Math.max(oreMinutes, obsidianMinutes, 0) + 1;

        const nextResources = {
            ore: resources.ore + robots.ore * minutes - this.costs.geode.ore,
            clay: resources.clay + robots.clay * minutes,
            obsidian: resources.obsidian + robots.obsidian * minutes - this.costs.geode.obsidian,
            geode: resources.geode + robots.geode * minutes
        };
        const nextRobots = {
            ore: robots.ore,
            clay: robots.clay,
            obsidian: robots.obsidian,
            geode: robots.geode + 1
        };

        const next: Resources[] = [...prev, "geode"];
        //console.log(`Making ${next.join(", ")} robot with ${minutesLeft - minutes} minutes left`);
        const geode = this.evaluateStep(minutesLeft - minutes, nextRobots, nextResources, next);
        return geode;
    }

    // private evaluateStepOld(minutesLeft: number, robots: ResourceValue, resources: ResourceValue) {

    //     this.calls += 1;
    //     if (minutesLeft === 0) {
    //         return {
    //             max: resources.geode,
    //             robots: robots,
    //             resources: resources
    //         }
    //     }

    //     const key = `${minutesLeft}:(${robots.ore},${robots.clay},${robots.obsidian},${robots.geode}):(${resources.ore},${resources.clay},${resources.obsidian},${resources.geode})`;
    //     if (minutesLeft === 17) {
    //         console.log(`${key} ${this.calls.toLocaleString()} calls`);
    //     }
    //     if (this.memo.has(key)) {
    //         return this.memo.get(key);
    //     }


    //     const nextResources: ResourceValue = {
    //         ore: resources.ore + robots.ore,
    //         clay: resources.clay + robots.clay,
    //         obsidian: resources.obsidian + robots.obsidian,
    //         geode: resources.geode + robots.geode
    //     }

    //     // options: make an ore robot, make a clay robot, make an obsidian robot, make a geode robot, do nothing
    //     let result = {
    //         max: -1,
    //         robots: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
    //         resources: { ore: 0, clay: 0, obsidian: 0, geode: 0 },
    //         //messages: []
    //     }

    //     if (this.canMake(resources, this.costs.ore)) {
    //         const { rrobots, rresources } = this.makeRobot(nextResources, robots, "ore");
    //         const robot = this.evaluateStep(minutesLeft - 1, rrobots, rresources);
    //         if (robot.max > result.max) {
    //             result = robot;
    //         }
    //     }

    //     if (this.canMake(resources, this.costs.clay)) {
    //         const { rrobots, rresources } = this.makeRobot(nextResources, robots, "clay");
    //         const robot = this.evaluateStep(minutesLeft - 1, rrobots, rresources);
    //         if (robot.max > result.max) {
    //             result = robot;
    //         }

    //     }

    //     if (this.canMake(resources, this.costs.obsidian)) {
    //         const { rrobots, rresources } = this.makeRobot(nextResources, robots, "obsidian");
    //         const robot = this.evaluateStep(minutesLeft - 1, rrobots, rresources);
    //         if (robot.max > result.max) {
    //             result = robot;
    //         }

    //     }

    //     if (this.canMake(resources, this.costs.geode)) {
    //         // console.log(`Making an geode robot with ${minutesLeft} minutes left`);
    //         const { rrobots, rresources } = this.makeRobot(nextResources, robots, "geode");
    //         const robot = this.evaluateStep(minutesLeft - 1, rrobots, rresources);
    //         if (robot.max > result.max) {
    //             result = robot;
    //         }

    //     }

    //     // we can always do nothing
    //     const robot = this.evaluateStep(minutesLeft - 1, robots, nextResources);
    //     if (robot.max > result.max) {
    //         result = robot;
    //     }

    //     //this.memo.set(key, result);
    //     return result;
    // }

    get qualityLevel() {
        return this.index * this.evaluate();
    }
}

const processInput = async (day: number) => {
    return [];
};

const partOne = (input: Blueprint[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    return 0;
};

const partTwo = (input: Blueprint[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    return 0;
};

const resultOne = (_: Blueprint[], result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: Blueprint[], result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Blueprint[]) => {
    console.log(input);
};

const test = (_: Blueprint[]) => {
    console.log("----Test-----");

    const blueprint = new Blueprint(1, {
        ore: {
            ore: 4
        },
        clay: {
            ore: 2
        },
        obsidian: {
            ore: 3,
            clay: 14
        },
        geode: {
            ore: 2,
            obsidian: 7
        }
    });
    blueprint.show();
    console.log(blueprint.evaluate());

    const blueprint1 = new Blueprint(1, {
        ore: {
            ore: 2
        },
        clay: {
            ore: 3
        },
        obsidian: {
            ore: 3,
            clay: 8
        },
        geode: {
            ore: 3,
            obsidian: 12
        }
    });
    blueprint1.show();
    console.log(blueprint1.evaluate());

    const blueprint19 = new Blueprint(1, {
        ore: {
            ore: 3
        },
        clay: {
            ore: 3
        },
        obsidian: {
            ore: 3,
            clay: 9
        },
        geode: {
            ore: 3,
            obsidian: 7
        }
    });
    blueprint19.show();
    console.log(blueprint19.evaluate());
};

export const solutionNineteen: Puzzle<Blueprint[], number> = {
    day: 19,
    input: processInput,
    partOne,
    //partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
