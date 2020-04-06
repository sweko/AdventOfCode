import { readInputLines, debugLog } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Battlefield {
    immune: Group[];
    infection: Group[];
}

interface Group {
    name: string;
    side: "infection" | "immunity";
    units: number;
    hitpoints: number;
    weak: string[];
    immune: string[];
    damage: number;
    attack: string;
    initiative: number;
}

const processLine = (line: string): Group => {
    const lineRegex = /(\d+) units each with (\d+) hit points( \(.+\))? with an attack that does (\d+) (.+) damage at initiative (\d+)/;
    const skillRegex = /(weak|immune) to ((\w+)(, (\w+))?)/
    const match = line.match(lineRegex);
    const details = match[3];
    const result: Group = {
        name: undefined,
        side: undefined,
        units: parseInt(match[1]),
        hitpoints: parseInt(match[2]),
        damage: parseInt(match[4]),
        attack: match[5],
        initiative: parseInt(match[6]),
        immune: [],
        weak: []
    };
    if (details) {
        const matches = details.slice(2).slice(0, -1).split(";").map(s => s.trim()).map(s => s.match(skillRegex));
        for (const match of matches) {
            if (match[1] === "immune") {
                result.immune.push(match[3]);
                if (match[5]) {
                    result.immune.push(match[5]);
                }
            } else {
                result.weak.push(match[3]);
                if (match[5]) {
                    result.weak.push(match[5]);
                }
            }
        }
    }
    return result;
}

const processInput = async (day: number): Promise<Battlefield> => {
    const lines = await readInputLines(day);

    const immunes = lines.slice(1).takeWhile(line => line !== '');
    const infection = lines.skipWhile(line => line !== '').slice(2);

    let immuneIndex = 0;
    let infectionIndex = 0;

    return {
        immune: immunes.map(line => ({
            ...processLine(line),
            side: "immunity",
            name: `Group ${++immuneIndex}`
        })),
        infection: infection.map(line => ({
            ...processLine(line),
            side: "infection",
            name: `Group ${++infectionIndex}`
        })),
    };
};

const getEffectivePower = (group: Group) => group.units * group.damage;

const calcDamage = (attacker: Group, defender: Group) => {
    if (defender.immune.includes(attacker.attack)) {
        return 0;
    }
    const power = getEffectivePower(attacker);
    const weakFaktor = defender.weak.includes(attacker.attack) ? 2 : 1;
    return weakFaktor * power;
}

const copyBattlefield = (source: Battlefield): Battlefield => JSON.parse(JSON.stringify(source));

const runFight = (input: Battlefield, debug: boolean) => {
    const battlefield = copyBattlefield(input);
    let round = 0;

    while (battlefield.immune.some(g => g) && battlefield.infection.some(g => g)) {
        debugLog(debug, `--- NEW ROUND BEGINS #${++round} ---`)
        const groups = battlefield.immune.concat(battlefield.infection);
        groups.sort((f, s) => {
            const powerDiff = getEffectivePower(s) - getEffectivePower(f);
            return powerDiff || (s.initiative - f.initiative);
        });

        const targeted = [];
        const attacks: { from: Group, to: Group }[] = [];
        let totalKills = 0;

        for (const group of groups) {
            const targets = groups
                .filter(g => g.side !== group.side)
                .filter(g => !targeted.includes(g));

            targets.sort((f, s) => {
                const fdamage = calcDamage(group, f);
                const sdamage = calcDamage(group, s);
                if (sdamage - fdamage !== 0) {
                    return sdamage - fdamage;
                };
                const fpower = getEffectivePower(f);
                const spower = getEffectivePower(s);
                if (spower - fpower !== 0) {
                    return spower - fpower;
                };
                return s.initiative - f.initiative;
            });

            if (targets.length === 0) {
                continue;
            }

            const target = targets[0];
            if (calcDamage(group, target) === 0) {
                continue;
            } else {
                targeted.push(target);
                attacks.push({ from: group, to: target });
            }
        }

        attacks.sort((f, s) => s.from.initiative - f.from.initiative);

        for (let index = 0; index < attacks.length; index++) {
            const attacker = attacks[index].from;
            const target = attacks[index].to;
            const damage = calcDamage(attacker, target);
            let kills = (damage / target.hitpoints) | 0;
            if (kills > target.units) {
                kills = target.units;
            }
            target.units -= kills;
            totalKills += kills;
            debugLog(debug, `${attacker.side} ${attacker.name} attacks ${target.side} ${target.name} for ${damage} damage with ${kills} kills`);
        }

        battlefield.immune = battlefield.immune.filter(g => g.units !== 0);
        battlefield.infection = battlefield.infection.filter(g => g.units !== 0);

        if (totalKills === 0){
            // stale-mate
            debugLog(debug, "STALEMATE")
            return battlefield;
        }
    }
    return battlefield;
}


const partOne = (input: Battlefield, debug: boolean) => {
    const result = runFight(input, debug);
    return result.immune.concat(result.infection).sum(g => g.units);
};

const boost = (source: Battlefield, boost: number) => {
    const result = copyBattlefield(source);
    for (const immuneGroup of result.immune) {
        immuneGroup.damage += boost;
    }
    return result;
}

const partTwo = (input: Battlefield, debug: boolean) => {
    let boostAmmount = 0;
    while (true) {
        boostAmmount +=1;
        const boosted = boost(input, boostAmmount);
        const result = runFight(boosted, false);
        if (result.infection.length === 0) {
            debugLog(debug, `Running for boost ${boostAmmount}: Immune system WINS!`);
            return result.immune.sum(g => g.units);
        }

        if (result.immune.length === 0) {
            debugLog(debug, `Running for boost ${boostAmmount}: Immune system loses`);
        } else {
            debugLog(debug, `Running for boost ${boostAmmount}: Stalemate`);
        }
    }
};

const resultOne = (_: any, result: number) => {
    return `Total of ${result} units have survived`;
};

const resultTwo = (_: any, result: number) => {
    return `Total of ${result} immune system units have survived`;
};

const showInput = (input: Battlefield) => {
    console.log(input);
};

const test = (input: Battlefield) => {
    console.log("----Test-----");
};

export const solution24_2018: Puzzle<Battlefield, number> = {
    day: 242018,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
