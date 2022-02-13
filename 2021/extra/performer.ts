import { performance } from "perf_hooks";

export class Performer<T extends string = string> {
    starts: { [key in T]?: number } = {};
    values: { [key in T]?: number } = {};

    constructor() {}

    public start(name: T) {
        this.starts[name] = performance.now();
    }

    public clear(name: T) {
        delete this.starts[name];
        delete this.values[name];
    }

    public stop(name: T) {
        if (this.starts[name]) {
            const stop = performance.now();
            const start = this.starts[name];
            this.values[name] = (this.values[name] ?? 0) + stop - start;
            delete this.starts[name];
        }
    }

    public getValues() {
        return Object.keys(this.values).map(key => ({key, value: this.values[key]}));
    }
}
