import { terminal } from "terminal-kit";

export const generateModuloPrinter = (modulo: number) => {
    let firstTime = true;
    return (value: any, index?: number) => {
        if (index === undefined) {
            index = value;
        }
        if (index % modulo === 0) {
            if (!firstTime) {
                terminal.previousLine();
            } else {
                firstTime = false;
            }
            console.log(value);
        }
    }
}

export const printMatrix = (matrix: any[][]) => {
    for (let rindex = 0; rindex < matrix.length; rindex++) {
        const row = matrix[rindex];
        console.log(row.join(""));
    }
}