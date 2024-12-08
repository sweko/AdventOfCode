export type PerformancerInterval = {
    readonly start: number;
    readonly end: number;
    readonly duration: number;
}

export type PerformancerData = {
    name: string;
    get totalDuration(): number;
    get count(): number;
}

type SimplePerformancerData = PerformancerData & {
    set count(value: number);
    set totalDuration(value: number);
    lastStart: number;
}

export type FullPerformancerData = PerformancerData & {
    intervals: PerformancerInterval[];
}

type PerformanceWrapper = <Args extends any[], Return>(fn: (...args: Args) => Return, name?: string) => (...args: Args) => Return;

const createFullPerformancerItem = (name: string): FullPerformancerData => {
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

const createSimplePerformancerItem = (name: string): SimplePerformancerData => {
    let count = 0;
    let totalDuration = 0;
    return {
        name,
        get totalDuration() {
            return totalDuration;
        },
        set totalDuration(value: number) {
            totalDuration = value;
        },
        get count() {
            return count;
        },
        set count(value: number) {
            count = value;
        },
        lastStart: 0
    };
}

export type PerformancerOptions = {
    readonly trackDetails?: boolean;
}

const PerformancerOptions = {
    default: {
        trackDetails: false
    }
};

export type Performancer = {
    readonly monitor: PerformanceWrapper;
    readonly begin: (name: string, options?: PerformancerOptions) => void;
    readonly end: (name: string) => void;
    readonly get: (name: string) => PerformancerData | undefined;
    readonly printAll: (printDetails?: boolean) => void;
    readonly print: (name: string, printDetails?: boolean) => void;
}

const isSimpleItem = (item: PerformancerData): item is SimplePerformancerData => {
    return (item as SimplePerformancerData).lastStart !== undefined;
}

const isFullItem = (item: PerformancerData): item is FullPerformancerData => {
    return (item as FullPerformancerData).intervals !== undefined;
}

const toThreeDecimals = (value: number) => Math.round(value * 1000) / 1000;

const createPerformancer = (): Performancer => {
    const monitor =  <Args extends any[], Return>(fn: (...args: Args) => Return, name: string = fn.name) => {
        return (...args: Args) => {
            begin(name);
            const result = fn(...args);
            end(name);
            return result;
        };
    }

    const items: Map<string, PerformancerData> = new Map();

    const begin = (name: string, options: PerformancerOptions = PerformancerOptions.default) => {
        if (options.trackDetails) {
            if (!items.has(name)) {
                items.set(name, createFullPerformancerItem(name));
            }
            const start = performance.now();
            const performancerItem = items.get(name) as FullPerformancerData;
            performancerItem.intervals.push({ start, end: 0, duration: 0 });
        } else {
            if (!items.has(name)) {
                items.set(name, createSimplePerformancerItem(name));
            }
            const start = performance.now();
            const performancerItem = items.get(name) as SimplePerformancerData;
            performancerItem.lastStart = start;
            performancerItem.count += 1;
        }
    };

    const end = (name: string) => {
        const end = performance.now();
        const item = items.get(name);
        if (!item) {
            throw new Error("No item found");
        }
        if (isSimpleItem(item)) {
            item.totalDuration += end - item.lastStart;
        } else if (isFullItem(item)) {
            const interval = item.intervals.pop();
            if (!interval) {
                throw new Error("No interval found");
            }
            const duration = toThreeDecimals(end - interval.start);
            const finishedInterval = { ...interval, end, duration };
            item.intervals.push(finishedInterval);
        } else {
            throw new Error("Invalid item type");
        }
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
        if (printDetails && isFullItem(item)) {
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
        monitor,
        begin,
        end,
        get,
        printAll,
        print
    };
};


export const Performancer = createPerformancer();


export const monitored =  <Args extends any[], Return>(fn: (...args: Args) => Return, name: string = fn.name) => {

    const performanceData = {
        name,
        count: 0,
        totalDuration: 0,
        print: () => {
            console.log(`Performance for ${name}:`);
            console.log(`${performanceData.count} total calls`);
            console.log(`Total duration: ${performanceData.totalDuration.toFixed(3)}ms`);
            console.log(`Average duration: ${(performanceData.totalDuration / performanceData.count).toFixed(3)}ms`);
        }
    }

    const result = (...args: Args) => {
        const start = performance.now();
        const result = fn(...args);
        const end = performance.now();
        performanceData.count += 1;
        performanceData.totalDuration += end - start;
        return result;
    };

    result.performance = performanceData;

    return result;
}
