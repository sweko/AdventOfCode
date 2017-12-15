import { readInput, readInputLines } from "../extra/aoc-helper";
import { listenerCount } from "cluster";

class Generator {

    private readonly modulo = 2147483647;

    constructor(private state: number, private factor: number) { }

    getNextValue() {
        this.state = (this.state * this.factor) % this.modulo;
        return this.state;
    }

    getNextFiltered(filter: number) {
        while ((this.state = (this.state * this.factor) % this.modulo) & filter);
        return this.state;
    }
}

class Judge {
    constructor(public first: Generator, public second: Generator) { }

    run(count: number): number {
        let result = 0;
        for (let i = 0; i < count; i++) {
            const fvalue = this.first.getNextValue() & 65535;
            const svalue = this.second.getNextValue() & 65535;            
            if (fvalue === svalue) result += 1;
        }
        return result;
    }

    runFiltered(count: number): number {
        let result = 0;
        for (let i = 0; i < count; i++) {
            const fvalue = this.first.getNextFiltered(3) & 65535;
            const svalue = this.second.getNextFiltered(7) & 65535;            
            if (fvalue === svalue) result += 1;
        }
        return result;
    }
}

async function main() {

    let [inputa, factora] = [289, 16807];
    let [inputb, factorb] = [629, 48271];
    
    console.time("Part 1");
    let gena = new Generator(inputa, factora);
    let genb = new Generator(inputb, factorb);
    let judge = new Judge(gena, genb);
    let matchCount = processPartOne(judge);
    console.timeEnd("Part 1");
    console.log(`Part 1: total number of matches = ${matchCount}`);

    console.time("Part 2");
    gena = new Generator(inputa, factora);
    genb = new Generator(inputb, factorb);
    judge = new Judge(gena, genb);
    matchCount = processPartTwo(judge);
    console.timeEnd("Part 2");
    console.log(`Part 2: total number of matches = ${matchCount}`);

}

function processPartOne(judge: Judge) {
    const result = judge.run(40000000);
    return result;
}

function processPartTwo(judge: Judge) {
    const result = judge.runFiltered(5000000);
    return result;
}

main();