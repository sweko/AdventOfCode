"use strict";
var fs = require("fs");
//part 1
fs.readFile("input.txt", "utf8", (err, data) => {
    let triangles = data.split(/\r?\n/).map(l => l.split(" ").filter(e => e !== "").map(e => Number(e)));
    console.log(triangles)
    return;
    let count = 0;
    for (let index = 0; index < triangles.length; index++) {
        let t = triangles[index];
        if ((t[0] < t[1] + t[2]) && (t[1] < t[0] + t[2]) && (t[2] < t[1] + t[0]))
            count++;
    }
    console.log(count);
});

//part 2;
fs.readFile("input.txt", "utf8", (err, data) => {
    let triangles = data.split(/\r?\n/).map(l => l.split(" ").filter(e => e !== "").map(e => Number(e)));
    let count = 0;
    for (let index = 0; index < triangles.length; index += 3) {
        let t1 = triangles[index];
        let t2 = triangles[index + 1];
        let t3 = triangles[index + 2];

        if ((t1[0] < t2[0] + t3[0]) && (t2[0] < t1[0] + t3[0]) && (t3[0] < t1[0] + t2[0]))
            count++;
        if ((t1[1] < t2[1] + t3[1]) && (t2[1] < t1[1] + t3[1]) && (t3[1] < t1[1] + t2[1]))
            count++;
        if ((t1[2] < t2[2] + t3[2]) && (t2[2] < t1[2] + t3[2]) && (t3[2] < t1[2] + t2[2]))
            count++;
    }
    console.log(count);
});
