import * as fs from 'fs';
import {promisify} from 'util';

const DEBUG = true;

const readFile = promisify(fs.readFile);

const enum Army {
    IMMUNE,
    INFECTION
}

interface Group {
    army: Army;
    units: number;
    hp: number;
    attackDamage: number;
    attackType: string;
    initiative: number;
    weaknesses: Set<string>;
    immunities: Set<string>;
}

(async () => {
    const input = await readFile('./temp/input', {encoding: 'utf8'});
    const lines = input.trim().split('\r\n');
    const groups = parse(lines);

    const answer1 = part1(groups);
    console.log(`Answer to part 1: ${answer1}`);

    const answer2 = part2(groups);
    console.log(`Answer to part 2: ${answer2}`);
})();

function parse(lines: string[]): Group[] {
    const groups: Group[] = [];

    let i = 0;
    i++; // Immune System:
    for (; i < lines.length; i++) {
        const line = lines[i];
        if (line === '') break;
        groups.push(parseGroup(line, Army.IMMUNE));
    }

    i++; // empty line
    i++; // Infection:
    for (; i < lines.length; i++) {
        const line = lines[i];
        if (line === '') break;
        groups.push(parseGroup(line, Army.INFECTION));
    }

    return groups;
}

function parseGroup(line: string, army: Army): Group {
    const [, units, hp, immunitiesAndWeaknesses, attackDamage, attackType, initiative] = line.match(/^(\d+) units each with (\d+) hit points(?: \(([^)]+)\))? with an attack that does (\d+) (\w+) damage at initiative (\d+)$/)!;

    let immunities: string[] = [];
    let weaknesses: string[] = [];
    if (immunitiesAndWeaknesses) {
        for (let immunityOrWeakness of immunitiesAndWeaknesses.split('; ')) {
            const [, weakOrImmune, types] = immunityOrWeakness.match(/^(weak|immune) to ([\w, ]+)$/)!;
            (weakOrImmune === 'weak' ? weaknesses : immunities).push(...types.split(', '));
        }
    }

    return {
        army,
        units: Number(units),
        hp: Number(hp),
        immunities: new Set(immunities),
        weaknesses: new Set(weaknesses),
        attackDamage: Number(attackDamage),
        attackType,
        initiative: Number(initiative)
    };
}

function cloneGroup(group: Group): Group {
    return {
        army: group.army,
        units: group.units,
        hp: group.hp,
        immunities: new Set(group.immunities),
        weaknesses: new Set(group.weaknesses),
        attackDamage: group.attackDamage,
        attackType: group.attackType,
        initiative: group.initiative
    };
}

function getEffectivePower(group: Group): number {
    return group.units * group.attackDamage;
}

function compareByEffectivePower(left: Group, right: Group): number {
    return getEffectivePower(left) - getEffectivePower(right);
}

function compareByInitiative(left: Group, right: Group): number {
    return left.initiative - right.initiative;
}

function compareByTargetSelectionOrder(left: Group, right: Group): number {
    return compareByEffectivePower(left, right)
        || compareByInitiative(left, right);
}

function getDamage(attacker: Group, defender: Group): number {
    // By default, an attacking group would deal damage equal to its effective power to the defending group.
    let damage = getEffectivePower(attacker);
    // However, if the defending group is immune to the attacking group's attack type,
    // the defending group instead takes no damage
    if (defender.immunities.has(attacker.attackType)) {
        return 0;
    }
    // if the defending group is weak to the attacking group's attack type,
    // the defending group instead takes double damage.
    if (defender.weaknesses.has(attacker.attackType)) {
        damage *= 2;
    }
    return damage;
}

class ImmuneSystemLostError extends Error {
}

