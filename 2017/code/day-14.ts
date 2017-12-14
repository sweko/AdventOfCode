import { readInput, readInputLines } from "../extra/aoc-helper";
import { listenerCount } from "cluster";

async function main() {

    let input = "amgozmfv";

    let bitCount = processPartOne(input);
    console.log(`Part 1: total number of set bits = ${bitCount}`);

    let regionCount = processPartTwo(input);
    console.log(`Part 2: total number of regions = ${regionCount}`);

}


function reversePart(array: number[], start: number, length: number) {
    const result = array.slice();

    for (let index = 0; index < length / 2; index++) {
        const lindex = (index + start) % array.length
        const rindex = (length - index - 1 + start) % array.length;
        const temp = result[lindex];
        result[lindex] = result[rindex];
        result[rindex] = temp;
    }

    return result;
}

function runHash(selectors: number[], listSize: number) {
    let array = getArray(listSize);
    let skipindex = 0;
    let offset = 0;
    selectors.forEach(length => {
        array = reversePart(array, offset, length);
        offset = (offset + length + skipindex) % listSize;
        skipindex += 1;
    })

    return array;
}

function runExtendedHash(selectors: number[], listSize: number) {
    selectors.push(17, 31, 73, 47, 23);
    selectors = [].concat(...Array(64).fill(selectors));
    return runHash(selectors, listSize);
}

function getArray(size: number) {
    return Array(size).fill(0).map((_, i) => i);
}

function getDenseHash(sparseHash: number[]) {
    return getArray(16).map(i => sparseHash.slice(i * 16, (i + 1) * 16).reduce((a, b) => a ^ b));
}

function getFullHash(input: string) {
    const listSize = 256;
    const selectors = input.split("").map(c => c.charCodeAt(0));
    const sparseHash = runExtendedHash(selectors, listSize);
    const denseHash = getDenseHash(sparseHash);
    return denseHash.map(dh => dh.toString(16).padStart(2, "0")).join("");
}

function getDiskMap(keyString: string) {
    const rowValues = getArray(128)
        .map(i => `${keyString}-${i}`)
        .map(row => getFullHash(row).split("").map(c => parseInt(c, 16).toString(2).padStart(4, "0")).join(""));
    return rowValues;
}

function processPartOne(keyString: string) {
    return getDiskMap(keyString)
        .map(row => row.split("").filter(c => c === "1").length)
        .reduce((a, b) => a + b);
}

function processPartTwo(keyString: string) {
    const diskMap = getDiskMap(keyString);
    let bitCount = processPartOne(keyString);
    const bitField: (number | string)[][] = diskMap.map(row => row.split("").map(c => c === "1" ? 0 : "X"));
    let regindex = 0;
    while (bitCount != 0) {
        let [x, y] = [0, 0];
        while ((y = bitField[x].indexOf(0)) === -1) x++;

        let localRegion = [{ x: x, y: y }];
        let index = 0;
        regindex += 1;
        while (index < localRegion.length) {
            let { x, y } = localRegion[index];
            if ((x !== 0) && (bitField[x - 1][y] === 0)) {
                if (!localRegion.find(point => point.x == x - 1 && point.y == y)) {
                    localRegion.push({ x: x - 1, y: y });
                }
            }
            if ((x !== bitField.length - 1) && (bitField[x + 1][y] === 0)) {
                if (!localRegion.find(point => point.x == x + 1 && point.y == y)) {
                    localRegion.push({ x: x + 1, y: y });
                }
            }
            if (bitField[x][y - 1] === 0) {
                if (!localRegion.find(point => point.x == x && point.y == y - 1)) {
                    localRegion.push({ x: x, y: y - 1 });
                }
            }
            if (bitField[x][y + 1] === 0) {
                if (!localRegion.find(point => point.x == x && point.y == y + 1)) {
                    localRegion.push({ x: x, y: y + 1 });
                }
            }
            bitField[x][y] = regindex;
            index++;
        }
        bitCount -= localRegion.length;
    }

    return regindex;
}



main();