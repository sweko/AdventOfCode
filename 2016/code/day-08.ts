import { readInput, readInputLines } from "../extra/aoc-helper";

interface Rect {
    type: "rect";
    xsize: number;
    ysize: number;
}

interface RotateX {
    type: "rotx";
    column: number;
    distance: number;
}

interface RotateY {
    type: "roty";
    row: number;
    distance: number;
}

type Command = Rect | RotateX | RotateY;

type Screen = boolean[][];

async function main() {
    let lines = await readInputLines();
    // lines = [
    //     "rect 3x2",
    //     "rotate column x=1 by 1",
    //     "rotate row y=0 by 4",
    //     "rotate column x=1 by 1"
    // ]
    const commands = lines.map(cmd => parseCommand(cmd));

    let litPixels = processPartOne(commands);
    console.log(`Part 1: ${litPixels} are lit`);
}

function runCommand(screen: Screen, command: Command) {
    if (command.type === "rect") {
        for (let i = 0; i < command.ysize; i++) {
            for (let j = 0; j < command.xsize; j++) {
                screen[i][j] = true;
            }
        }
    } else if (command.type === "rotx") {
        let src:boolean[] = [];
        for (let index = 0; index < screen.length; index++) {
            src.push(screen[index][command.column]);
        }
        src = rotateArray(src, command.distance);
        for (let index = 0; index < screen.length; index++) {
            screen[index][command.column] = src[index];
        }
    } else {
        let src:boolean[] = [];
        for (let index = 0; index < screen[command.row].length; index++) {
            src.push(screen[command.row][index]);
        }
        src = rotateArray(src, command.distance);
        for (let index = 0; index < screen[command.row].length; index++) {
            screen[command.row][index] = src[index];
        }
    }
    return screen;
}

function rotateArray<T>(array: T[], distance: number){
    return [...array.slice(-distance), ...array.slice(0, -distance)];
}

function parseCommand(command: string): Command {
    const rectRegex = /rect (\d+)x(\d+)/;
    const rotxRegex = /rotate column x=(\d+) by (\d+)/;
    const rotyRegex = /rotate row y=(\d+) by (\d+)/;

    let match;
    if (match = command.match(rectRegex)) {
        return <Rect>{
            type: "rect",
            xsize: parseInt(match[1]),
            ysize: parseInt(match[2])
        };
    }
    if (match = command.match(rotxRegex)) {
        return <RotateX>{
            type: "rotx",
            column: parseInt(match[1]),
            distance: parseInt(match[2])
        };
    }
    if (match = command.match(rotyRegex)) {
        return <RotateY>{
            type: "roty",
            row: parseInt(match[1]),
            distance: parseInt(match[2])
        };
    }
    throw Error("invalid command");
}

function initScreen(width: number, height: number) {
    const screen: Screen = [];
    for (let i = 0; i < width; i++) {
        screen.push([]);
        for (let j = 0; j < height; j++) {
            screen[i][j] = false;
        }
    }
    return screen;
}

function printScreen(screen: Screen) {
    for (let i = 0; i < screen.length; i++) {
        let line = ""
        for (let j = 0; j < screen[i].length; j++) {
            line += screen[i][j] ? "#" : ".";
        }
        console.log(line)
    }
    console.log();
}

function calcLit(screen: Screen) {
    let sum = 0;
    for (let i = 0; i < screen.length; i++) {
        for (let j = 0; j < screen[i].length; j++) {
            sum += screen[i][j] ? 1 : 0;
        }
    }
    return sum;
}

function processPartOne(commands: Command[]) {
    let screen = initScreen(6, 50);
    for (let index = 0; index < commands.length; index++) {
        const command = commands[index];
        screen = runCommand(screen, command);
    }
    // part 2
    printScreen(screen);
    return calcLit(screen);
}

function processPartTwo(commands: Command[]) {

}

main();