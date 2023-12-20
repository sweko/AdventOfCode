// Solution for day 20 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type ModuleType = "broadcaster" | "flip-flop" | "conjunction" | "untyped" | "button";

type Pulse = "low" | "high";

interface Module {
    type: ModuleType;
    name: string;
    inputs: string[];
    outputs: string[];
    system: System;

    receive(pulse: Pulse, input: string, clock: number): void;
}

type ModuleState = "on" | "off";

class Button implements Module {
    readonly type: ModuleType = "button";
    name: string;
    inputs: string[] = [];
    outputs: string[];
    system: System = new System({});

    constructor(name: string, outputs: string[]) {
        this.name = name;
        this.outputs = outputs;
    }

    press(pulse: Pulse, clock: number = 0) {
        for (const output of this.outputs) {
            this.system.receive(pulse, this.name, output, clock);
        }
    }

    receive(_pulse: Pulse, _input: string): void {
        throw new Error(`I'm the one who pulses!`);
    }
}

class Broadcaster implements Module {
    readonly type: ModuleType = "broadcaster";
    readonly name: string = "broadcaster";
    inputs: string[] = [];
    outputs: string[];
    system: System = new System({});

    constructor(outputs: string[]) {
        this.outputs = outputs;
    }

    receive(pulse: Pulse, input: string, clock: number): void {
        for (const output of this.outputs) {
            this.system.receive(pulse, this.name, output, clock + 1);
        }
    }
}

class FlipFlop implements Module {
    readonly type: ModuleType = "flip-flop";
    name: string;
    inputs: string[] = [];
    outputs: string[];
    system: System = new System({});
    private state: ModuleState = "off";

    constructor(name: string, outputs: string[]) {
        this.name = name;
        this.outputs = outputs;
    }

    receive(pulse: Pulse, input: string, clock: number): void {
        if (!this.inputs.includes(input)) {
            throw new Error(`Invalid input ${input}`);
        }
        if (pulse === "high") {
            return;
        }
        if (this.state === "off") {
            this.state = "on";
            for (const output of this.outputs) {
                this.system.receive("high", this.name, output, clock + 1);
            }
        } else {
            this.state = "off";
            for (const output of this.outputs) {
                this.system.receive("low", this.name, output, clock + 1);
            }
        }
    }
}

class Conjunction implements Module {
    readonly type: ModuleType = "conjunction";
    name: string;
    inputs: string[] = [];
    outputs: string[];
    system: System = new System({});
    private memory: Pulse[] = [];

    constructor(name: string, outputs: string[]) {
        this.name = name;
        this.outputs = outputs;
    }

    resetMemory() {
        this.memory = Array(this.inputs.length).fill("low");
    }

    receive(pulse: Pulse, input: string, clock: number): void {
        if (!this.inputs.includes(input)) {
            throw new Error(`Invalid input ${input}`);
        }
        const index = this.inputs.indexOf(input);
        this.memory[index] = pulse;

        if (this.memory.every(pulse => pulse === "high")) {
            for (const output of this.outputs) {
                this.system.receive("low", this.name, output, clock + 1);
            }
        } else {
            for (const output of this.outputs) {
                this.system.receive("high", this.name, output, clock + 1);
            }
        }
    }
}

class UntypedModule implements Module {
    readonly type: ModuleType = "untyped";
    name: string;
    inputs: string[] = [];
    outputs: string[] = [];
    system: System = new System({});

    constructor(name: string) {
        this.name = name;
    }

    receive(_pulse: Pulse, input: string, clock: number): void {
        if (!this.inputs.includes(input)) {
            throw new Error(`Invalid input ${input}`);
        }
        // do nothing
    }
}

type ModuleMap = Record<string, Module>;

class System {
    modules: ModuleMap;
    debug: boolean = false;
    clock: number = 0;
    private queue: {
        pulse: Pulse,
        from: string,
        to: string,
        clock: number
    }[] = [];
    private presses = 0;

