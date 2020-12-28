export type Hash<T=any> = {[key:string]: T};

export type StringHash = Hash<string>;

export const toHash = <T, U>(
    items: T[], 
    selector: (item:T)=>string|number, 
    processor: (item:T) => U = item => item as unknown as U): Hash<U> => 
        items.reduce((acc, item) => ({...acc, [selector(item)]: processor(item)}), {});

export const toArray = <T, U>(items: Hash<T>, processor: (key: string, item: T) => U) => 
    Object.keys(items).map(key => processor(key, items[key]));


export const addToSet = <T>(set: Set<T>, ...items: T[]) => {
    for (const item of items) {
        set.add(item);
    }
    return set;
}