export function memoize(f: (arg: number | string) => any) {
    const resDict = {};
    const result = (rarg: number | string) => {
        if (resDict[rarg] === undefined) {
            resDict[rarg] = f(rarg);
        }
        return resDict[rarg];
    }
    return result;
}

export const factoriel = memoize((num: number) => {
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
        getAllPermutations(source.filter(s => s !== item))
            .map(perm => [item, ...perm])
    );
    return result.flatMap(x => x);
}

export function gcd(first: number, second: number) {
    while (second) {
        const temp = second;
        second = first % second;
        first = temp;
    }
    return first;
}

export function lcm(first: number, second: number) {
    return first / gcd(first, second) * second;
}

export function absmod(n: number, m: number) {
    return ((n % m) + m) % m;
}

export function mulmod(a: number, b: number, mod: number) {
    a = absmod(a, mod);
    b = absmod(b, mod);
    if (a * b < Number.MAX_SAFE_INTEGER) {
        return absmod(a * b, mod);
    };
    const max = Math.max(a, b);
    const min = Math.min(a, b);

    const factor = Math.floor(Number.MAX_SAFE_INTEGER / max);

    if (factor === 1) {
        throw Error("this won't work");
    };

    // min = k * factor + m;
    const k = Math.floor(min / factor);
    const m = min - k * factor;

    return absmod(mulmod(max * factor, k, mod)  + mulmod(max, m, mod), mod);
}

/**
 * Only works when mod is prime
 */
export function modinverse(value: number, mod: number) {
    return powmod(value, mod-2, mod);
}

export function powmod(a: number, exp: number, mod: number) {
    const digits = exp.toString(2).split("").map(c => Number(c)).slice(1);
    let result = a;
    
    for (const digit of digits) {
        result = mulmod(result, result, mod);
        if (digit === 1) {
            result = mulmod(result, a, mod);
        }
    }
    return result;
}