export function loopMatrix<T>(matrix: T[][], operation: (row: number, column: number, element: T) => any) {
    for (let rindex = 0; rindex < matrix.length; rindex++) {
        const row = matrix[rindex];
        for (let cindex = 0; cindex < row.length; cindex++) {
            const element = row[cindex];
            operation(rindex, cindex, element);
        }
    }
}