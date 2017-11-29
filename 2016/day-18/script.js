"use strict";
var fs = require("fs");
let part1 = true;
let part2 = false;

let rules = [
    [true, false, false],
    [true, true, false],
    [false, true, true],
    [false, false, true]
];

let getLine = function (srcLine) {
    let line = [false].concat(srcLine).concat([false]);
    let result = [];
    for (var i = 1; i < line.length - 1; i++) {
        result.push(line[i - 1] !== line[i + 1]);
    }
    return result;
}

if (part1) {
    fs.readFile("input.txt", "utf8", (err, data) => {
        //data = ".^^.^.^^^^";
        let lines = [data.split('').map(c => c == '^')];
        while (lines.length < 40) {
            lines.push(getLine(lines[lines.length - 1]))
        }
        console.log(lines.length);
        let result = lines.map(l => l.reduce((a, v) => a + (v ? 0 : 1), 0))
            .reduce((a, v) => a + v, 0);
        console.log(result);
    });
}

if (part2) {
    fs.readFile("input.txt", "utf8", (err, data) => {
        let lines = data.split(/\r?\n/);

        //lines = ["ULL","RRDDD","LURDL","UUUUD"];
        let ops = {
            "1": { "U": 1, "D": 3, "L": 1, "R": 1 },
            "2": { "U": 2, "D": 6, "L": 2, "R": 3 },
            "3": { "U": 1, "D": 7, "L": 2, "R": 4 },
            "4": { "U": 4, "D": 8, "L": 3, "R": 4 },
            "5": { "U": 5, "D": 5, "L": 5, "R": 6 },
            "6": { "U": 2, "D": "A", "L": 5, "R": 7 },
            "7": { "U": 3, "D": "B", "L": 6, "R": 8 },
            "8": { "U": 4, "D": "C", "L": 7, "R": 9 },
            "9": { "U": 9, "D": 9, "L": 8, "R": 9 },
            A: { "U": 6, "D": "A", "L": "A", "R": "B" },
            B: { "U": 7, "D": "D", "L": "A", "R": "C" },
            C: { "U": 8, "D": "C", "L": "B", "R": "C" },
            D: { "U": "B", "D": "D", "L": "D", "R": "D" },
        };
        let code = "";
        let digit = 5;
        for (let index = 0; index < lines.length; index++) {
            let line = lines[index];

            for (let cindex = 0; cindex < line.length; cindex++) {
                let char = line[cindex];
                digit = ops[digit][char];
            }
            code += digit;
        }
        console.log(code);
    });
}