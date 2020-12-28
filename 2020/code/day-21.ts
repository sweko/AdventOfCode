import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { toArray, toHash } from "../extra/hash-helpers";
import { getAllVariations } from "../extra/num-helpers";
import { Puzzle } from "./model";

interface Food {
    ingredients: string[];
    allergens: string[];
}

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    const regex = /^((?:\w+ ?)*) \(contains ((?:\w+(?:, )?)*)\)$/;
    return input.map(line => {
        const match = line.match(regex);
        const ingredients = match[1].split(" ");
        const allergens = match[2].split(", ");
        return { ingredients, allergens };
    })
};

const getAllergyData = (input: Food[]) => {
    const allergenArray = Array.from(new Set(input.map(food => food.allergens).flat()));
    const allergens =toHash(allergenArray, allergen => allergen, _ => true);

    const ingredients = Array.from(new Set(input.map(food => food.ingredients).flat())).map(ingredient => ({
        ingredient,
        allergens: {...allergens}
    }));

    for (const food of input) {
        for (const ingredient of ingredients) {
            for (const allergen of food.allergens) {
                if (!food.ingredients.includes(ingredient.ingredient)) {
                    ingredient.allergens[allergen] = false;
                }
            }
        }
    }

    const data = ingredients.map(item => ({
        ingredient: item.ingredient,
        allergens: toArray(item.allergens, (key, value) => value ? key : null).filter(allergen => allergen)
    }));

    return data;
}

const partOne = (input: Food[], debug: boolean) => {
    
    const safeFoods = getAllergyData(input)
    .filter(item => item.allergens.length === 0)
    .map(item => item.ingredient);
    
    let count = 0;
    for (const food of input) {
        for (const ingredient of food.ingredients) {
            if (safeFoods.includes(ingredient)) {
                count -=- 1;
            }
        }
    }

    return count;
};

const partTwo = (input: Food[], debug: boolean) => {
    let allergyData = getAllergyData(input).filter(item => item.allergens.length !== 0);

    const allergens: [string, string][] = [];

    while (allergyData.length > 0) {
        const knowns = allergyData.filter(item => item.allergens.length === 1);
        for (const item of knowns) {
            allergens.push([item.ingredient, item.allergens[0]]);
        }
        const knownAllergens = knowns.map(item => item.allergens[0]);
        for (const item of allergyData) {
            item.allergens = item.allergens.filter(allergen => !knownAllergens.includes(allergen));
        }
        allergyData = allergyData.filter(item => item.allergens.length !== 0);
    }

    const solution = allergens.sort((f, s) => f[1].localeCompare(s[1])).map(pair => pair[0]).join(",");

    console.log(solution);
    return 0;
};

const resultOne = (_: any, result: number) => {
    return `Total safe food appearances are ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `^^^^^^^^^^^^^^^^^`;
};

const showInput = (input: Food[]) => {
    console.log(input);
};

const test = (_: Food[]) => {
    console.log("----Test-----");
};

export const solutionTwentyOne: Puzzle<Food[], number> = {
    day: 21,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
