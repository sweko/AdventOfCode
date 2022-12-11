import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

abstract class FsItem {
    name: string;
    abstract get size(): number;
}

type Folder = ChildFolder | RootFolder;

class RootFolder extends FsItem {
    name = "/";

    children: FsItem[] = [];

    get size() {
        return this.children.sum(child => child.size)
    }
}

class ChildFolder extends FsItem {
    children: FsItem[] = [];

    constructor(public name: string, public parent: Folder) {
        super();
    }

    get size() {
        return this.children.sum(child => child.size)
    }
}

class File extends FsItem {
    private _size: number;

    constructor(public name: string, size: number, public parent: Folder) {
        super();
        this._size = size;
    }

    get size() {
        return this._size;
    }
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const rootLine = lines[0];
    if (rootLine !== "$ cd /") {
        throw Error("Invalid root line");
    }
    const root = new RootFolder();
    let currentFolder: Folder = root;
    for (let index = 1; index < lines.length; index++) {
        const line = lines[index];
        if (line === "$ ls") {
            // run next lines until end or next command
            if (index === lines.length - 1) {
                throw Error("Unexpected end of input");
            }
            index += 1;
            while ((index < lines.length) && (!lines[index].startsWith("$"))) {
                // process a file
                const fileLine = lines[index];
                const parts = fileLine.split(" ");
                if (parts.length !== 2) {
                    throw Error(`Invalid file line ${fileLine}`);
                }
                const fileName = parts[1];
                if (currentFolder.children.every(child => child.name !== fileName)) {
                    if (parts[0] === "dir") {
                        const child = new ChildFolder(fileName, currentFolder);
                        currentFolder.children.push(child);
                    } else {
                        const size = parseInt(parts[0], 10);
                        const child = new File(fileName, size, currentFolder);
                        currentFolder.children.push(child);
                    }
                }
                index += 1;
            }
            index -= 1;
            continue;
        }
        if (line === "$ cd ..") {
            if (!(currentFolder instanceof ChildFolder)) {
                throw Error("Cannot go up from root");
            }
            currentFolder = currentFolder.parent;
            continue;
        }
        if (line.startsWith("$ cd ")) {
            const folderName = line.substring(5);
            let child = currentFolder.children.find(child => child.name === folderName);
            if (child === undefined) {
                child = new ChildFolder(folderName, currentFolder);
                currentFolder.children.push(child);
            }
            if (!(child instanceof ChildFolder)) {
                throw Error("Cannot cd into file");
            }
            currentFolder = child;
        }
    }
    return root;
};

const partOne = (input: RootFolder, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const queue: Folder[] = [input];
    const result: Folder[] = [];

    while (queue.length > 0) {
        const folder = queue.shift();
        if (folder.size <= 100_000) {
            result.push(folder);
        }
        for (const child of folder.children) {
            if (child instanceof ChildFolder) {
                queue.push(child);
            }
        }
    }

    return result.sum(folder => folder.size);
};

const partTwo = (input: RootFolder, debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    const total = 70_000_000;
    const needed = 30_000_000;

    const used = input.size;
    const free = total - used;
    const required = needed - free;

    if (required <= 0) {
        return 0;
    }

    const queue: Folder[] = [input];
    let min = input.size;

    while (queue.length > 0) {
        const folder = queue.shift();
        if ((folder.size >= required) && (min > folder.size)) {
            min = folder.size;
        }
        for (const child of folder.children) {
            if (child instanceof ChildFolder) {
                queue.push(child);
            }
        }
    }

    return min;

};

const resultOne = (_: RootFolder, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: RootFolder, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: RootFolder) => {
    console.log(input);
};

const test = (_: RootFolder) => {
    console.log("----Test-----");
};

export const solutionSeven: Puzzle<RootFolder, number> = {
    day: 7,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
