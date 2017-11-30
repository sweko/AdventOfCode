"use strict";
var fs = require("fs");
//part 1
fs.readFile("input.txt", "utf8", function (err, data) {
    var triangles = data.split(/\r?\n/).map(function (l) { return l.split(" ").filter(function (e) { return e !== ""; }).map(function (e) { return Number(e); }); });
    console.log(triangles);
    return;
    var count = 0;
    for (var index = 0; index < triangles.length; index++) {
        var t = triangles[index];
        if ((t[0] < t[1] + t[2]) && (t[1] < t[0] + t[2]) && (t[2] < t[1] + t[0]))
            count++;
    }
    console.log(count);
});
//part 2;
fs.readFile("input.txt", "utf8", function (err, data) {
    var triangles = data.split(/\r?\n/).map(function (l) { return l.split(" ").filter(function (e) { return e !== ""; }).map(function (e) { return Number(e); }); });
    var count = 0;
    for (var index = 0; index < triangles.length; index += 3) {
        var t1 = triangles[index];
        var t2 = triangles[index + 1];
        var t3 = triangles[index + 2];
        if ((t1[0] < t2[0] + t3[0]) && (t2[0] < t1[0] + t3[0]) && (t3[0] < t1[0] + t2[0]))
            count++;
        if ((t1[1] < t2[1] + t3[1]) && (t2[1] < t1[1] + t3[1]) && (t3[1] < t1[1] + t2[1]))
            count++;
        if ((t1[2] < t2[2] + t3[2]) && (t2[2] < t1[2] + t3[2]) && (t3[2] < t1[2] + t2[2]))
            count++;
    }
    console.log(count);
});
//# sourceMappingURL=day-03.js.map