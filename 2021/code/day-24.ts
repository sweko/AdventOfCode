import { readInputLines, readInput, debugLog } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

type Register = "x" | "y" | "z" | "w";

interface InputInstruction {
    type: "inp",
    value: Register
}

interface AddInstruction {
    type: "add",
    target: Register,
    source: Register | number;
}

interface MulInstruction {
    type: "mul",
    target: Register,
    source: Register | number;
}

interface DivInstruction {
    type: "div",
    target: Register,
    source: Register | number;
}

interface ModInstruction {
    type: "mod",
    target: Register,
    source: Register | number;
}

interface EqualsInstruction {
    type: "eql",
    target: Register,
    source: Register | number;
}

type Instruction = InputInstruction | AddInstruction | MulInstruction | DivInstruction | ModInstruction | EqualsInstruction

class AluEmulator {
    private x: number;
    private y: number;
    private z: number;
    private w: number;
    private instructions: Instruction[] = [];

    constructor() {

    }

    public loadProgram(instructions: Instruction[]) {
        this.instructions = instructions.slice();
        this.reset();
    }

    public execute(input: number[]) {
        let inputPointer = 0;
        for (const instruction of this.instructions) {
            if (instruction.type === "inp") {
                this[instruction.value] = input[inputPointer];
                inputPointer += 1;
                continue;
            }
            if (instruction.type === "add") {
                if (typeof instruction.source === "number") {
                    this[instruction.target] += instruction.source;
                } else {
                    this[instruction.target] += this[instruction.source];
                }
                continue;
            }
            if (instruction.type === "mul") {
                if (typeof instruction.source === "number") {
                    this[instruction.target] *= instruction.source;
                } else {
                    this[instruction.target] *= this[instruction.source];
                }
                continue;
            }
            if (instruction.type === "div") {
                if (typeof instruction.source === "number") {
                    this[instruction.target] = (this[instruction.target] / instruction.source) | 0;
                } else {
                    this[instruction.target] = (this[instruction.target] / this[instruction.source]) | 0;
                }
                continue;
            }
            if (instruction.type === "mod") {
                if (typeof instruction.source === "number") {
                    this[instruction.target] = this[instruction.target] % instruction.source;
                } else {
                    this[instruction.target] = this[instruction.target] % this[instruction.source];
                }
                continue;
            }
            if (instruction.type === "eql") {
                if (typeof instruction.source === "number") {
                    this[instruction.target] = (this[instruction.target] === instruction.source) ? 1 : 0;
                } else {
                    this[instruction.target] = (this[instruction.target] === this[instruction.source]) ? 1 : 0;
                }
                continue;
            }
        }
    }


    public reset(){
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
    }

    public getOutput() {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
            w: this.w
        };
    }
}

const processInput = async (day: number) => {
    const lines = await readInputLines(day);
    const instructions = lines.map(line => {
        const parts = line.split(" ");
        if (parts[0] === "inp") {
            return {
                type: "inp" as "inp",
                value: parts[1] as Register
            };
        } else {
            const asNumber = parseInt(parts[2], 10);
            const source = (isNaN(asNumber)) ? parts[2] as Register : asNumber;
            return {
                type: parts[0] as "add" | "mul" | "div" | "mod" | "eql",
                target: parts[1] as Register,
                source
            };
        }
    });

    return instructions;
};

const partOne = (input: Instruction[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }

    /* Constraints:
        i3-3 === i4
        i6+3 === i7
        i5+2 === i8
        i9-5 === i10
        i11-1 === i12
        i2+7 === i13
        i1-8 === i14
    */


    const alu = new AluEmulator();
    alu.loadProgram(input);

    let number = 12_639_999_999_999;
    alu.execute(number.toString().split("").map(c => parseInt(c, 10)));
    debugLog(debug, `Result for ${number}`);
    debugLog(debug, alu.getOutput());
    alu.reset();

    number = 12_439_999_999_999;
    alu.execute(number.toString().split("").map(c => parseInt(c, 10)));
    debugLog(debug, `Result for ${number}`);
    debugLog(debug, alu.getOutput());
    alu.reset();

    number = 99_969_999_999_999;
    alu.execute(number.toString().split("").map(c => parseInt(c, 10)));
    debugLog(debug, `Result for ${number}`);
    debugLog(debug, alu.getOutput());
    alu.reset();

    number = 99_969_699_999_999;
    alu.execute(number.toString().split("").map(c => parseInt(c, 10)));
    debugLog(debug, `Result for ${number}`);
    debugLog(debug, alu.getOutput());
    alu.reset();

    //.......12_345_678_901_234
    number = 99_967_699_999_999;
    alu.execute(number.toString().split("").map(c => parseInt(c, 10)));
    debugLog(debug, `Result for ${number}`);
    debugLog(debug, alu.getOutput());
    alu.reset();

    //.......12_345_678_901_234
    number = 99_967_699_949_999;
    alu.execute(number.toString().split("").map(c => parseInt(c, 10)));
    debugLog(debug, `Result for ${number}`);
    debugLog(debug, alu.getOutput());
    alu.reset();

    //.......12_345_678_901_234
    number = 99_967_699_949_899;
    alu.execute(number.toString().split("").map(c => parseInt(c, 10)));
    debugLog(debug, `Result for ${number}`);
    debugLog(debug, alu.getOutput());
    alu.reset();

    //.......12_345_678_901_234
    number = 92_967_699_949_899;
    alu.execute(number.toString().split("").map(c => parseInt(c, 10)));
    debugLog(debug, `Result for ${number}`);
    debugLog(debug, alu.getOutput());
    alu.reset();

    //.......12_345_678_901_234
    number = 92_967_699_949_891;
    alu.execute(number.toString().split("").map(c => parseInt(c, 10)));
    debugLog(debug, `Result for ${number}`);
    debugLog(debug, alu.getOutput());
    alu.reset();
    return number;
};

const partTwo = (input: Instruction[], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    /* Constraints:
        i3-3 === i4
        i6+3 === i7
        i5+2 === i8
        i9-5 === i10
        i11-1 === i12
        i2+7 === i13
        i1-8 === i14
    */

    const alu = new AluEmulator();
    alu.loadProgram(input);

    //...........12_345_678_901_234
    let number = 91_411_143_612_181;
    alu.execute(number.toString().split("").map(c => parseInt(c, 10)));
    debugLog(debug, `Result for ${number}`);
    debugLog(debug, alu.getOutput());
    alu.reset();

    return number;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Instruction[]) => {
    console.log(input);
};

const test = (input: Instruction[]) => {
    console.log("----Test-----");
    const alu = new AluEmulator();
    alu.loadProgram(input);
    alu.execute([9]);
    console.log(alu.getOutput());
};

export const solutionTwentyFour: Puzzle<Instruction[], number> = {
    day: 24,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
