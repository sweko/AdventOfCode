import { performance } from "perf_hooks";
import "../extra/array-helpers";
import { loopMatrix, readInputLines } from "../extra/aoc-helper";
import { printMatrix, generateModuloPrinter } from "../extra/terminal-helper";

const logOne = (...args) => { };//console.log;
const logTwo = (...args) => { };//console.log;
const logThree = console.log;

type Group = {
    name: string;
    type: "Immune" | "Infection";
    units: number;
    hitPoints: number;
    attack: {
        damage: number;
        type: string
    }
    initiative: number;
    immunities: string[];
    weaknesses: string[];
    // calculated fields:
    power?: number,
    isAttacked?: boolean;
}

type Army = Group[];

type Battle = {
    immune: Army;
    infection: Army;
}

async function main() {
    const startInput = performance.now();
    const lines = await readInputLines();
    const battle = getBattleData(lines);
    const endInput = performance.now();
    console.log(`Running time for input is ${Math.round(endInput - startInput)}ms`);

    const startOne = performance.now();
    const remainingUnits = processPartOne(battle);
    const endOne = performance.now();

    console.log(`Part 1: Remaining units: ${remainingUnits}`);
    console.log(`Running time for part 1 is ${Math.round(endOne - startOne)}ms`);

    const startTwo = performance.now();
    const { minBoost, boostUnits } = processPartTwo(lines);
    const endTwo = performance.now();

    console.log(`Part 2: Minimum boost is ${minBoost} with ${boostUnits} units left`);
    console.log(`Running time for part 2 is ${Math.round(endTwo - startTwo)}ms`);
}

const parseGroupLine = (line: string, index: number, type: "Immune" | "Infection"): Group => {
    const regex = /^(\d+) units each with (\d+) hit points (\((immune|weak) to ([^;]*)(; (immune|weak) to (.*))?\) )?with an attack that does (\d+) (.*) damage at initiative (\d+)$/;
    const match = line.match(regex);
    let immunities = [];
    let weaknesses = [];
    if (match[4] === "weak") {
        weaknesses = match[5].split(", ");
    }
    if (match[7] === "weak") {
        weaknesses = match[8].split(", ");
    }
    if (match[4] === "immune") {
        immunities = match[5].split(", ");
    }
    if (match[7] === "immune") {
        immunities = match[8].split(", ");
    }
    const result = {
        name: `${type} ${index + 1}`,
        type,
        units: Number(match[1]),
        hitPoints: Number(match[2]),
        attack: {
            damage: Number(match[9]),
            type: match[10]
        },
        initiative: Number(match[11]),
        immunities,
        weaknesses
    };
    resetGroup(result);
    return result;
}

const resetGroup = (group: Group) => {
    group.power = group.attack.damage * group.units;
    group.isAttacked = false;
}

const getBattleData = (lines: string[]): Battle => {
    const immuneLines = [];
    let index = 1;
    while (lines[index] !== "") {
        immuneLines.push(lines[index]);
        index += 1;
    }
    const infectionLines = [];
    index += 2;
    while (index < lines.length) {
        infectionLines.push(lines[index]);
        index += 1;
    }
    return {
        immune: immuneLines.map((line, index) => parseGroupLine(line, index, "Immune")).sort(groupComparer),
        infection: infectionLines.map((line, index) => parseGroupLine(line, index, "Infection")).sort(groupComparer)
    };
}

const groupComparer = (first: Group, second: Group) => {
    if (first.power !== second.power) {
        return second.power - first.power;
    }
    return second.initiative - first.initiative;
}

const attackComparer = (army: Group) => (first: Group, second: Group) => {
    const fdamage = army.power * (first.weaknesses.includes(army.attack.type) ? 2 : 1);
    const sdamage = army.power * (second.weaknesses.includes(army.attack.type) ? 2 : 1);

    if (fdamage !== sdamage) {
        return sdamage - fdamage;
    }
    if (first.power !== second.power) {
        return second.power - first.power;
    }
    return second.initiative - first.initiative;
}

