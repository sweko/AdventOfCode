
export function mapMatrix<T, U>(matrix: T[][], mapper: (item: T, rindex:number, cindex: number) => U) {
    return matrix.map((row, rindex) => row.map((item, cindex) => mapper(item, rindex, cindex)));
}
