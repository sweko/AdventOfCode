"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var FileSystem = /** @class */ (function () {
    function FileSystem() {
    }
    FileSystem.prototype.readDirectory = function (name) {
        var promise = new Promise(function (resolve, reject) {
            fs.readdir(name, function (err, files) {
                if (err) {
                    reject(err);
                }
                resolve(files);
            });
        });
        return promise;
    };
    FileSystem.prototype.readTextFile = function (name) {
        var promise = new Promise(function (resolve, reject) {
            fs.readFile(name, { encoding: 'utf8' }, function (err, data) {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
        return promise;
    };
    FileSystem.prototype.writeTextFile = function (name, data) {
        var promise = new Promise(function (resolve, reject) {
            fs.writeFile(name, data, function (err) {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
        return promise;
    };
    return FileSystem;
}());
exports.FileSystem = FileSystem;
//# sourceMappingURL=file-system.js.map