import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

const processInput = async (day: number) => {
    const input = await readInput(day);
    return input;
};

interface BasePacket {
    version: number;
    length: number;
}

interface LiteralPacket extends BasePacket {
    type: 4;
    value: number;
}

interface OperatorPacket extends BasePacket {
    type:  Exclude<number, 4>;
    subpackets: Packet[];
}

type Packet = LiteralPacket | OperatorPacket;

const toBinaryString = (hexString: string) : string => {
    const result = hexString.split("").map(c => parseInt(c, 16).toString(2).padStart(4, "0")).join("");
    return result;
}

// this method is NOT a general purpose method
const toHexString = (binaryString: string) : string => {
    let start = 0;
    const hexdigits = []
    while (start < binaryString.length) {
        hexdigits.push(parseInt(binaryString.slice(start, start + 4).padEnd(4, "0"), 2).toString(16));
        start += 4;
    }
    const result = hexdigits.join("");
    return result;
}

const parsePacket = (input: string): Packet => {
    const binary = toBinaryString(input);
    const version = parseInt(binary.slice(0, 3), 2);
    const type = parseInt(binary.slice(3, 6), 2);
    if (type === 4) {
        // parsing literal packets
        let start = 6;
        const literals: string[] = [];
        while (true) {
            // assume we have at least one literal value
            const literal = binary.slice(start+1, start + 5);
            literals.push(literal);
            const isLast = binary.slice(start, start + 1) === "0";
            if (isLast) {
                break;
            }
            start += 5;
        }

        const value = parseInt(literals.join(""), 2);

        return {
            type,
            version,
            value,
            length: 6 + literals.length * 5
        };
    } else {
        // parsing operator packets
        const lengthTypeId = binary.slice(6, 7);
        if (lengthTypeId === "0") {
            // total length parsing
            const totalLenght = parseInt(binary.slice(7, 22),2);
            let processedLength = 0;
            let subpacketsData = binary.slice(22, 22 + totalLenght);
            const subpackets: Packet[] = [];
            while (processedLength != totalLenght) {
                const subpacket = parsePacket(toHexString(subpacketsData));
                subpackets.push(subpacket);
                processedLength += subpacket.length;
                subpacketsData = subpacketsData.slice(subpacket.length);
            }
            return {
                type,
                version,
                subpackets,
                length: totalLenght + 22
            }
        } else {
            // number of sub-packet parsing
            const subNumber = parseInt(binary.slice(7, 18),2);
            const subpackets: Packet[] = [];
            let subpacketsData = binary.slice(18);
            let count = 0;
            let processedLength = 0;
            while (count < subNumber) {
                const subpacket = parsePacket(toHexString(subpacketsData));
                subpackets.push(subpacket);
                processedLength += subpacket.length;
                subpacketsData = subpacketsData.slice(subpacket.length);
                count += 1;
            }
            return {
                type,
                version,
                subpackets,
                length: processedLength + 18
            }
        }
    }
}

const getVersionSum = (packet: Packet) => {
    if (packet.type === 4) {
        return packet.version;
    }
    return packet.version + (packet as OperatorPacket).subpackets.map(p => getVersionSum(p)).sum();
}

const partOne = (input: string, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const packet = parsePacket(input);
    return getVersionSum(packet);
};

const evaluatePacket = (packet: Packet): number => {
    if (packet.type === 4) {
        return (packet as LiteralPacket).value;
    } else {
        const opPacket = packet as OperatorPacket;
        const values = opPacket.subpackets.map(p => evaluatePacket(p));
        // arithmetic packets
        if (opPacket.type === 0) { // sum packet
            return values.sum();
        }
        if (opPacket.type === 1) { // product packet
            return values.reduce((a, b) => a * b, 1);
        }
        if (opPacket.type === 2) { // min packet
            return values.min();
        }
        if (opPacket.type === 3) { // max packet
            return values.max();
        }
        // logical packets
        const first = values[0];
        const second = values[1];
        if (opPacket.type === 5) { // greater than packet
            return (first > second) ? 1 : 0;
        }
        if (opPacket.type === 6) { // less than packet
            return (first < second) ? 1 : 0;
        }
        if (opPacket.type === 7) { // equal to packet
            return (first === second) ? 1 : 0;
        }
    }
}

const partTwo = (input: string, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const packet = parsePacket(input);
    return evaluatePacket(packet);
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: string) => {
    console.log(input);
};

const test = (_: string) => {
    console.log("----Test-----");

    console.log(parsePacket("D2FE28"))
    console.log(parsePacket("38006F45291200"));
    console.log(parsePacket("EE00D40C823060"));
};

export const solutionSixteen: Puzzle<string, number> = {
    day: 16,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
