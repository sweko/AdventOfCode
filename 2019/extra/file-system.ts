import * as fs from 'fs';

export class FileSystem {
    public readDirectory(name: string): Promise<string[]> {
        const promise = new Promise<string[]>((resolve, reject) => {
            fs.readdir(name, (err, files) => {
                if (err) {
                    reject(err);
                }
                resolve(files);
            });
        });
        return promise;
    }

    public readTextFile(name: string): Promise<string> {
        const promise = new Promise<string>((resolve, reject) => {
            fs.readFile(name, { encoding: 'utf8' }, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
           });
        });
        return promise;
    }

    public writeTextFile(name: string, data: string): Promise<void> {
        const promise = new Promise<void>((resolve, reject) => {
            fs.writeFile(name, data, err => {
                if (err) {
                    reject(err);
                }
                resolve();
           });
        });
        return promise;
    }

}
