import { readInputLines } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

type Line = {
    [key: number] : boolean
    min: number;
    max: number;
};

type Layer =  {
    [key: number]: Line
    min: number;
    max: number;
}

type State = {
    [key: number]: Layer
    min: number;
    max: number;
};

const processInput = async (day: number) => {
    const input = await readInputLines(day);
    return input.map(line => line.split("").map(char => char === "#"));
};

const printLayer = (layer: boolean[][]) => {
    for (const line of layer) {
        console.log(line.map(char => char ? "#" : "."));
    }
}

const inflateLine = (line: Line): Line => {
    return {
        ...line,
        min: line.min - 1,
        max: line.max + 1,
        [line.min-1]:  false,
        [line.max+1]:  false,
    }
}

const inflate = (state: State): State => {
    const result: State = {
        ...{ 
            ...state,
            
        },
        min: state.min -1,
        max: state.max +1
    };
    return undefined;
}

const getNextState = (state: State): State => {
    const inflated = inflate(state);

    for (let x = state.min -1; x <=state.max +1; x+=1) {
        const layer = state[x];
        for (let y = layer.min -1; y <=layer.max +1; y+=1) {
            const line = layer[y];
            for (let z = line.min -1; z <=line.max +1; z+=1) {
                const cell = line[y];
            }
        }
    }
    return undefined;
}

const partOne = (input: boolean[][], debug: boolean) => {
//    let state = [input.map(line => line.slice)];
    let state: State = {
        0: {
                ...input.reduce((acc, line, index) => ({
                    ...acc, 
                    [index-1]: {
                        ...line.reduce((acc, char, index) => ({
                            ...acc, 
                            [index-1]: char
                        }), {}),
                        min: -1,
                        max: 1
                    }
                }), {}),
                min: -1,
                max: 1,
            },
        min: 0,
        max: 0
    };

    //state = getNextState(state);

    console.log(state);

    return 0;
};

const partTwo = (input: boolean[][], debug: boolean) => {
    return 0;
};

const result = (_: any, result: number) => {
    return `Total number of occupied chairs is ${result}`;
};

const showInput = (input: boolean[][]) => {
    console.log(input);
};

const test = (_: boolean[][]) => {
    const line = { '0': false, '1': true, '-1': false, min: -1, max: 1 };

    console.log(inflateLine(line));
};

export const solutionSeventeen: Puzzle<boolean[][], number> = {
    day: 17,
    input: processInput,
    partOne,
    partTwo,
    resultOne: result,
    resultTwo: result,
    showInput,
    test,
}
