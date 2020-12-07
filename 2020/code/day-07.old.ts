import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface IBag {
    type: string;
    color: string;
}

interface BigBag extends IBag {
    bags: BagQuantity[];
}

interface BagQuantity extends IBag {
    quantity: number;
}

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    const regex = /^([a-z]+) ([a-z]+) bags contain (.*)\.$/;
    const regex2 = /^(\d+) ([a-z]+) ([a-z]+) bags?$/;
    const result: BigBag[] = input.map(line => {
        const match = line.match(regex);
        return {
            type: match[1],
            color: match[2],
            bags: match[3].split(", ").map(bag => {
                const m2 = bag.match(regex2);
                if (m2) {
                    return {
                        type: m2[2],
                        color: m2[3],
                        quantity: +m2[1]
                    }
                } else {
                    return undefined;
                }
            }).filter(x=>x)
        };
    });
    console.log(result[0]);
    return result;
};

const cmp = (first: IBag, second: IBag) => first.type === second.type && first.color === second.color;

const partOne = (input: BigBag[], debug: boolean) => {
    let targets = [{type: 'shiny', color: 'gold'}];
    let sources = input.slice();
    let result = 0;

    while (true) {
        const newTargets = sources.filter(bag => targets.some(tgt => bag.bags.find(sb => cmp(sb, tgt))));
        result += newTargets.length;
        if (newTargets.length === 0) {
            break;
        }
        sources = sources.filter(bag => targets.every(tgt => !bag.bags.find(sb => cmp(sb, tgt))));
        targets = newTargets;
    }

    return result;
};

const getWeight = (allBags: BigBag[], bag: BigBag) => {
    if (!bag.bags) {
        console.log("here");
    }
    return 1 + bag.bags.map(subbag => {
        const child = allBags.find(ab => cmp(ab, subbag));
        return getWeight(allBags, child) * subbag.quantity;
    }).sum();
}

const partTwo = (input: BigBag[], debug: boolean) => {
    let target = {type: 'shiny', color: 'gold'};
    const shiny = input.find(bag => cmp(bag, target));
    return getWeight(input, shiny)-1;
};

const resultOne = (_: any, result: number) => {
    return `Total number of bag types is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `The period of the orbit is ${result}`;
};

const showInput = (input: BigBag[]) => {
    console.log(input);
};

const test = (_: BigBag[]) => {
    console.log("----Test-----");
};

export const solutionSeven: Puzzle<BigBag[], number> = {
    day: 7,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
