"use strict";
var fs = require("fs");
let part1 = false;
let part2 = true;

if (part1) {
    fs.readFile("input.txt", "utf8", (err, data) => {
        let commands = data.split(", ").map(c => {
            return {
                direction: c[0],
                length: Number(c.substr(1))
            };
        });
        let directions = {
            north: { R: "east", L: "west", op: (value) => top += value },
            south: { R: "west", L: "east", op: (value) => top -= value },
            west: { R: "north", L: "south", op: (value) => left += value },
            east: { R: "south", L: "north", op: (value) => left -= value },
        }
        let top = 0;
        let left = 0;

        let direction = "north";
        for (let index = 0; index < commands.length; index++) {
            let command = commands[index];
            direction = directions[direction][command.direction]
            directions[direction].op(command.length);
            //console.log(`Traveling ${direction} for ${command.length} units`);
        }

        //console.log(commands);
        console.log(Math.abs(top) + Math.abs(left));
        return;
    });
}

if (part2) {
    fs.readFile("input.txt", "utf8", (err, data) => {
        //data = "R8, R4, R4, R8";
        let commands = data.split(", ").map(c => {
            return {
                direction: c[0],
                length: Number(c.substr(1))
            };
        });
        let found = false;

        let directions = {
            north: {
                R: "east", L: "west", op: (value) => {
                    for (let x = location.top + 1; x <= location.top + value; x += 1) {
                        if (locations.some(l => l.top === x && l.left === location.left)) {
                            console.log(Math.abs(x) + Math.abs(location.left));
                            found = true;
                            return;
                        }
                        locations.push({ top: x, left: location.left })
                    }
                    location.top += value;
                }
            },
            south: {
                R: "west", L: "east", op: (value) => {
                    for (let x = location.top - 1; x >= location.top - value; x -= 1) {
                        if (locations.some(l => l.top === x && l.left === location.left)) {
                            console.log(Math.abs(x) + Math.abs(location.left));
                            found = true;
                            return;
                        }
                        locations.push({ top: x, left: location.left })
                    }
                    location.top -= value;
                }
            },
            west: {
                R: "north", L: "south", op: (value) => {
                    for (let x = location.left + 1; x <= location.left + value; x += 1) {
                        if (locations.some(l => l.top === location.top && l.left === x)) {
                            console.log(Math.abs(x) + Math.abs(location.top));
                            found = true;
                            return;
                        }
                        locations.push({ top: location.top, left: x })
                    }
                    location.left += value;
                }
            },
            east: {
                R: "south", L: "north", op: (value) => {
                    for (let x = location.left - 1; x >= location.left - value; x -= 1) {
                        if (locations.some(l => l.top === location.top && l.left === x)) {
                            console.log(Math.abs(x) + Math.abs(location.top));
                            found = true;
                            return;
                        }
                        locations.push({ top: location.top, left: x })
                    }
                    location.left -= value;
                }
            },
        }

        let location = {
            top: 0,
            left: 0,
            toString: function () { return `top: ${this.top}, left: ${this.left}` }
        }

        let locations = [{ top: 0, left: 0 }];

        let direction = "north";
        for (let index = 0; index < commands.length; index++) {
            let command = commands[index];
            direction = directions[direction][command.direction]
            console.log(`Traveling ${direction} for ${command.length} units`);
            directions[direction].op(command.length);
            if (found)
                return;
        }

        console.log(locations);
        //console.log(Math.abs(location.top) + Math.abs(location.left));
        return;
    });
}