// Solution for day 5 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

//              destId, sourceId, duration
type Mapping = [number, number, number]

interface Almanac {
    seeds: number[];
    mappers: Mapping[][];
}

const processInput = (day: number) => {
    const lines = readInputLines(day);
    const result = {
        seeds: [],
        mappers: []
    } as Almanac;
    const seedLine = lines.shift()!;
    result.seeds = seedLine.substring(7).split(" ").map(s => parseInt(s, 10));
    lines.shift();

    while (lines.length > 0) {
        lines.shift();
        const mapper = [] as Mapping[];
        let mapperLine = lines.shift()!;
        while (mapperLine) {
            const mmatch = mapperLine.match(/^(\d+) (\d+) (\d+)$/)!;
            mapper.push([parseInt(mmatch[1], 10), parseInt(mmatch[2], 10), parseInt(mmatch[3], 10)]);
            mapperLine = lines.shift()!;
        }
        result.mappers.push(mapper);
    }

    return result;
};

const processMapper = (seed: number, mapper: Mapping[]) => {
    for (const [destination, source, duration] of mapper) {
        if ((seed >= source) && (seed < duration + source)) {
            return destination + seed - source;
        }
    }
    return seed;
};

const processSeed = (seed: number, mappers: Mapping[][]) => {
    let result = seed;
    for (const mapper of mappers) {
        result = processMapper(result, mapper);
        //console.log(result);
    }
    //console.log("----");
    return result;
};

const partOne = (input: Almanac, debug: boolean) => {
    const location = input.seeds.map(s => processSeed(s, input.mappers));
    return location.min();
};

interface Interval {
    start: number;
    end: number;
}

interface OffsetInterval extends Interval {
    offset: number;
}

const processMapperInterval = (seed: Interval, mapper: OffsetInterval[]) => {
    const current = { ...seed };
    const result = [] as [Interval, Interval][];
    for (const mapping of mapper) {
        if (mapping.end < current.start) {
            continue;
        }
        // we found the first interval that overlaps with the seed
        const end = Math.min(mapping.end, current.end);
        result.push([
            { start: current.start, end },
            { start: current.start + mapping.offset, end: end + mapping.offset }
        ]);
        current.start = end + 1;

        if (current.start > current.end) {
            break;
        }
    }

    return result.map(([_, mapped]) => mapped);
};

const processSeedIntervals = (seed: Interval, mappers: OffsetInterval[][]) => {
    let result = [seed];
    for (const mapper of mappers) {
        const newResult = [] as Interval[];
        for (const interval of result) {
            newResult.push(...processMapperInterval(interval, mapper));
        }
        result = newResult;
    }
    //console.log("----");
    return result;
};

const partTwo = ({seeds, mappers}: Almanac, debug: boolean) => {
    const seedIntervals = [] as Interval[];
    for (let index = 0; index < seeds.length; index += 2) {
        const start = seeds[index];
        const duration = seeds[index + 1];
        seedIntervals.push({ start, end: start + duration - 1 });
    }

    const mapperIntervals = [] as OffsetInterval[][];
    for (const mapper of mappers) {
        const offsetIntervals = mapper.map(([destination, source, duration]) => ({
            start: source,
            end: source + duration - 1,
            offset: destination - source
        }));
        mapperIntervals.push(offsetIntervals.toSorted((a, b) => a.start - b.start));
    }

    // ensure that all mappers start at 0
    for (const mi of mapperIntervals) {
        const first = mi[0];
        if (first.start !== 0) {
            mi.unshift({ start: 0, end: first.start - 1, offset: 0 });
        }
    }

    // fix any gaps in the mappers
    for (const mi of mapperIntervals) {
        for (let index = 0; index < mi.length-1; index++) {
            const current = mi[index];
            const next = mi[index+1];
            if (current.end + 1 !== next.start) {
                mi.splice(index+1, 0, { start: current.end + 1, end: next.start - 1, offset: 0 });
            }
        }
    }

    // ensure that all mappers end at Number.MAX_SAFE_INTEGER
    for (const mi of mapperIntervals) {
        const last = mi[mi.length-1];
        mi.push({ start: last.end + 1, end: Number.MAX_SAFE_INTEGER, offset: 0 });
    }

    const mapped = seedIntervals.flatMap(s => processSeedIntervals(s, mapperIntervals));

    return mapped.min(interval => interval.start);;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: Almanac) => {
    console.log(input);
};

const test = (_: Almanac) => {
    console.log("----Test-----");
};

export const solution: Puzzle<Almanac, number> = {
    day: 5,
    input: () => processInput(5),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}