function fight(groups: Group[], stopIfImmuneSystemLoses: boolean): Group[] {
    groups = groups.map(cloneGroup);

    // Target selection
    // In decreasing order of effective power, groups choose their targets;
    // in a tie, the group with the higher initiative chooses first.
    const groupsByTargetSelectionOrder = [...groups].sort(compareByTargetSelectionOrder).reverse();
    const targetSelection = new Map<Group, Group>();
    const defenders = new Set(groups);
    let isImmuneSystemAttacking = false;
    for (const attacker of groupsByTargetSelectionOrder) {
        // During the target selection phase, each group attempts to choose one target.
        const enemies = [...defenders].filter(group => group.army !== attacker.army);
        if (enemies.length === 0) {
            continue;
        }
        const enemiesByPreference = enemies.sort((left, right) => {
            // The attacking group chooses to target the group in the enemy army to which it would deal the most damage
            // (after accounting for weaknesses and immunities, but not accounting for whether the defending group has
            // enough units to actually receive all of that damage).
            return (getDamage(attacker, left) - getDamage(attacker, right))
                // If an attacking group is considering two defending groups to which it would deal equal damage,
                // it chooses to target the defending group with the largest effective power
                || compareByEffectivePower(left, right)
                // if there is still a tie, it chooses the defending group with the highest initiative.
                || compareByInitiative(left, right);
        });
        const enemy = enemiesByPreference[enemiesByPreference.length - 1];
        // If it cannot deal any defending groups damage, it does not choose a target.
        if (getDamage(attacker, enemy) === 0) {
            continue;
        }
        targetSelection.set(attacker, enemy);
        // Defending groups can only be chosen as a target by one attacking group.
        defenders.delete(enemy);
        if (attacker.army === Army.IMMUNE) {
            isImmuneSystemAttacking = true;
        }
    }

    // Optimization: If the immune system cannot do any damage to the infection, then it is doomed to lose.
    // This happens when the infection is immune to all remaining units of the immune system.
    if (stopIfImmuneSystemLoses && !isImmuneSystemAttacking) {
        throw new ImmuneSystemLostError();
    }

    // Attacking
    // Groups attack in decreasing order of initiative, regardless of whether they are part of the infection
    // or the immune system.
    const attackers = [...targetSelection.keys()].sort(compareByInitiative).reverse();
    for (const attacker of attackers) {
        // If a group contains no units, it cannot attack.
        if (attacker.units === 0) {
            continue;
        }
        const defender = targetSelection.get(attacker)!;
        const damage = getDamage(attacker, defender);
        // The defending group only loses whole units from damage; damage is always dealt in such a way that it kills
        // the most units possible, and any remaining damage to a unit that does not immediately kill it is ignored.
        const killedUnits = Math.floor(damage / defender.hp);
        defender.units = Math.max(0, defender.units - killedUnits);
    }

    groups = groups.filter(group => group.units > 0);

    return groups;
}

function bothArmiesStillContainUnits(groups: Group[]): boolean {
    return groups.some(group => group.army === Army.IMMUNE)
        && groups.some(group => group.army === Army.INFECTION);
}

function fightToTheDeath(groups: Group[], stopIfImmuneSystemLoses: boolean = false): Group[] {
    do {
        groups = fight(groups, stopIfImmuneSystemLoses);
        // After the fight is over, if both armies still contain units, a new fight begins;
        // combat only ends once one army has lost all of its units.
    } while (bothArmiesStillContainUnits(groups));
    return groups;
}

function part1(groups: Group[]): number {
    groups = fightToTheDeath(groups);
    const units = groups.reduce((total, group) => total + group.units, 0);
    if (DEBUG) {
        console.log(groups);
    }
    return units;
}

function boostImmuneSystem(groups: Group[], boost: number): Group[] {
    return groups.map(cloneGroup).map(group => {
        if (group.army === Army.IMMUNE) {
            group.attackDamage += boost;
        }
        return group;
    });
}

function getWinner(groups: Group[]): Army {
    try {
        groups = fightToTheDeath(groups, true);
        return groups[0].army;
    } catch (e) {
        if (e instanceof ImmuneSystemLostError) {
            return Army.INFECTION;
        }
        throw e;
    }
}

function part2(groups: Group[]): number {
    let minBoost = 0;
    let maxBoost = 100; // Found through trial and error. Might be higher for different inputs.

    let boost: number;
    let boostedGroups: Group[];
    do {
        boost = Math.floor((minBoost + maxBoost) / 2);
        boostedGroups = boostImmuneSystem(groups, boost);
        if (getWinner(boostedGroups) === Army.IMMUNE) {
            maxBoost = boost - 1;
        } else {
            minBoost = boost + 1;
        }
    } while (minBoost <= maxBoost);

    const winningArmy = fightToTheDeath(boostedGroups);
    const units = winningArmy.reduce((total, group) => total + group.units, 0);
    if (DEBUG) {
        console.log({boost, winningArmy, units});
    }

    return units;
}