    pulseCounts = {
        low: 0,
        high: 0
    }

    constructor(modules: ModuleMap) {
        this.modules = modules;
    }

    receive(pulse: Pulse, from: string, to: string, clock: number) {
        if (this.debug) {
            console.log(`${from} -${pulse}-> ${to}`); //  (${clock})
        }
        this.queue.push({ pulse, from, to, clock });
    }

    processQueue(clock: number = 0) {
        while (this.queue.length > 0 && this.queue[0].clock === clock) {
            const { pulse, from, to, clock: queueClock } = this.queue.shift()!;
            if (from === "button") {
                this.presses += 1;
            }
            this.modules[to].receive(pulse, from, clock);

            // part one code
            this.pulseCounts[pulse] += 1;

            // part two analysis code
            if (this.cycleModules.has(from) && pulse === "high") {
                this.cycleData.find(value => value.module === from)!.cycle = this.presses;
            }
        }
        if (this.queue.length > 0) {
            this.queue.sort((a, b) => a.clock - b.clock);
            this.processQueue(clock + 1);
        }
    }

    cycleData: { module: string, cycle: number }[] = [];
    private cycleModules = new Set<string>();

    cycleFinished() {
        return this.cycleData.every(value => value.cycle !== 0);
    }

    registerCyclers(cycleInputs: string[]) {
        for (const input of cycleInputs) {
            this.cycleData.push({ module: input, cycle: 0 });
            this.cycleModules.add(input);
        }
    }
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const regex = /(broadcaster|%\w+|&\w+) -> ((?:\w+, )*\w+)$/;
    const modules = lines.map(line => {
        const match = line.match(regex);
        if (!match) {
            throw Error(`Invalid input line ${line}`);
        }
        const [, source, targets] = match;
        const targetList = targets.split(", ");
        if (source === "broadcaster") {
            return new Broadcaster(targetList);
        }
        if (source.startsWith("%")) {
            return new FlipFlop(source.substring(1), targetList);
        }
        if (source.startsWith("&")) {
            return new Conjunction(source.substring(1), targetList);
        }
        throw Error(`Invalid input line ${line}`);
    });
    const moduleMap = modules.reduce((acc, module) => {
        acc[module.name] = module;
        return acc;
    }, {} as Record<string, Module>);
    const system = new System(moduleMap);
    for (const module of modules) {
        module.system = system;
        for (const output of module.outputs) {
            if (moduleMap[output]) {
                moduleMap[output].inputs.push(module.name);
            } else {
                moduleMap[output] = new UntypedModule(output);
                moduleMap[output].system = system;
                moduleMap[output].inputs.push(module.name);
            }
        }
    }

    for (const module of modules.filter(module => module.type === "conjunction") as Conjunction[]) {
        module.resetMemory();
    }
    return system;
};

const partOne = (system: System, debug: boolean) => {
    const button = new Button("button", ["broadcaster"]);
    button.system = system;
    system.modules["broadcaster"].inputs.push("button");
    system.debug = debug;

    const targetPushes = 1000;

    for (let index = 0; index < targetPushes; index++) {
        button.press("low");
        system.processQueue();
    }

    return system.pulseCounts.high * system.pulseCounts.low;
};

const partTwo = (system: System, debug: boolean) => {
    const button = new Button("button", ["broadcaster"]);
    button.system = system;
    system.modules["broadcaster"].inputs.push("button");
    system.debug = debug;

    // after input analysis
    const rxInput = system.modules["rx"].inputs[0];
    const cycleInputs = system.modules[rxInput].inputs;

    system.registerCyclers(cycleInputs);

    while (!system.cycleFinished()) {
        button.press("low");
        system.processQueue();
    }

    const result = system.cycleData.reduce((acc, value) => acc * value.cycle, 1);

    return result;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: System) => {
    console.log(input);
};

const test = (_: System) => {
    console.log("----Test-----");
};

export const solution: Puzzle<System, number> = {
    day: 20,
    input: () => processInput(20),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}