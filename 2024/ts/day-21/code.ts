// Solution for day 21 of advent of code 2024

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

const processInput = (day: number) => {
    const lines = readInputLines(day);
    return lines.map(line => line.split(""));
};

type Keypad = string[][];

type Point = {
    x: number,
    y: number
}

type Direction = "^" | "v" | "<" | ">";

class Robot {

    private position: Point;

    private keypadMap: Record<string, Point>;

    public get currentKey(): string {
        return this.keypad[this.position.y][this.position.x];
    }

    constructor(private keypad: Keypad, private action: (key: string) => void) {

        this.keypadMap = {};
        for (let y = 0; y < this.keypad.length; y++) {
            for (let x = 0; x < this.keypad[y].length; x++) {
                const key = this.keypad[y][x];
                if (key === ".") {
                    continue;
                }
                this.keypadMap[key] = { x, y };
            }
        }

        this.position = this.keypadMap["A"];
    }

    moveUp() {
        if (this.position.y === 0) {
            throw new Error(`Cannot move up from ${this.currentKey}`);
        }

        const newPosition = { x: this.position.x, y: this.position.y - 1 };
        if (this.keypad[newPosition.y][newPosition.x] === ".") {
            throw new Error(`Cannot move up from ${this.currentKey}`);
        }

        this.position = newPosition;
    }

    moveDown() {
        if (this.position.y === this.keypad.length - 1) {
            throw new Error(`Cannot move down from ${this.currentKey}`);
        }

        const newPosition = { x: this.position.x, y: this.position.y + 1 };
        if (this.keypad[newPosition.y][newPosition.x] === ".") {
            throw new Error(`Cannot move down from ${this.currentKey}`);
        }
        this.position = newPosition;
    }

    moveLeft() {
        if (this.position.x === 0) {
            throw new Error(`Cannot move left from ${this.currentKey}`);
        }

        const newPosition = { x: this.position.x - 1, y: this.position.y };
        if (this.keypad[newPosition.y][newPosition.x] === ".") {
            throw new Error(`Cannot move left from ${this.currentKey}`);
        }
        this.position = newPosition;
    }

    moveRight() {
        if (this.position.x === this.keypad[this.position.y].length - 1) {
            throw new Error(`Cannot move right from ${this.currentKey}`);
        }

        const newPosition = { x: this.position.x + 1, y: this.position.y };
        if (this.keypad[newPosition.y][newPosition.x] === ".") {
            throw new Error(`Cannot move right from ${this.currentKey}`);
        }
        this.position = newPosition;
    }

    exec(direction: Direction | "A") {
        switch (direction) {
            case "^":
                this.moveUp();
                break;
            case "v":
                this.moveDown();
                break;
            case "<":
                this.moveLeft();
                break;
            case ">":
                this.moveRight();
                break;
            case "A":
                this.pressKey();
                break;
        }
    }

    pressKey() {
        this.action(this.currentKey);
    }

    print() {
        console.log(this.keypad);
        console.log(this.keypadMap);
        console.log(this.currentKey);
    }

    printKey() {
        console.log(this.currentKey);
    }
}

const partOne = (input: string[][], debug: boolean) => {
    return -1;
    const numKeypad = [
        ["7", "8", "9"],
        ["4", "5", "6"],
        ["1", "2", "3"],
        [".", "0", "A"]
    ];

    const dirKeypad = [
        [ ".", "^", "A" ],
        [ "<", "v", ">" ]
    ];


    const robotOne = new Robot(numKeypad, (key) => console.log(key));
    const robotTwo = new Robot(dirKeypad, (key) => {
        robotOne.exec(key as Direction | "A");
    });
    const robotThree = new Robot(dirKeypad, (key) => {
        robotTwo.exec(key as Direction | "A");
    });

    //029A
    //const directions = "<A^A^^>AvvvA";
    const directions = "<v<A>>^A<vA<A>>^AAvAA<^A>A<v<A>>^AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A";
    for (const direction of directions) {
        robotThree.exec(direction as Direction);
    }

    return input.length;
};

const partTwo = (input: string[][], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    return input.length;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: string[][]) => {
    console.log(input);
};

const test = (_: string[][]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<string[][], number> = {
    day: 21,
    input: () => processInput(21),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}