function runBattle(battle: Battle): Battle {
    while ((battle.immune.length !== 0) && (battle.infection.length !== 0)) {
        logOne("--NEW ROUND--");
        const attacks: { attacker: Group, victim: Group }[] = [];
        for (const army of battle.immune) {
            const applicables = battle.infection
                .filter(g => !g.isAttacked)
                .filter(g => !g.immunities.includes(army.attack.type))
                .sort(attackComparer(army));

            if (applicables.length > 0) {
                const victim = applicables[0];
                //const damage = army.power * (victim.weaknesses.includes(army.attack.type) ? 2 : 1);
                //if (applicables[0].hitPoints <= damage) {
                    applicables[0].isAttacked = true;
                    attacks.push({ attacker: army, victim });
                //}
            }
        }
        for (const army of battle.infection) {
            const applicables = battle.immune
                .filter(g => !g.isAttacked)
                .filter(g => !g.immunities.includes(army.attack.type))
                .sort(attackComparer(army));

            if (applicables.length > 0) {
                const victim = applicables[0];
                //const damage = army.power * (victim.weaknesses.includes(army.attack.type) ? 2 : 1);
                //if (applicables[0].hitPoints <= damage) {
                    applicables[0].isAttacked = true;
                    attacks.push({ attacker: army, victim });
                //}
            }
        }

        attacks.sort((a, b) => b.attacker.initiative - a.attacker.initiative);
        let totalKilled = 0;
        for (const attack of attacks) {
            const { attacker, victim } = attack;
            const damage = attacker.power * (victim.weaknesses.includes(attacker.attack.type) ? 2 : 1);
            logOne(`${attack.attacker.name} attacks ${attack.victim.name} for ${damage} damage`);
            let killed = Math.floor(damage / victim.hitPoints);
            if (killed >= victim.units) {
                killed = victim.units;
                if (victim.type === "Immune") {
                    const index = battle.immune.findIndex(a => a.name === victim.name);
                    battle.immune.splice(index, 1);
                    logTwo(`  ${attack.victim.name} dies`);
                } else {
                    const index = battle.infection.findIndex(a => a.name === victim.name);
                    battle.infection.splice(index, 1);
                }
            }
            logOne(`  ${killed} units killed`);
            victim.units -= killed;
            totalKilled += killed;
            resetGroup(victim);
        }

        battle.immune = battle.immune.sort(groupComparer);
        battle.infection = battle.infection.sort(groupComparer);
        if (totalKilled === 0) {
            return battle;
        }
    }
    return battle;
}

function processPartOne(battle: Battle): number {
    battle = runBattle(battle);
    return battle.immune.sum(g => g.units) + battle.infection.sum(g => g.units);
}


// Minimum boost is 63 with 8654 units left - too low, 
// Winning at boost 65 by 8996 units - too high
// Minimum boost is 65 with 9004 units left
function processPartTwo(lines: string[]): { minBoost: number, boostUnits: number } {
    let boost = 0;
    let goodGuysLose = true;
    while (goodGuysLose) {
        let battle = getBattleData(lines);

        for (const immune of battle.immune) {
            immune.attack.damage += boost;
            resetGroup(immune);
        }

        battle = runBattle(battle);

        if (battle.immune.length === 0) {
            logThree(`Losing at boost ${boost} by ${battle.infection.sum(g => g.units)} units`);
            boost += 1;
        } else if (battle.infection.length === 0) {
            logThree(`Winning at boost ${boost} by ${battle.immune.sum(g => g.units)} units`);
            return {
                boostUnits: battle.immune.sum(g => g.units),
                minBoost: boost
            }
        } else {
            logThree(`Stalemate at boost ${boost} by ${battle.immune.sum(g => g.units)} vs ${battle.infection.sum(g => g.units)} units`);
            boost += 1;
        }
    }

    return {
        minBoost: 1,
        boostUnits: 2
    }
}

main();