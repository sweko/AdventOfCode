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

    minFind(selector?: (item: T, index: number) => number): T;
    maxFind(selector?: (item: T, index: number) => number): T;

    last():T
    splitAt(index: number): T[][]
}

if (!Array.prototype.groupBy) {
    Array.prototype.groupBy = function <T, U>(
        keySelector: (item: T, index: number) => U,
        keyEquality: (first: U, second: U) => boolean = (first, second) => (first === second)
    ) {
        const result: { key: U, items: T[] }[] = [];
        const array = this;

        array.forEach((item, index) => {
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

        array.forEach((item, index) => {
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
        return array.reduce((acc, item, index) => acc + selector(item, index), 0);
    };
}

if (!Array.prototype.min) {
    Array.prototype.min = function <T>(selector: (item: T, index: number) => number = (item => item as unknown as number)): number {
        const array = this;
        return array.reduce((acc, item, index) => acc < selector(item, index) ? acc : selector(item, index), Number.POSITIVE_INFINITY);
    };
}

if (!Array.prototype.max) {
    Array.prototype.max = function <T>(selector: (item: T, index: number) => number = (item => item as unknown as number)): number {
        const array = this;
        return array.reduce((acc, item, index) => acc > selector(item, index) ? acc : selector(item, index), Number.NEGATIVE_INFINITY);
    };
}

if (!Array.prototype.minFind) {
    Array.prototype.minFind = function <T>(selector: (item: T, index: number) => number = (item => item as unknown as number)): T {
        const array = this;
        let minElement = null;
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
    Array.prototype.maxFind = function <T>(selector: (item: T, index: number) => number = (item => item as unknown as number)): T {
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
        return array[array.length-1];
    }
}

if (!Array.prototype.splitAt) {
    Array.prototype.splitAt = function <T>(index: number) {
        const array = this;
        const result = [];
        let start = 0;
        while (start < array.length) {
            result.push(array.slice(start, start+index));
            start += index;
        }
        return result;
    }
}

