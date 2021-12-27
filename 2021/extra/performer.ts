import { performance } from "perf_hooks";

export class Performer<T extends string = string> {
    starts: { [key in T]?: number } = {};
    values: { [key in T]?: number } = {};

    constructor() {}

    public start(name: T) {
        this.starts[name] = performance.now();
    }

    public end(name: T) {
        if (this.starts[name]) {
            const end = performance.now();
            const start = this.starts[name];
            this.values[name] = (this.values[name] ?? 0) + end - start;
            delete this.starts[name];
        }
    }

    public getValues() {
        return Object.keys(this.values).map(key => ({key, value: this.values[key]}));
    }
}
