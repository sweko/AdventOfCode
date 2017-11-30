"use strict";
var fs = require("fs");
var part1 = false;
var part2 = true;
if (part1) {
    fs.readFile("input.txt", "utf8", function (err, data) {
        var commands = data.split(", ").map(function (c) {
            return {
                direction: c[0],
                length: Number(c.substr(1))
            };
        });
        var directions = {
            north: { R: "east", L: "west", op: function (value) { return top += value; } },
            south: { R: "west", L: "east", op: function (value) { return top -= value; } },
            west: { R: "north", L: "south", op: function (value) { return left += value; } },
            east: { R: "south", L: "north", op: function (value) { return left -= value; } },
        };
        var top = 0;
        var left = 0;
        var direction = "north";
        for (var index = 0; index < commands.length; index++) {
            var command = commands[index];
            direction = directions[direction][command.direction];
            directions[direction].op(command.length);
            //console.log(`Traveling ${direction} for ${command.length} units`);
        }
        //console.log(commands);
        console.log(Math.abs(top) + Math.abs(left));
        return;
    });
}
if (part2) {
    fs.readFile("input.txt", "utf8", function (err, data) {
        //data = "R8, R4, R4, R8";
        var commands = data.split(", ").map(function (c) {
            return {
                direction: c[0],
                length: Number(c.substr(1))
            };
        });
        var found = false;
        var directions = {
            north: {
                R: "east", L: "west", op: function (value) {
                    var _loop_1 = function (x) {
                        if (locations.some(function (l) { return l.top === x && l.left === location.left; })) {
                            console.log(Math.abs(x) + Math.abs(location.left));
                            found = true;
                            return { value: void 0 };
                        }
                        locations.push({ top: x, left: location.left });
                    };
                    for (var x = location.top + 1; x <= location.top + value; x += 1) {
                        var state_1 = _loop_1(x);
                        if (typeof state_1 === "object")
                            return state_1.value;
                    }
                    location.top += value;
                }
            },
            south: {
                R: "west", L: "east", op: function (value) {
                    var _loop_2 = function (x) {
                        if (locations.some(function (l) { return l.top === x && l.left === location.left; })) {
                            console.log(Math.abs(x) + Math.abs(location.left));
                            found = true;
                            return { value: void 0 };
                        }
                        locations.push({ top: x, left: location.left });
                    };
                    for (var x = location.top - 1; x >= location.top - value; x -= 1) {
                        var state_2 = _loop_2(x);
                        if (typeof state_2 === "object")
                            return state_2.value;
                    }
                    location.top -= value;
                }
            },
            west: {
                R: "north", L: "south", op: function (value) {
                    var _loop_3 = function (x) {
                        if (locations.some(function (l) { return l.top === location.top && l.left === x; })) {
                            console.log(Math.abs(x) + Math.abs(location.top));
                            found = true;
                            return { value: void 0 };
                        }
                        locations.push({ top: location.top, left: x });
                    };
                    for (var x = location.left + 1; x <= location.left + value; x += 1) {
                        var state_3 = _loop_3(x);
                        if (typeof state_3 === "object")
                            return state_3.value;
                    }
                    location.left += value;
                }
            },
            east: {
                R: "south", L: "north", op: function (value) {
                    var _loop_4 = function (x) {
                        if (locations.some(function (l) { return l.top === location.top && l.left === x; })) {
                            console.log(Math.abs(x) + Math.abs(location.top));
                            found = true;
                            return { value: void 0 };
                        }
                        locations.push({ top: location.top, left: x });
                    };
                    for (var x = location.left - 1; x >= location.left - value; x -= 1) {
                        var state_4 = _loop_4(x);
                        if (typeof state_4 === "object")
                            return state_4.value;
                    }
                    location.left -= value;
                }
            },
        };
        var location = {
            top: 0,
            left: 0,
            toString: function () { return "top: " + this.top + ", left: " + this.left; }
        };
        var locations = [{ top: 0, left: 0 }];
        var direction = "north";
        for (var index = 0; index < commands.length; index++) {
            var command = commands[index];
            direction = directions[direction][command.direction];
            console.log("Traveling " + direction + " for " + command.length + " units");
            directions[direction].op(command.length);
            if (found)
                return;
        }
        console.log(locations);
        //console.log(Math.abs(location.top) + Math.abs(location.left));
        return;
    });
}
//# sourceMappingURL=day-01.js.map