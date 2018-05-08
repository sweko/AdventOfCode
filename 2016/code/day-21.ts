import { readInput, readInputLines } from "../extra/aoc-helper";
import { terminal } from "terminal-kit";

type Command = ["swp" | "swl" | "rop" | "rol" | "rvr" | "mov", any[]];

class Machine {

    state: string[];


    debug: boolean;

    constructor(public input: string, public commands: Command[]) {
        this.state = this.input.split("");
    }

    printCommands() {
        for (let index = 0; index < this.commands.length; index++) {
            const command = this.commands[index];
            console.log(command);
        }
    }

    private runSwapPosition(first: number, second: number) {
        const temp = this.state[first];
        this.state[first] = this.state[second];
        this.state[second] = temp;
    }

    private runSwapLetter(first: string, second: string) {
        const firstPos = this.state.indexOf(first);
        const secondPos = this.state.indexOf(second);
        this.runSwapPosition(firstPos, secondPos);
    }

    private runReverse(first: number, second: number) {
        const reversed = this.state.slice(first, second + 1).reverse();
        this.state = [...this.state.slice(0, first), ...reversed, ...this.state.slice(second + 1)]
    }

    private runRotatePosition(direction: "left" | "right", amount: number) {
        if (direction === "right")
            amount = this.state.length - amount;
        this.state = [...this.state.slice(amount), ...this.state.slice(0, amount)]
    }

    private runMove(first: number, second: number) {
        let removed = this.state.splice(first, 1);
        this.state = [...this.state.slice(0, second), ...removed, ...this.state.slice(second)]
    }

    private runRotateLetter(letter: string) {
        const letterPos = this.state.indexOf(letter);
        const rotate = letterPos + 1 + ((letterPos >= 4) ? 1 : 0);
        this.runRotatePosition("right", rotate);
    }

    test() {
        this.state = "0123456789".split("");
        this.runMove(0, 9);
        return this.state.join("");
    }


    runProgram() {
        for (let index = 0; index < this.commands.length; index++) {
            const command = this.commands[index];
            if (command[0] === "swp") {
                this.runSwapPosition(command[1][0], command[1][1]);
            } else if (command[0] === "swl") {
                this.runSwapLetter(command[1][0], command[1][1]);
            } else if (command[0] === "rvr") {
                this.runReverse(command[1][0], command[1][1]);
            } else if (command[0] === "mov") {
                this.runMove(command[1][0], command[1][1]);
            } else if (command[0] === "rop") {
                this.runRotatePosition(command[1][0], command[1][1]);
            } else if (command[0] === "rol") {
                this.runRotateLetter(command[1][0]);
            }
        }
        return this.state.join("");
    }
}

async function main() {
    let lines = await readInputLines();
    let input = "abcdefgh";

    // lines = [
    //     "swap position 4 with position 0",
    //     "swap letter d with letter b",
    //     "reverse positions 0 through 4",
    //     "rotate left 1 step",
    //     "move position 1 to position 4",
    //     "move position 3 to position 0",
    //     "rotate based on position of letter b",
    //     "rotate based on position of letter d"
    // ]
    // input = "abcde";

    let instructions = lines.map(cmd => parseInstruction(cmd))

    const machine = new Machine(input, instructions);
    let password = processPartOne(machine);
    console.log(`Part 1: the scrambled password is ${password}`);
    const target = "fbgdceah";
    password = processPartTwo(target, instructions);
    console.log(`Part 2: the plain-text password is ${password}`);
}

function parseInstruction(instruction: string): Command {
    const swapPosRegex = /^swap position (\d) with position (\d)$/;
    const swapLetterRegex = /^swap letter ([a-z]) with letter ([a-z])$/
    const rotateRegex = /^rotate (left|right) (\d) steps?$/
    const rotateLetterRegex = /^rotate based on position of letter ([a-z])$/
    const reverseRegex = /^reverse positions (\d) through (\d)$/
    const moveRegex = /^move position (\d) to position (\d)$/

    let match;
    if (match = instruction.match(swapPosRegex)) {
        let first = parseInt(match[1]);
        let second = parseInt(match[2])
        return ["swp", [first, second]];
    }
    if (match = instruction.match(swapLetterRegex)) {
        return ["swl", [match[1], match[2]]];
    }
    if (match = instruction.match(rotateRegex)) {
        let second = parseInt(match[2])
        return ["rop", [match[1], second]];
    }
    if (match = instruction.match(rotateLetterRegex)) {
        return ["rol", [match[1]]];
    }
    if (match = instruction.match(reverseRegex)) {
        let first = parseInt(match[1]);
        let second = parseInt(match[2])
        return ["rvr", [first, second]];
    }
    if (match = instruction.match(moveRegex)) {
        let first = parseInt(match[1]);
        let second = parseInt(match[2])
        return ["mov", [first, second]];
    }
    throw Error("invalid command");
}

function processPartOne(machine: Machine) {
    const output = machine.runProgram();
    return output;
}

function getPermutations<T>(input: T[]): T[][] {
    if (input.length < 2)
        return [input];

    return [].concat(...input.map((char, index) => getPermutations([...input.slice(0, index), ...input.slice(index + 1)]).map(perm => [char].concat(perm))));

}

function processPartTwo(target: string, instructions: Command[]) {
    const permutations = getPermutations("abcdefgh".split(""));

    for (let index = 0; index < permutations.length; index++) {
        const password = permutations[index].join("");
        const machine = new Machine(password, instructions);
        const output = machine.runProgram();
        if (output === target){
            return password;
        }
        console.log(index);
        terminal.previousLine();
    }
    return "No result found";
}

main();