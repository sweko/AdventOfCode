export type Hash<T=any> = {[key:string]: T};

export type StringHash = Hash<string>;

export const toHash = <T, U>(
    items: T[], 
    selector: (item:T)=>string, 
    processor: (item:T) => U = item => item as unknown as U): Hash<U> => 
        items.reduce((acc, item) => ({...acc, [selector(item)]: processor(item)}), {});

export const addToSet = <T>(set: Set<T>, ...items: T[]) => {
    for (const item of items) {
        set.add(item);
    }
    return set;
}