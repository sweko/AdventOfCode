import { performance } from "perf_hooks";
import "../extra/array-helpers";


async function main() {
    const startInput = performance.now();

    const recipeCount = 793061;
    const startRecipes = [3, 7];

    const endInput = performance.now();
    console.log(`Running time for input is ${Math.round(endInput - startInput)}ms`);

    const startOne = performance.now();
    const nextScores = processPartOne(recipeCount, startRecipes);
    const endOne = performance.now();

    console.log(`Part 1: Next ten scores are ${nextScores}`);
    console.log(`Running time for part 1 is ${Math.round(endOne - startOne)}ms`);

    const startTwo = performance.now();
    const lenBefore = processPartTwo(recipeCount, startRecipes);
    const endTwo = performance.now();

    console.log(`Part 2: First appearance at position ${lenBefore}`);
    console.log(`Running time for part 2 is ${Math.round(endTwo - startTwo)}ms`);
}

function processPartOne(recipeCount: number, startRecipes: number[]): string {

    const recipes = startRecipes.slice();
    let firstIndex = 0;
    let secondIndex = 1;

    while (true) {
        const sum = recipes[firstIndex] + recipes[secondIndex];
        if (sum < 10) {
            recipes.push(sum);
        } else {
            recipes.push((sum / 10) | 0);
            recipes.push(sum % 10);
        }

        firstIndex = (1 + firstIndex + recipes[firstIndex]) % recipes.length;
        secondIndex = (1 + secondIndex + recipes[secondIndex]) % recipes.length;

        if (recipes.length > recipeCount + 10) {
            const result = recipes.slice(recipeCount, recipeCount + 10);
            return result.join("");
        }
    }
}

function checkRecipeTail(recipes: Int8Array, recipeLength: number, target: number[]) {

    // console.log("checkRecipeTail", recipes.slice(0, recipeLength+3), recipeLength, target);

    if (recipeLength < target.length) {
        return false;
    }
    for (let index = 0; index < target.length; index++) {
        if (target[index] !== recipes[recipeLength - target.length + index]) {
            return false;
        }
    }
    return true;
}

function processPartTwo(targetNumber: number, startRecipes: number[]): number {

    const recipes = new Int8Array(100000000);
    //const printer = generateModuloPrinter(1000);

    let recipeLength = startRecipes.length;
    for (let index = 0; index < startRecipes.length; index++) {
        recipes[index] = startRecipes[index];
    }

    let firstIndex = 0;
    let secondIndex = 1;
    const target = targetNumber.toString().split("").map(c => Number(c));

    while (true) {
        const sum = recipes[firstIndex] + recipes[secondIndex];
        if (sum < 10) {
            recipes[recipeLength] = sum;
            recipeLength += 1;
        } else {
            recipes[recipeLength] = (sum / 10) | 0;
            recipeLength += 1;
            recipes[recipeLength] = sum % 10;
            recipeLength += 1;
        }

        firstIndex = (1 + firstIndex + recipes[firstIndex]) % recipeLength;
        secondIndex = (1 + secondIndex + recipes[secondIndex]) % recipeLength;

        if (checkRecipeTail(recipes, recipeLength, target)) {
            return recipeLength - target.length;
        }

        if (checkRecipeTail(recipes, recipeLength - 1, target)) {
            return recipeLength - target.length - 1;
        }

        //printer(recipeLength);
    }
}

main();