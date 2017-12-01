interface Array<T> {
    groupBy<U>(keySelector: (item: T, index: number) => U): { key: U, items: T[] }[];

    orderBy(ordering: (item:T, index: number) => any): Array<T>
}

if (!Array.prototype.groupBy) {
    Array.prototype.groupBy = function <T, U>(keySelector: (item: T, index: number) => U) {
        let result: { key: U, items: T[] }[] = [];
        let array = this;

        this.forEach((item, index) => {
            let key = keySelector(item, index);
            let keyItem = result.find(r => r.key === key);
            if (!keyItem) {
                result.push({
                    key: key,
                    items: [item]
                })
            } else {
                keyItem.items.push(item);
            }
        });
        return result;
    }
}

if (!Array.prototype.orderBy) {
    Array.prototype.orderBy = function <T>(ordering: (item:T, index: number) => any) {
        const array: Array<T> = this.slice();

        const orderings = array.map((item, index) => ({
            item: item,
            ordering: ordering(item, index)
        }));

        orderings.sort((a, b) => {
            if (a.ordering > b.ordering)
                return 1;
            if (a.ordering < b.ordering)
                return -1;
            return 0;
        })

        return orderings.map(ord => ord.item);
    }
}
