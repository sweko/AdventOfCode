import { readInputLines, readInput, debugLog } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";


interface Reactant {
    quantity: number;
    type: string
}

interface Reaction {
    sources: Reactant[];
    dest: Reactant;
}

interface ReactionNode {
    product: string;
    quantity: number;
    subReactions: ReactionNode[];
}

interface ProductReaction {
    product: string;
    quantity: number;
    sources: Reactant[];
}

const toReactionPart = (part: string) => {
    const [q, type] = part.split(" ");
    const quantity = Number(q);
    return { quantity, type }
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const result = lines.map(line => {
        const match = line.match(/^(.+) => (.+)$/);
        const from = match[1].split(", ").map(toReactionPart);
        return {
            sources: from,
            dest: toReactionPart(match[2])
        };
    });

    return result;
};

const updateSources = (child: Reactant, times: number, sources: Reactant[]) => {
    const quantity = child.quantity * times;
    const existing = sources.find(s => s.type === child.type);
    if (existing) {
        existing.quantity += quantity;
    }
    else {
        sources.push({
            type: child.type,
            quantity
        });
    }
}

const partOne = (input: Reaction[], debug: boolean) => {
    const reactions: Reaction[] = JSON.parse(JSON.stringify(input));
    const byProduct = reactions
        .groupBy(item => item.dest.type)
        .map(kvp => ({
            product: kvp.key,
            quantity: kvp.items[0].dest.quantity,
            sources: kvp.items[0].sources
        }));

    const fuel: ProductReaction = byProduct.find(p => p.product === "FUEL")
    const leftovers: { [key: string]: number } = {};

    let antecendants = byProduct.filter(p => fuel.sources.map(s => s.type).includes(p.product));
    while (antecendants.length > 0) {
        for (const antecendant of antecendants) {
            const pindex = fuel.sources.findIndex(s => s.type === antecendant.product);
            const precursor = fuel.sources[pindex];

            const existing = leftovers[antecendant.product] || 0;
            if (existing >= precursor.quantity) {
                leftovers[antecendant.product] -= precursor.quantity;
            } else {
                const times = Math.ceil((precursor.quantity - existing) / antecendant.quantity);
                const leftover = (antecendant.quantity * times + existing) - precursor.quantity;
                leftovers[antecendant.product] = leftover;
                for (const child of antecendant.sources) {
                    updateSources(child, times, fuel.sources);
                }
            }
            fuel.sources.splice(pindex, 1);
        }
        antecendants = byProduct.filter(p => fuel.sources.map(s => s.type).includes(p.product));
    }
    return fuel.sources[0].quantity;
};

const partTwo = (input: Reaction[], debug: boolean) => {
    const oreAmmount = 1000000000000;
    let usedAmmount = 0;
    let fuelCount = 0;
    const leftovers: { [key: string]: number } = {};

    while (oreAmmount > usedAmmount) {
        const reactions: Reaction[] = JSON.parse(JSON.stringify(input));
        const byProduct = reactions
            .groupBy(item => item.dest.type)
            .map(kvp => ({
                product: kvp.key,
                quantity: kvp.items[0].dest.quantity,
                sources: kvp.items[0].sources
            }));
        const fuel: ProductReaction = byProduct.find(p => p.product === "FUEL");
        let factor = 1;
        if (usedAmmount / oreAmmount < 0.8) {
            factor = 100000;
        } else if (usedAmmount / oreAmmount < 0.99) {
            factor = 1000;
        } else if (usedAmmount / oreAmmount < 0.999) {
            factor = 10;
        }
        fuel.quantity *= factor;
        for (const source of fuel.sources) {
            source.quantity *= factor;
        }

        let antecendants = byProduct.filter(p => fuel.sources.map(s => s.type).includes(p.product));
        while (antecendants.length > 0) {
            for (const antecendant of antecendants) {
                const pindex = fuel.sources.findIndex(s => s.type === antecendant.product);
                const precursor = fuel.sources[pindex];

                const existing = leftovers[antecendant.product] || 0;
                if (existing >= precursor.quantity) {
                    leftovers[antecendant.product] -= precursor.quantity;
                } else {
                    const times = Math.ceil((precursor.quantity - existing) / antecendant.quantity);
                    const leftover = (antecendant.quantity * times + existing) - precursor.quantity;
                    leftovers[antecendant.product] = leftover;
                    for (const child of antecendant.sources) {
                        updateSources(child, times, fuel.sources);
                    }
                }
                fuel.sources.splice(pindex, 1);
            }
            antecendants = byProduct.filter(p => fuel.sources.map(s => s.type).includes(p.product));
        }
        usedAmmount += fuel.sources[0].quantity;
        if (usedAmmount <= oreAmmount) {
            fuelCount += factor;
        }
        //if (fuelCount % 5001 === 0) {
        debugLog(debug, `Made a fuel for ${fuel.sources[0].quantity.toLocaleString()}, total ${usedAmmount.toLocaleString()}`);
        //}
    }
    return fuelCount;
};

const resultOne = (_: any, result: number) => {
    return `Total ${result} ORE units are required`;
};

const resultTwo = (_: any, result: number) => {
    return `Total amount of fuel produced is ${result}`;
};

const showInput = (input: Reaction[]) => {
    console.log(input);
};

const test = (input: Reaction[]) => {
};

export const solution14: Puzzle<Reaction[], number> = {
    day: 14,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}


