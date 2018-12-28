import { terminal } from "terminal-kit";

export const printRow = (row: any[], pad: number = 5) => {
    return "[" + row.map(item => String(item).padStart(pad)).join("") +"\t]";
}

export const generateModuloPrinter = (modulo: number) => {
    let firstTime = true;
    return {
        print: (index?: number, ...values: any[]) => {
            if (index === undefined) {
                index = values[0];
            }
            if (index % modulo === 0) {
                if (!firstTime) {
                    terminal.previousLine();
                } else {
                    firstTime = false;
                }
                console.log(...values, Array(10).fill(" ").join(""));
            }
        }
    }
}

export const generatePrinter = () => generateModuloPrinter(1);

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