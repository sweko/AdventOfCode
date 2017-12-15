interface Array<T> {
    groupBy<U>(keySelector: (item: T, index: number) => U): { key: U, items: T[] }[];
    groupReduce<U, V>(
        keySelector: (item: T, index: number) => U,
        reducer: (accumulator: V, item: T) => V,
        initial: V): { key: U, value: V }[];
}

if (!Array.prototype.groupBy) {
    Array.prototype.groupBy = function <T, U>(keySelector: (item: T, index: number) => U) {
        const result: { key: U, items: T[] }[] = [];
        const array = this;

        this.forEach((item, index) => {
            const key = keySelector(item, index);
            const keyItem = result.find(r => r.key === key);
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

        this.forEach((item, index) => {
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
