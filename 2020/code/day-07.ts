import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface IBag {
    name: string;
}

interface BigBag extends IBag {
    bags: BagQuantity[];
}

interface BagQuantity extends IBag {
    quantity: number;
}

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    const regex = /^([a-z]+ [a-z]+) bags contain (.*)\.$/;
    const regex2 = /^(\d+) ([a-z]+ [a-z]+) bags?$/;
    const result: BigBag[] = input.map(line => {
        const match = line.match(regex);
        return {
            name: match[1],
            bags: match[2].split(", ").map(bag => {
                const m2 = bag.match(regex2);
                if (m2) {
                    return {
                        name: m2[2],
                        quantity: +m2[1]
                    }
                } else {
                    return undefined;
                }
            }).filter(x=>x)
        };
    });
    return result;
};

const partOne = (input: BigBag[], debug: boolean) => {
    let targets = ['shiny gold'];
    let sources = input.slice();
    let result = 0;

    while (targets.length !== 0) {
        const next = sources.filter(bag => targets.some(tgt => bag.bags.find(sb => sb.name === tgt)));
        result += next.length;
        sources = sources.filter(bag => targets.every(tgt => !bag.bags.find(sb => sb.name === tgt)));
        targets = next.map(tgt => tgt.name);
    }

    return result;
};

const getWeight = (allBags: BigBag[], bag: BigBag) => {
    return 1 + bag.bags.map(subbag => {
        const child = allBags.find(ab => ab.name === subbag.name);
        return getWeight(allBags, child) * subbag.quantity;
    }).sum();
}

const partTwo = (input: BigBag[], debug: boolean) => {
    const shiny = input.find(bag => bag.name === 'shiny gold');
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
