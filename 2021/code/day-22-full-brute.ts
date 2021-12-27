import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

// technically this works, however it runs out of memory (even at)

interface Command {
    action: "on" | "off";
    x: { from: number, to: number };
    y: { from: number, to: number };
    z: { from: number, to: number };
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const rx =/^(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)$/;
    const result = lines.map(line => {
        const match = line.match(rx);
        if (!match) {
            throw new Error(`Invalid line: ${line}`);
        }
        const [, action, xFrom, xTo, yFrom, yTo, zFrom, zTo] = match;
        return {
            action,
            x: { from: parseInt(xFrom, 10), to: parseInt(xTo, 10) },
            y: { from: parseInt(yFrom, 10), to: parseInt(yTo, 10) },
            z: { from: parseInt(zFrom, 10), to: parseInt(zTo, 10) }
        } as Command;
    });
    return result;
};

const partOne = (input: Command[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const low = -50;
    const high = 100;
    const translated = input.map(command => ({
        action: command.action,
        x: { from: command.x.from - low, to: command.x.to - low },
        y: { from: command.y.from - low, to: command.y.to - low },
        z: { from: command.z.from - low, to: command.z.to - low }
    })).filter(command => {
        if (command.x.from < 0) {
            return false;
        }
        if (command.y.from < 0) {
            return false;
        }
        if (command.z.from < 0) {
            return false;
        }
        if (command.x.to > high) {
            return false;
        }
        if (command.y.to > high) {
            return false;
        }
        if (command.z.to > high) {
            return false;
        }
        return true;
    });

    const reactor: number[][][] = new Array(high+1).fill(0)
        .map(_ => new Array(high+1).fill(0)
        .map(_ => new Array(high+1).fill(0)));



    for (const command of translated) {
        for (let x = command.x.from; x <= command.x.to; x++) {
            for (let y = command.y.from; y <= command.y.to; y++) {
                for (let z = command.z.from; z <= command.z.to; z++) {
                    if (command.action === "on") {
                        reactor[x][y][z] = 1;
                    } else {
                        reactor[x][y][z] = 0;
                    }
                }
            }
        }
    }

    const ons = reactor.sum(x => x.sum(y => y.sum()));
    return ons;
};

// interface XSegment {
//     from: number;
//     to: number;
//     ys: YSegment[];
// }

// interface YSegment {
//     from: number;
//     to: number;
//     zs: ZSegment[];
// }

// interface ZSegment {
//     from: number;
//     to: number;
//     action: "on" | "off";
// }

interface XSegment {
    y: { from: number, to: number };
    z: { from: number, to: number };
    action: "on" | "off";
}

interface YSegment {
    xdiff: number;
    z: { from: number, to: number };
    action: "on" | "off";
}

interface ZSegment {
    xdiff: number;
    ydiff: number;
    action: "on" | "off";
}

interface XIntervalSegment {
    from: number;
    to: number;
    segments: XSegment[];
}

interface YIntervalSegment {
    from: number;
    to: number;
    xdiff: number
    segments: YSegment[];
}

interface ZIntervalSegment {
    from: number;
    to: number;
    xdiff: number;
    ydiff: number;
    segments: ZSegment[];
}

const areXSegmentsEqual = (first: XSegment[], second: XSegment[]) => {
    if (first.length !== second.length){
        return false;
    }
    for (let i = 0; i < first.length; i++) {
        if (first[i].action !== second[i].action) {
            return false;
        }
        if (first[i].y.from !== second[i].y.from) {
            return false;
        }
        if (first[i].y.to !== second[i].y.to) {
            return false;
        }
        if (first[i].z.from !== second[i].z.from) {
            return false;
        }
        if (first[i].z.to !== second[i].z.to) {
            return false;
        }
    }
    return true;
};

const areYSegmentsEqual = (first: YSegment[], second: YSegment[]) => {
    if (first.length !== second.length){
        return false;
    }
    for (let i = 0; i < first.length; i++) {
        if (first[i].action !== second[i].action) {
            return false;
        }
        if (first[i].z.from !== second[i].z.from) {
            return false;
        }
        if (first[i].z.to !== second[i].z.to) {
            return false;
        }
        if (first[i].xdiff !== second[i].xdiff) {
            return false;
        }
    }
    return true;
};

const areZSegmentsEqual = (first: ZSegment[], second: ZSegment[]) => {
    if (first.length !== second.length){
        return false;
    }
    for (let i = 0; i < first.length; i++) {
        if (first[i].action !== second[i].action) {
            return false;
        }
        if (first[i].xdiff !== second[i].xdiff) {
            return false;
        }
        if (first[i].ydiff !== second[i].ydiff) {
            return false;
        }
    }
    return true;
};


const partTwo = (input: Command[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const minx = input.min(c => c.x.from);

    // translate to positive
    const commands = input.map(command => ({
        action: command.action,
        x: { from: command.x.from - minx, to: command.x.to - minx },
        y: { from: command.y.from, to: command.y.to},
        z: { from: command.z.from, to: command.z.to }
    }));

    const maxx = commands.max(c => c.x.to);
    const xarray: XSegment[][] = Array(maxx+1).fill(0).map(_ => []);

    for (let index = 0; index < xarray.length; index++) {
        const intersect = commands.filter(c => c.x.from <= index && index <= c.x.to);
        for (const command of intersect) {
            xarray[index].push({action: command.action, y: command.y, z: command.z});
        }
    }

    const simpletonsx: XSegment[] = [];
    const complicatedsx: XIntervalSegment[] = [];

    for (let index = 0; index < xarray.length; index++) {
        const element = xarray[index];
        if (element.length === 0) {
            continue;
        }
        if (element.length === 1) {
            const [command] = element;
            if (command.action === "on") {
                // just ignore the off commands
                simpletonsx.push(command);
            }
            continue;
        }
        complicatedsx.push({ from: index, to: index, segments: element });
    }

    const totalSinglesX = simpletonsx.sum(s => (s.y.to - s.y.from + 1) * (s.z.to - s.z.from + 1));
    console.log(`Total singles x: ${totalSinglesX}`);
    const mergedSegmentsX: XIntervalSegment[] = [];

    let mergedSegmentX = complicatedsx[0];

    for (const segment of complicatedsx.slice(1)) {
        if (segment.from !== mergedSegmentX.to + 1) {
            mergedSegmentsX.push(mergedSegmentX);
            mergedSegmentX = segment;
            continue;
        }
        if (!areXSegmentsEqual(mergedSegmentX.segments, segment.segments)) {
            mergedSegmentsX.push(mergedSegmentX);
            mergedSegmentX = segment;
            continue;
        }
        mergedSegmentX.to = segment.to;
    }
    mergedSegmentsX.push(mergedSegmentX);
    console.log(`Reduced ${complicatedsx.length} x segments to ${mergedSegmentsX.length} merged x segments`);

    const simpletonsy: YSegment[] = [];
    const complicatedsy: YIntervalSegment[] = [];

    let index = 0;
    for (const segment of mergedSegmentsX) {
        index += 1;
        if (index % 10 === 0) {
            console.log(`#${index}: (${segment.from} - ${segment.to})`);
        }

        const xdiff = segment.to - segment.from + 1;
        const miny = segment.segments.min(s => s.y.from);

        // translate to positive
        const segments = segment.segments.map(s => ({
            action: s.action,
            y: { from: s.y.from - miny, to: s.y.to - miny },
            z: { from: s.z.from, to: s.z.to }
        }));

        const maxy = segments.max(c => c.y.to);
        const yarray: YSegment[][] = Array(maxy+1).fill(0).map(_ => []);

        for (let index = 0; index < yarray.length; index++) {
            const intersect = segments.filter(c => c.y.from <= index && index <= c.y.to);
            for (const command of intersect) {
                yarray[index].push({xdiff, action: command.action, z: command.z});
            }
        }

        for (let index = 0; index < yarray.length; index++) {
            const element = yarray[index];
            if (element.length === 0) {
                continue;
            }
            if (element.length === 1) {
                const [command] = element;
                if (command.action === "on") {
                    // just ignore the off commands
                    simpletonsy.push(command);
                }
                continue;
            }
            complicatedsy.push({ xdiff, from: index, to: index, segments: element });
        }
    }

    const totalSinglesY = simpletonsy.sum(s => (s.z.to - s.z.from + 1) * s.xdiff);
    console.log(`Total singles y: ${totalSinglesY}`);

    console.log(complicatedsy.length);
    const mergedSegmentsY: YIntervalSegment[] = [];

    let mergedSegmentY = complicatedsy[0];

    for (const segment of complicatedsy.slice(1)) {
        if (segment.from !== mergedSegmentY.to + 1) {
            mergedSegmentsY.push(mergedSegmentY);
            mergedSegmentY = segment;
            continue;
        }
        if (!areYSegmentsEqual(mergedSegmentY.segments, segment.segments)) {
            mergedSegmentsY.push(mergedSegmentY);
            mergedSegmentY = segment;
            continue;
        }
        mergedSegmentY.to = segment.to;
    }
    mergedSegmentsY.push(mergedSegmentY);
    console.log(`Reduced ${complicatedsy.length} y segments to ${mergedSegmentsY.length} merged y segments`);

    // STARTING Z
    const simpletonsz: ZSegment[] = [];
    const complicatedsz: ZIntervalSegment[] = [];
    index = 0;

    for (const segment of mergedSegmentsY) {
        index += 1;
        if (index % 30 === 0) {
            console.log(`#${index}: (${segment.from} - ${segment.to})`);
        }

        const ydiff = segment.to - segment.from + 1;
        const minz = segment.segments.min(s => s.z.from);

        // translate to positive
        const segments = segment.segments.map(s => ({
            action: s.action,
            z: { from: s.z.from - minz, to: s.z.to - minz },
        }));

        const maxz = segments.max(c => c.z.to);
        const zarray: ZSegment[][] = Array(maxz+1).fill(0).map(_ => []);

        for (let index = 0; index < zarray.length; index++) {
            const intersect = segments.filter(c => c.z.from <= index && index <= c.z.to);
            for (const command of intersect) {
                zarray[index].push({xdiff: segment.xdiff, ydiff, action: command.action});
            }
        }

        for (let index = 0; index < zarray.length; index++) {
            const element = zarray[index];
            if (element.length === 0) {
                continue;
            }
            if (element.length === 1) {
                const [command] = element;
                if (command.action === "on") {
                    // just ignore the off commands
                    simpletonsz.push(command);
                }
                continue;
            }
            complicatedsz.push({ xdiff: segment.xdiff, ydiff, from: index, to: index, segments: element });
        }
    }

    const totalSinglesZ = simpletonsz.sum(s => s.ydiff * s.xdiff);
    console.log(`Total singles z: ${totalSinglesZ}`);

    const mergedSegmentsZ: ZIntervalSegment[] = [];

    let mergedSegmentZ = complicatedsz[0];

    for (const segment of complicatedsz.slice(1)) {
        if (segment.from !== mergedSegmentZ.to + 1) {
            mergedSegmentsZ.push(mergedSegmentZ);
            mergedSegmentZ = segment;
            continue;
        }
        if (!areZSegmentsEqual(mergedSegmentZ.segments, segment.segments)) {
            mergedSegmentsZ.push(mergedSegmentZ);
            mergedSegmentZ = segment;
            continue;
        }
        mergedSegmentZ.to = segment.to;
    }
    mergedSegmentsZ.push(mergedSegmentZ);
    console.log(`Reduced ${complicatedsz.length} z segments to ${mergedSegmentsZ.length} merged z segments`);
    const totalMulti = mergedSegmentsZ.sum(msz => {
        if (msz.segments[msz.segments.length-1].action === "off") {
            return 0;
        }
        return msz.ydiff * msz.xdiff * (msz.to - msz.from + 1);
    });
    console.log(`Total multi: ${totalMulti}`);
    return totalSinglesX + totalSinglesY + totalSinglesZ + totalMulti;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Command[]) => {
    console.log(input);
};

const test = (_: Command[]) => {
    console.log("----Test-----");
};

export const solutionTwentyTwo: Puzzle<Command[], number> = {
    day: 22,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
