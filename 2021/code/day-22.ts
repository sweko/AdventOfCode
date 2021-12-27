import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Command {
    index: number;
    action: "on" | "off";
    x: Interval;
    y: Interval;
    z: Interval;
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const rx =/^(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)$/;
    const result = lines.map((line, index) => {
        const match = line.match(rx);
        if (!match) {
            throw new Error(`Invalid line: ${line}`);
        }
        const [, action, xFrom, xTo, yFrom, yTo, zFrom, zTo] = match;
        return {
            index: index+1,
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
    const commands = input.map(command => ({
        index: command.index,
        action: command.action,
        x: { from: command.x.from - low, to: command.x.to - low },
        y: { from: command.y.from - low, to: command.y.to - low },
        z: { from: command.z.from - low, to: command.z.to - low }
    })).filter(command => {
        // assumes no big cuboids contain the origin (verified by input)
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

    let totalLit = 0;

    const xsegments = separateByX(commands);
    for (const xsegment of xsegments) {
        const ysegments = separateByY(xsegment);
        for (const ysegment of ysegments) {
            const zsegments = separateByZ(ysegment);
            for (const zsegment of zsegments) {
                const segments = zsegment.segments.slice();
                // only the last rule is active
                segments.sort((a, b) => b.index - a.index);
                const rule = segments[0];
                if (rule.action === "on") {
                    totalLit += zsegment.xdiff * zsegment.ydiff * (zsegment.to - zsegment.from + 1);
                }
            }
        }
    }

    return totalLit;
};

interface Interval {
    from: number;
    to: number;
}

interface SegmentedInterval<T> extends Interval{
    segments: T[]
}

interface XSegment {
    index: number;
    y: Interval;
    z: Interval;
    action: "on" | "off";
}

interface YSegment {
    xdiff: number;
    index: number;
    z: Interval;
    action: "on" | "off";
}

interface ZSegment {
    index: number;
    xdiff: number;
    ydiff: number;
    action: "on" | "off";
}

interface XIntervalSegment extends SegmentedInterval<XSegment> {
}

interface YIntervalSegment extends SegmentedInterval<YSegment> {
    xdiff: number;
}

interface ZIntervalSegment extends SegmentedInterval<ZSegment> {
    xdiff: number;
    ydiff: number;
}


const executeIntersect = <T>(intersects: SegmentedInterval<T>[], allIntervals: SegmentedInterval<T>[], segment: T, command: Interval) => {
    // intersects are
    // 1. distinct by coordinate
    // 2. sorted by coordinate
    // not possible to intersect two intervals simultaneously
    let index = -1;

    for (const intersect of intersects) {
        index = allIntervals.findIndex(interval => interval === intersect);

        // if we begin before the intersect, and we end before the intersect, we split to three
        // one before the intersect, one together, and one for the intersect after us
        if (command.from < intersect.from && command.to < intersect.to ) {
            const intervals = [
                {
                    from: command.from,
                    to: intersect.from - 1,
                    segments: [segment]
                },
                {
                    from: intersect.from,
                    to: command.to,
                    segments: [...intersect.segments, segment]
                },
                {
                    from: command.to + 1,
                    to: intersect.to,
                    segments: intersect.segments
                }
            ]
            allIntervals.splice(index, 1, ...intervals);
            index +=1;
            command.from = command.to + 1;
            continue;
        }

        // if we begin before the intersect, and we end with the intersect, we split to two
        // one before the intersect, and one together with the intersect
        if (command.from < intersect.from && command.to === intersect.to) {
            const intervals = [
                {
                    from: command.from,
                    to: intersect.from - 1,
                    segments: [segment]
                },
                {
                    from: intersect.from,
                    to: intersect.to,
                    segments: [...intersect.segments, segment]
                }
            ]
            allIntervals.splice(index, 1, ...intervals);
            command.from = command.to + 1;
            continue;
        }

        // if we begin with the intersect, and we end after the intersect, we split to two
        // one before the intersect, one together
        // the part after the intersect is considered on the next intersect
        if (command.from < intersect.from && command.to > intersect.to) {
            const intervals = [
                {
                    from: command.from,
                    to: intersect.from - 1,
                    segments: [segment]
                },
                {
                    from: intersect.from,
                    to: intersect.to,
                    segments: [...intersect.segments, segment]
                }
            ]
            allIntervals.splice(index, 1, ...intervals);
            command.from = intersect.to + 1;
            continue;
        }

        // if we are the same, just add to the list
        if (intersect.from === command.from && intersect.to === command.to) {
            intersect.segments.push(segment);
            command.from = command.to + 1;
            continue;
        }

        // if we start with the intersect, but end before the intersect, we split to two
        // one with the intersect, and one for the intersect after us
        if (command.from === intersect.from && command.to < intersect.to) {
            const intervals = [
                {
                    from: intersect.from,
                    to: command.to,
                    segments: [...intersect.segments, segment]
                },
                {
                    from: command.to + 1,
                    to: intersect.to,
                    segments: intersect.segments
                }
            ]
            allIntervals.splice(index, 1, ...intervals);
            command.from = command.to + 1;
            continue;
        }

        // if we start with the intersect, but end after the intersect, just add to the list
        // the part after the intersect is considered on the next intersect
        if (command.from === intersect.from && command.to > intersect.to) {
            intersect.segments.push(segment);
            command.from = intersect.to + 1;
            continue;
        }

        // if we start after the intersect, but end before the intersect, we split to three
        // one for the intersect before us, one with both, and one for the intersect after us
        if (command.from > intersect.from && command.to < intersect.to) {
            const intervals = [
                {
                    from: intersect.from,
                    to: command.from - 1,
                    segments: intersect.segments
                },
                {
                    from: command.from,
                    to: command.to,
                    segments: [...intersect.segments, segment]
                },
                {
                    from: command.to + 1,
                    to: intersect.to,
                    segments: [...intersect.segments]
                }
            ]
            allIntervals.splice(index, 1, ...intervals);
            index +=1;
            command.from = command.to + 1;
            continue;
        }

        // if we start after the intersect, but end with the intersect, we split to two
        // one for the intersect before us, and one with both
        if (command.from > intersect.from && command.to === intersect.to) {
            const intervals = [
                {
                    from: intersect.from,
                    to: command.from - 1,
                    segments: intersect.segments
                },
                {
                    from: command.from,
                    to: command.to,
                    segments: [...intersect.segments, segment]
                }
            ]
            allIntervals.splice(index, 1, ...intervals);
            command.from = command.to + 1;
            continue;
        }

        // if we start after the intersect, but end after the intersect, we split to two
        // one for the intersect before us, one with both
        // the part after the intersect is considered on the next intersect
        if (command.from > intersect.from && command.to > intersect.to) {
            const intervals = [
                {
                    from: intersect.from,
                    to: command.from - 1,
                    segments: intersect.segments
                },
                {
                    from: command.from,
                    to: intersect.to,
                    segments: [...intersect.segments, segment]
                }
            ]
            allIntervals.splice(index, 1, ...intervals);
            command.from = intersect.to + 1;
            continue;
        }
    }

    if (command.from <= command.to) {
        allIntervals.splice(index+1, 0, {
            from: command.from,
            to: command.to,
            segments: [segment]
        });
    }

    // solving an index bug with sorting
    allIntervals.sort((a, b) => a.from - b.from);
}

const separateByX = (commands: Command[]) => {
    commands.sort((a, b) => a.x.from - b.x.from);
    const xIntervals: XIntervalSegment[] = [];

    for (const commandSource of commands) {
        const command: Command = {
            ...commandSource,
            x: {...commandSource.x},
            y: {...commandSource.y},
            z: {...commandSource.z}
        }

        const intersects = xIntervals.filter(x => {
            // if it ends before our begins, we don't intersect
            if (x.from > command.x.to) {
                return false;
            }
            // if it begins after our ends, we don't intersect
            if (x.to < command.x.from) {
                return false;
            }
            return true;
        });

        if (intersects.length === 0) {
            xIntervals.push({
                from: command.x.from,
                to: command.x.to,
                segments: [{
                    index: command.index,
                    action: command.action,
                    y: { from: command.y.from, to: command.y.to },
                    z: { from: command.z.from, to: command.z.to },
                }]
            });
            continue;
        }

        const segment = {
            index: command.index,
            action: command.action,
            y: command.y,
            z: command.z,
        };

        executeIntersect(intersects, xIntervals, segment, command.x);
    }

    return xIntervals;
};

const separateByY = (source: XIntervalSegment) => {
    const xdiff = source.to - source.from + 1;
    const yIntervals: YIntervalSegment[] = [];

    source.segments.sort((a, b) => a.y.from - b.y.from);

    // separate by y
    for (const commandSource of source.segments) {
        const command: XSegment = {
            ...commandSource,
            y: {...commandSource.y},
            z: {...commandSource.z},
        }
        const intersects = yIntervals.filter(y => {
            // if it ends before our begins, we don't intersect
            if (y.from > command.y.to) {
                return false;
            }
            // if it begins after our ends, we don't intersect
            if (y.to < command.y.from) {
                return false;
            }
            return true;
        });
        if (intersects.length === 0) {
            yIntervals.push({
                from: command.y.from,
                to: command.y.to,
                xdiff,
                segments: [{
                    index: command.index,
                    action: command.action,
                    xdiff: xdiff,
                    z: { from: command.z.from, to: command.z.to },
                }]
            });
            continue;
        }
        const segment = {
            index: command.index,
            action: command.action,
            xdiff,
            z: command.z,
        };

        executeIntersect(intersects, yIntervals, segment, command.y);
    }
    for (const yi of yIntervals) {
        yi.xdiff = xdiff;
    }
    return yIntervals;
}

const separateByZ = (source: YIntervalSegment) => {
    const xdiff = source.xdiff;
    const ydiff = source.to - source.from + 1;
    const zIntervals: ZIntervalSegment[] = [];

    source.segments.sort((a, b) => a.z.from - b.z.from);

    // separate by z
    for (const commandSource of source.segments) {
        const command: YSegment = {
            ...commandSource,
            z: {
                from: commandSource.z.from,
                to: commandSource.z.to
            },
        };
        //console.log(`processing ${command.index} with ${yIntervals.length} intersects`);
        const intersects = zIntervals.filter(z => {
            // if it ends before our begins, we don't intersect
            if (z.from > command.z.to) {
                return false;
            }
            // if it begins after our ends, we don't intersect
            if (z.to < command.z.from) {
                return false;
            }
            return true;
        });
        if (intersects.length === 0) {
            zIntervals.push({
                from: command.z.from,
                to: command.z.to,
                xdiff,
                ydiff,
                segments: [{
                    index: command.index,
                    action: command.action,
                    xdiff: xdiff,
                    ydiff: ydiff,
                }]
            });
            continue;
        }
        const segment = {
            index: command.index,
            action: command.action,
            xdiff,
            ydiff,
        };

        executeIntersect(intersects, zIntervals, segment, command.z);
    }

    for (const zi of zIntervals) {
        zi.xdiff = xdiff;
        zi.ydiff = ydiff;
    }

    return zIntervals;
}

const partTwo = (input: Command[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const minx = input.min(c => c.x.from);
    const miny = input.min(c => c.y.from);
    const minz = input.min(c => c.z.from);

    // translate to positive
    const commands = input.map(command => ({
        index: command.index,
        action: command.action,
        x: { from: command.x.from - minx, to: command.x.to - minx},
        y: { from: command.y.from - miny, to: command.y.to - miny},
        z: { from: command.z.from - minz, to: command.z.to - minz}
    }));

    let totalLit = 0;

    const xsegments = separateByX(commands);
    for (const xsegment of xsegments) {
        const ysegments = separateByY(xsegment);
        for (const ysegment of ysegments) {
            const zsegments = separateByZ(ysegment);
            for (const zsegment of zsegments) {
                const segments = zsegment.segments.slice();
                // only the last rule is active
                segments.sort((a, b) => b.index - a.index);
                const rule = segments[0];
                if (rule.action === "on") {
                    totalLit += zsegment.xdiff * zsegment.ydiff * (zsegment.to - zsegment.from + 1);
                }
            }
        }
    }

    return totalLit;
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
