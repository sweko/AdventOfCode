import { readInputLines, readInput, debugLog } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";
import { PriorityQueue } from "../extra/prio-queue";

interface Point {
    x: number;
    y: number;
    z: number;
}

interface Drone extends Point {
    r: number;
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const drones: Drone[] = lines.map(line => {
        const match = line.match(/^pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)$/);
        return {
            x: Number(match[1]),
            y: Number(match[2]),
            z: Number(match[3]),
            r: Number(match[4])
        }
    });
    return drones;
};

const getDistance = (first: Point, second: Point) => Math.abs(first.x - second.x) + Math.abs(first.y - second.y) + Math.abs(first.z - second.z);

const partOne = (drones: Drone[], debug: boolean) => {
    const strongest = drones.maxFind(d => d.r);

    debugLog(debug, "Drone with maximum range is:", strongest);

    const inRange = drones.filter(drone => getDistance(drone, strongest) <= strongest.r);

    return inRange.length;
};

interface Box {
    x: { min: number, max: number };
    y: { min: number, max: number };
    z: { min: number, max: number };
    volume: number;
};

const setVolume = (box: Box) => {
    box.volume = (box.x.max - box.x.min + 1) * (box.y.max - box.y.min + 1) * (box.z.max - box.z.min + 1);
}

const splitToOctants = (box: Box): Box[] => {
    const xmid = ((box.x.max + box.x.min) / 2) | 0;
    const xtop = { min: Math.min(xmid + 1, box.x.max), max: box.x.max };
    const xbot = { min: box.x.min, max: xmid };

    const ymid = ((box.y.max + box.y.min) / 2) | 0;
    const ytop = { min: Math.min(ymid + 1, box.y.max), max: box.y.max };
    const ybot = { min: box.y.min, max: ymid };

    const zmid = ((box.z.max + box.z.min) / 2) | 0;
    const ztop = { min: Math.min(zmid + 1, box.z.max), max: box.z.max };
    const zbot = { min: box.z.min, max: zmid };

    const octants = [
        { x: xtop, y: ytop, z: ztop, volume: 0 },
        { x: xtop, y: ytop, z: zbot, volume: 0 },
        { x: xtop, y: ybot, z: ztop, volume: 0 },
        { x: xtop, y: ybot, z: zbot, volume: 0 },
        { x: xbot, y: ytop, z: ztop, volume: 0 },
        { x: xbot, y: ytop, z: zbot, volume: 0 },
        { x: xbot, y: ybot, z: ztop, volume: 0 },
        { x: xbot, y: ybot, z: zbot, volume: 0 },
    ];

    for (const octant of octants) {
        setVolume(octant);
    }
    return octants;
}

// const calcPointReach()

const intersect = (drone: Drone, box: Box) => {
    let reachPoint: Point = { x: Number.NaN, y: Number.NaN, z: Number.NaN };

    if (drone.x < box.x.min) { // under minx
        reachPoint.x = box.x.min;
    } else if (drone.x <= box.x.max) { // between two xes
        reachPoint.x = drone.x;
    } else { // over maxx
        reachPoint.x = box.x.max;
    }

    if (drone.y < box.y.min) { // under miny
        reachPoint.y = box.y.min;
    } else if (drone.y <= box.y.max) { // between two ys
        reachPoint.y = drone.y;
    } else { // over maxy
        reachPoint.y = box.y.max;
    }

    if (drone.z < box.z.min) { // under minz
        reachPoint.z = box.z.min;
    } else if (drone.z <= box.z.max) { // between two zs
        reachPoint.z = drone.z;
    } else { // over maxz
        reachPoint.z = box.z.max;
    }

    /*
        if (drone.x < box.x.min) { // under minx
            if (drone.y < box.y.min) { // under miny
                if (drone.z < box.z.min) { // under minz
                    // under-under-under - does it touch {min, min, min}
                    reachPoint = {x: box.x.min, y: box.y.min, z: box.z.min};
                } else if (drone.z <= box.z.max) { // between two zs
                    // under-under-between - touches z=drone.z line
                    reachPoint = {x: box.x.min, y: box.y.min, z: drone.z};
                } else { // over maxz
                    // under-under-over - does it touch {min, min, max}
                    reachPoint =  {x: box.x.min, y: box.y.min, z: box.z.max};
                }
            } else if (drone.y <= box.y.max) { // between two ys
                if (drone.z < box.z.min) { // under minz
                    // under-between-under
                } else if (drone.z <= box.z.max) { // between two zs
                } else { // over maxz
                }
            } else { // over maxy
                if (drone.z < box.z.min) { // under minz
                } else if (drone.z <= box.z.max) { // between two zs
                } else { // over maxz
                }
            }
        } else if (drone.x <= box.x.max) { // between two xes
            if (drone.y < box.y.min) { // under miny
                if (drone.z < box.z.min) { // under minz
                } else if (drone.z <= box.z.max) { // between two zs
                } else { // over maxz
                }
            } else if (drone.y <= box.y.max) { // between two ys
                if (drone.z < box.z.min) { // under minz
                } else if (drone.z <= box.z.max) { // between two zs
                } else { // over maxz
                }
            } else { // over maxy
                if (drone.z < box.z.min) { // under minz
                } else if (drone.z <= box.z.max) { // between two zs
                } else { // over maxz
                }
            }
        } else { // over maxx
            if (drone.y < box.y.min) { // under miny
                if (drone.z < box.z.min) { // under minz
                } else if (drone.z <= box.z.max) { // between two zs
                } else { // over maxz
                }
            } else if (drone.y <= box.y.max) { // between two ys
                if (drone.z < box.z.min) { // under minz
                } else if (drone.z <= box.z.max) { // between two zs
                } else { // over maxz
                }
            } else { // over maxy
                if (drone.z < box.z.min) { // under minz
                } else if (drone.z <= box.z.max) { // between two zs
                } else { // over maxz
                }
            }
        }
        */
    const minDistance = getDistance(drone, reachPoint);
    return minDistance <= drone.r;
};

