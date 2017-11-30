import { FileSystem } from "./file-system";

export function getDay(){
    const dir = process.argv[1].split("\\");
    const dayName = dir[dir.length-1].split(".").slice(0, -1).join("");

    return dayName;
}

export async function readInput(){
    const fileSystem = new FileSystem();
    const input =await fileSystem.readTextFile(`input/${getDay()}.txt`);
    return input;
}

export async function readInputLines(){
    const input = await readInput();
    return input.split("\n");
}