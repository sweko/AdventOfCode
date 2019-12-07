export function memoize(f: (arg: number | string) => any) {
    const resDict = {};
    const result = (rarg: number | string) => {
        console.log("memoization");
        if (resDict[rarg] === undefined) {
            resDict[rarg] = f(rarg);
        }
        return resDict[rarg];
    }
    return result;
}

export const factoriel = memoize((num: number) => {
    console.log("called");
    let index = 2;
    let result = 1;
    while (index <= num) {
        result *= index;
        index += 1;
    }
    return result;
});

export function range(to: number): number[] {
    return Array(to).fill(0).map((_, index) => index);
}

export function getAllPermutations<T>(source: T[]): T[][] {
    if (source.length === 0) {
        return [[]];
    };
    const result = source.map(item => 
        getAllPermutations(source.filter(s => s!== item))
        .map(perm => [item, ...perm])    
    ); 
    return result.flatMap(x => x);
}

export function getPermutation(of: number, index: number) {
    const limit = factoriel(of);

}