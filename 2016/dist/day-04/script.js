"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var aoc_helper_1 = require("../extra/aoc-helper");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var lines, regex, rooms, sum;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, aoc_helper_1.readInputLines()];
                case 1:
                    lines = _a.sent();
                    regex = /^([a-z-]*)\-(\d*)\[([a-z]*)\]$/;
                    rooms = lines.map(function (l) {
                        var match = l.match(regex);
                        return {
                            name: match[1],
                            sector: Number(match[2]),
                            checksum: match[3],
                            calcChecksum: getChecksum(match[1])
                        };
                    });
                    sum = processPartOne(rooms);
                    console.log("Part 1: Sum of sectors = " + sum);
                    processPartTwo(rooms);
                    return [2 /*return*/];
            }
        });
    });
}
function processPartOne(rooms) {
    var sum = rooms.filter(function (room) { return room.checksum === room.calcChecksum; }).reduce(function (acc, r) { return acc + r.sector; }, 0);
    return sum;
}
function processPartTwo(rooms) {
    rooms = rooms.filter(function (room) { return room.checksum === room.calcChecksum; });
    var names = rooms.map(function (room) {
        var chars = room.name.split("").map(function (c) {
            if (c === "-")
                return " ";
            return String.fromCharCode(((c.charCodeAt(0) - 97 + room.sector) % 26) + 97);
        });
        return {
            name: chars.join(""),
            sector: room.sector
        };
    });
    console.log("Part 2:");
    names.filter(function (name) { return name.name.indexOf("north") !== -1; }).forEach(function (n) { return console.log(n.name, n.sector); });
}
function getChecksum(name) {
    var freqs = getFrequency(name);
    freqs.sort(function (a, b) {
        var value = b.value - a.value;
        if (value !== 0)
            return value;
        return a.char.charCodeAt(0) - b.char.charCodeAt(0);
    });
    return freqs.slice(0, 5).map(function (f) { return f.char; }).join("");
}
function getFrequency(name) {
    var freq = {};
    for (var index = 0; index < name.length; index++) {
        var char = name[index];
        if (char === "-")
            continue;
        if (freq[char]) {
            freq[char] += 1;
        }
        else {
            freq[char] = 1;
        }
    }
    return Object.keys(freq).map(function (key) { return ({ char: key, value: freq[key] }); });
}
main();
//# sourceMappingURL=script.js.map