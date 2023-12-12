export function loopMatrix<T>(matrix: T[][], operation: (row: number, column: number, element: T) => any) {
    for (let rindex = 0; rindex < matrix.length; rindex++) {
        const row = matrix[rindex];
        for (let cindex = 0; cindex < row.length; cindex++) {
            const element = row[cindex];
            operation(rindex, cindex, element);
        }
    }
}

export const printMatrix = <T>(matrix: T[][], processor?: (item: T) => string, rowHeader?: (rowIndex: number) => string) => {
    for (let rindex = 0; rindex < matrix.length; rindex++) {
        const row = processor
            ? matrix[rindex].map(item => processor(item))
            : matrix[rindex];
        let rowString = row.join("");
        if (rowHeader) {
            rowString = `${rowHeader(rindex)} ${rowString}`
        }
        console.log(rowString);
    }
}