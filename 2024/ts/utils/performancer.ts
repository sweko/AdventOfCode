export type PerformancerInterval = {
    readonly start: number;
    readonly end: number;
    readonly duration: number;
}

export type PerformancerData = {
    intervals: PerformancerInterval[];
    name: string;
    get totalDuration(): number;
    get count(): number;
}

const createPerformancerItem = (name: string): PerformancerData => {
    const intervals: PerformancerInterval[] = [];
    return {
        intervals,
        name,
        get totalDuration() {
            return intervals.reduce((acc, { duration }) => acc + duration, 0);
        },
        get count() {
            return intervals.length;
        }
    };
};

export type Performancer = {
    readonly start: (name: string) => void;
    readonly end: (name: string) => void;
    readonly get: (name: string) => PerformancerData | undefined;
    readonly printAll: (printDetails?: boolean) => void;
    readonly print: (name: string, printDetails?: boolean) => void;
}

const toThreeDecimals = (value: number) => Math.round(value * 1000) / 1000;

const createPerformancer = (): Performancer => {
    const items: Map<string, PerformancerData> = new Map();

    const start = (name: string) => {
        if (!items.has(name)) {
            items.set(name, createPerformancerItem(name));
        }
        const start = performance.now();
        items.get(name)!.intervals.push({ start, end: 0, duration: 0 });
    };

    const end = (name: string) => {
        const end = performance.now();
        const item = items.get(name);
        if (!item) {
            throw new Error("No item found");
        }
        const interval = item.intervals.pop();
        if (!interval) {
            throw new Error("No interval found");
        }
        const duration = toThreeDecimals(end - interval.start);
        const finishedInterval = { ...interval, end, duration };
        item.intervals.push(finishedInterval);
    };

    const get = (name: string) => items.get(name);

    const printAll = (printDetails: boolean = false) => {
        for (const name of Object.keys(items)) {
            print(name, printDetails);
            console.log("-----------------");
        }
    };

    const print = (name: string, printDetails: boolean = false) => {
        const item = items.get(name);
        if (!item) {
            console.log(`No performance data for ${name}`);
            return;
        }
        console.log(`Performance for ${name}:`);
        if (printDetails) {
            for (const interval of item.intervals) {
                console.log(`  - ${interval.duration}ms`);
            }
        }
        console.log(`${item.count} total calls`);
        const totalDuration = toThreeDecimals(item.totalDuration);
        console.log(`Total duration: ${totalDuration}ms`);
        console.log(`Average duration: ${toThreeDecimals(totalDuration / item.count)}ms`);
    }

    return {
        start,
        end,
        get,
        printAll,
        print
    };
};


export const Performancer = createPerformancer();
