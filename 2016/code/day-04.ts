import { readInput, readInputLines } from "../extra/aoc-helper";

interface Room {
    name: string,
    sector: number;
    checksum: string,
    calcChecksum: string;
}

async function main() {
    const lines = await readInputLines();
    const regex = /^([a-z-]*)\-(\d*)\[([a-z]*)\]$/;
    const rooms = lines.map(l => {
        const match = l.match(regex);
        return {
            name: match[1],
            sector: Number(match[2]),
            checksum: match[3],
            calcChecksum: getChecksum(match[1])
        }
    });

    const sum = processPartOne(rooms);
    console.log(`Part 1: Sum of sectors = ${sum}`);

    processPartTwo(rooms);
}

function processPartOne(rooms: Room[]) {
    const sum = rooms.filter(room => room.checksum === room.calcChecksum).reduce((acc, r) => acc + r.sector, 0);
    return sum;
}

function processPartTwo(rooms: Room[]) {
    rooms = rooms.filter(room => room.checksum === room.calcChecksum);
    var names = rooms.map(room => {
        const chars = room.name.split("").map(c => {
            if (c === "-") return " ";
            return String.fromCharCode(((c.charCodeAt(0) - 97 + room.sector) % 26) + 97);
        });
        return {
            name: chars.join(""),
            sector: room.sector
        };
    });
    console.log("Part 2:")
    names.filter(name => name.name.indexOf("north") !== -1).forEach(n => console.log(n.name, n.sector));
}

function getChecksum(name: string) {
    const freqs = getFrequency(name);

    freqs.sort((a, b) => {
        const value = b.value - a.value;
        if (value !== 0) return value;
        return a.char.charCodeAt(0) - b.char.charCodeAt(0);
    });
    return freqs.slice(0, 5).map(f => f.char).join("");
}

function getFrequency(name: string) {
    const freq = {};
    for (let index = 0; index < name.length; index++) {
        const char = name[index];
        if (char === "-")
            continue;
        if (freq[char]) {
            freq[char] += 1;
        } else {
            freq[char] = 1;
        }
    }

    return Object.keys(freq).map(key => ({ char: key, value: freq[key] }));
}

main();