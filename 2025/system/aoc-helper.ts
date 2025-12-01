import * as fs from "fs";
import { debug } from "./run-task";

export function getDay(day: number) {
    if (day < 10) {
        return `day-0${day}`;
    } else {
        return `day-${day}`;
    }
}

export function readInput(day: number) {
    const input = fs.readFileSync(`./${getDay(day)}/input.txt`, "utf8");
    return input;
}

export function readInputLines(day: number) {
    const input = readInput(day);
    return input.split("\r\n");
}

export function dlog(...args:any[]) {
    if (debug) {
        console.log(...args);
    }
}