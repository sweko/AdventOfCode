import { readInput, readInputLines } from "../extra/aoc-helper";
import "../extra/array-helpers";

interface Action {
    month: number;
    day: number;
    hour: number;
    minute: number;
    sortString: string;
    action: string;
}

interface Guard {
    id: number;
    totalSleep: number;
    minutes: number[];
    bestMinute?: number;
    bestSleeps?: number;
}

async function main() {
    const lines = await readInputLines();

    const actions = lines.map(line => {
        const match = line.match(/^\[1518-(\d{2})-(\d{2}) (\d{2}):(\d{2})] (.*)$/);
        const [, month, day, hour, minute, action] = match;
        return {
            month: Number(month),
            day: Number(day),
            hour: Number(hour),
            minute: Number(minute),
            sortString: month + day + hour + minute,
            action
        };
    })

    const guards = getGuards(actions);

    let sleepyGuard = processPartOne(guards);
    console.log(`Part 1: Guard that sleeps the most is #${sleepyGuard.id} with ${sleepyGuard.totalSleep} (${sleepyGuard.id * sleepyGuard.bestMinute})`);

    sleepyGuard = processPartTwo(guards);
    console.log(`Part 1: Guard with a sleepiest minute is #${sleepyGuard.id} with ${sleepyGuard.bestMinute} (${sleepyGuard.id * sleepyGuard.bestMinute})`);
}

function getGuards(actions: Action[]) {
    const guards: { [key: number]: Guard } = {};
    actions.sort((a, b) => a.sortString.localeCompare(b.sortString));

    for (let index = 0; index < actions.length; index++) {
        const guardAction = actions[index];
        const match = guardAction.action.match(/^Guard #(\d+) begins shift$/);
        const id = Number(match[1]);
        if (!guards[id]) {
            guards[id] = {
                id: id,
                totalSleep: 0,
                minutes: Array(60).fill(0),
            }
        }
        while (actions[index + 1].action === "falls asleep") {
            const start = actions[index + 1];
            const end = actions[index + 2];
            for (let minute = start.minute; minute < end.minute; minute++) {
                guards[id].minutes[minute] += 1;
            }
            guards[id].totalSleep += end.minute - start.minute;
            index += 2;
            if (index + 1 >= actions.length) {
                break;
            }
        }
    }

    const result = Object.values(guards);

    for (const guard of result) {
        const bestMinute = guard.minutes
            .map((sleeps, minute) => ({ sleeps, minute }))
            .sort((f, s) => s.sleeps - f.sleeps)[0];
        guard.bestMinute = bestMinute.minute;
        guard.bestSleeps = bestMinute.sleeps;
    }

    return result;
}

function processPartOne(guards: Guard[]): Guard {
    const sleepyGuard = guards.sort((first, second) => second.totalSleep - first.totalSleep)[0];
    return sleepyGuard;
}


function processPartTwo(guards: Guard[]): Guard {
    const sleepyGuard = guards.sort((first, second) => second.bestSleeps - first.bestSleeps)[0];
    return sleepyGuard;
}


main();