const isSingle = (box: Box) => {
    if (box.x.max !== box.x.min) return false;
    if (box.y.max !== box.y.min) return false;
    if (box.z.max !== box.z.min) return false;
    return true;
}

const partTwo = (drones: Drone[], debug: boolean) => {
    const getBoxMetric = (box: Box) => {
        const droneCount = drones.filter(drone => intersect(drone, box)).length;
        return droneCount;
    }

    const bound = {
        x: {
            min: drones.min(d => d.x),
            max: drones.max(d => d.x)
        },
        y: {
            min: drones.min(d => d.y),
            max: drones.max(d => d.y)
        },
        z: {
            min: drones.min(d => d.z),
            max: drones.max(d => d.z)
        },
        volume: 0
    }
    setVolume(bound);

    let nodes = [{
        value: bound,
        metric: getBoxMetric(bound)
    }];

    const origin = { x: 0, y: 0, z: 0 };

    // set origin as best (initial value)
    let best: { value: Box, metric: number, distance: number } = {
        value: {
            x: { min: 0, max: 0 },
            y: { min: 0, max: 0 },
            z: { min: 0, max: 0 },
            volume: 1
        },
        metric: 0,
        distance: 0
    };
    best.metric = getBoxMetric(best.value);

    while (nodes.length !== 0) {
        const box = nodes.shift();
        if (box.metric < best.metric) {
            continue;
        }
        if (isSingle(box.value)) {
            const boxDistance = getDistance({
                x: box.value.x.max,
                y: box.value.y.max,
                z: box.value.z.max
            }, origin);
            if (box.metric > best.metric) {
                debugLog(debug, `NEW BESTIE on metric ${box.metric} with distance ${boxDistance}`);
                best = { ...box, distance: boxDistance };
                nodes = nodes.filter(bx => bx.metric >= best.metric);
            } else {
                if (boxDistance < best.distance) {
                    debugLog(debug, `NEW BESTIE on distance ${boxDistance}`);
                    best = { ...box, distance: boxDistance };
                }
            }
        } else {
            const octants = splitToOctants(box.value);
            nodes.push(...octants
                .map(o => ({ value: o, metric: getBoxMetric(o) }))
                .filter(bx => bx.metric >= best.metric)
            );
            nodes.sort((f, s) => {
                if (s.metric - f.metric !== 0)
                    return s.metric - f.metric;
                if (s.value.volume - f.value.volume !== 0) {
                    return s.value.volume - f.value.volume;
                }
                return 0;
            });
        }
    }
    return best.distance;
}

const resultOne = (_: any, result: number) => {
    return `Total ${result} drones in range`;
};

const resultTwo = (_: any, result: number) => {
    return `Distance to nearest point with most drones is ${result}`;
};

const showInput = (input: Drone[]) => {
    console.log(input);
};

const test = (_: Drone[]) => {
    console.log("----Test 1-----");
    const test1: Box = {
        x: { min: 7, max: 8 },
        y: { min: 7, max: 8 },
        z: { min: 7, max: 8 },
        volume: 8
    }
    console.log(test1);
    console.log(splitToOctants(test1));

    console.log("----Test 2-----");
    const test2: Box = {
        x: { min: 7, max: 8 },
        y: { min: 7, max: 8 },
        z: { min: 7, max: 7 },
        volume: 4
    }
    console.log(splitToOctants(test2));

};

export const solution23_2018: Puzzle<Drone[], number> = {
    day: 232018,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
