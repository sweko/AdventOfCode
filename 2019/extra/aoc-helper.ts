import { FileSystem } from "./file-system";

export function getDay(day: number) {
    if (day < 10) {
        return `day-0${day}.txt`;
    } else {
        return `day-${day}.txt`;
    }
}

export async function readInput(day: number) {
    const fileSystem = new FileSystem();
    const input = await fileSystem.readTextFile(`input/${getDay(day)}`);
    return input;
}

export async function readInputLines(day: number) {
    const input = await readInput(day);
    return input.split("\r\n");
}

export function loopMatrix<T>(matrix: T[][], operation: (row: number, column: number, element: T) => any) {
    for (let rindex = 0; rindex < matrix.length; rindex++) {
        const row = matrix[rindex];
        for (let cindex = 0; cindex < row.length; cindex++) {
            const element = row[cindex];
            operation(rindex, cindex, element);
        }
    }
}
