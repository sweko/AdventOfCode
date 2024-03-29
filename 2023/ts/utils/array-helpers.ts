interface Array<T> {
    groupBy<U>(
        keySelector: (item: T, index: number) => U,
        keyEquality?: (first: U, second: U) => boolean
    ): { key: U, items: T[] }[];
    groupReduce<U, V>(
        keySelector: (item: T, index: number) => U,
        reducer: (accumulator: V, item: T) => V,
        initial: V): { key: U, value: V }[];
    sum(selector?: (item: T, index: number) => number): number;

    min(selector?: (item: T, index: number) => number): number;
    max(selector?: (item: T, index: number) => number): number;

    minFind(selector?: (item: T, index: number) => number): T | null;
    maxFind(selector?: (item: T, index: number) => number): T | null;

    last(): T
    splitAt(index: number): T[][]

    skipWhile(predicate: (item: T, index: number) => boolean): T[];
    takeWhile(predicate: (item: T, index: number) => boolean): T[];

    differences(selector?: (item: T, index: number) => number): number[];
}

if (!Array.prototype.groupBy) {
    Array.prototype.groupBy = function <T, U>(
        keySelector: (item: T, index: number) => U,
        keyEquality: (first: U, second: U) => boolean = (first, second) => (first === second)
    ) {
        const result: { key: U, items: T[] }[] = [];
        const array = this;

        array.forEach((item: T, index: number) => {
            const key = keySelector(item, index);
            const keyItem = result.find(r => keyEquality(r.key, key));
            if (!keyItem) {
                result.push({
                    key: key,
                    items: [item]
                });
            } else {
                keyItem.items.push(item);
            }
        });
        return result;
    };
}

if (!Array.prototype.groupReduce) {
    Array.prototype.groupReduce = function <T, U, V>(
        keySelector: (item: T, index: number) => U,
        reducer: (accumulator: V, item: T) => V,
        initial: V): { key: U, value: V }[] {

        const result: { key: U, value: V }[] = [];
        const array = this;
        let initFunc: () => V;

        if (Array.isArray(initial)) {
            initFunc = () => <V><any>initial.slice();
        } else if (typeof (initial) === "object" && initial != null) {
            initFunc = () => Object.assign({}, initial);
        } else {
            initFunc = () => initial;
        }

        array.forEach((item: T, index: number) => {
            const key = keySelector(item, index);
            let keyItem = result.find(r => r.key === key);
            if (!keyItem) {
                keyItem = {
                    key: key,
                    value: initFunc()
                };
                result.push(keyItem);
            }

            keyItem.value = reducer(keyItem.value, item);
        });
        return result;
    };
}

if (!Array.prototype.sum) {
    Array.prototype.sum = function <T>(selector: (item: T, index: number) => number = (item => item as unknown as number)): number {
        const array = this;
        return array.reduce((acc: number, item: T, index: number) => acc + selector(item, index), 0);
    };
}

if (!Array.prototype.min) {
    Array.prototype.min = function <T>(selector: (item: T, index: number) => number = (item => item as unknown as number)): number {
        const array = this;
        return array.reduce((acc: number, item: T, index: number) => acc < selector(item, index) ? acc : selector(item, index), Number.POSITIVE_INFINITY);
    };
}

if (!Array.prototype.max) {
    Array.prototype.max = function <T>(selector: (item: T, index: number) => number = (item => item as unknown as number)): number {
        const array = this;
        return array.reduce((acc: number, item: T, index: number) => acc > selector(item, index) ? acc : selector(item, index), Number.NEGATIVE_INFINITY);
    };
}

if (!Array.prototype.minFind) {
    Array.prototype.minFind = function <T>(selector: (item: T, index: number) => number = (item => item as unknown as number)): T | null {
        const array = this;
        let minElement: T | null = null;
        let min = Number.POSITIVE_INFINITY;
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            const value = selector(element, index);
            if (value < min) {
                min = value;
                minElement = element;
            }
        }
        return minElement;
    };
}

if (!Array.prototype.maxFind) {
    Array.prototype.maxFind = function <T>(selector: (item: T, index: number) => number = (item => item as unknown as number)): T | null {
        const array = this;
        let maxElement = null;
        let max = Number.NEGATIVE_INFINITY;
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            const value = selector(element, index);
            if (value > max) {
                max = value;
                maxElement = element;
            }
        }
        return maxElement;
    };
}

if (!Array.prototype.last) {
    Array.prototype.last = function <T>() {
        const array = this;
        return array[array.length - 1];
    }
}

if (!Array.prototype.splitAt) {
    Array.prototype.splitAt = function <T>(index: number) {
        const array = this;
        const result: T[][] = [];
        let start = 0;
        while (start < array.length) {
            result.push(array.slice(start, start + index));
            start += index;
        }
        return result;
    }
}

if (!Array.prototype.skipWhile) {
    Array.prototype.skipWhile = function <T>(predicate: (item: T, index: number) => boolean) {
        const array: T[] = this;
        let index = 0;
        while (index < array.length) {
            if (predicate(array[index], index)) {
                index += 1;
            } else {
                return array.slice(index);
            }
        }
        return [];
    }
}

if (!Array.prototype.takeWhile) {
    Array.prototype.takeWhile = function <T>(predicate: (item: T, index: number) => boolean) {
        const array: T[] = this;
        let index = 0;
        while (index < array.length) {
            if (predicate(array[index], index)) {
                index += 1;
            } else {
                return array.slice(0, index);
            }
        }
        return array.slice();
    }
}

if (!Array.prototype.differences) {
    Array.prototype.differences = function <T>(selector: (item: T, index: number) => number = (item => item as unknown as number)) {
        const array: T[] = this;
        const result: number[] = [];
        const values = array.map(selector);
        for (let index = 1; index < values.length; index++) {
            const element = values[index];
            const previous = values[index - 1];
            result.push(element - previous);
        }
        return result;
    }
}