import { readInput, readInputLines } from "../extra/aoc-helper";

async function main() {
    let lines = await readInputLines();

    // lines = [
    //     "aba[bab]xyz",
    //     "xyx[xyx]xyx",
    //     "aaa[kek]eke",
    //     "zazbz[bzb]cdb",
    // ]

    let countTLS = processPartOne(lines);
    console.log(`Part 1: ABBA available on ${countTLS} addresses`);

    let countSSL = processPartTwo(lines);
    console.log(`Part 2: ABA available on ${countSSL} addresses`);
}

function processPartOne(lines: string[]) {
    lines = lines.filter(line => {
        const bracketRegex = /\[([a-z]+)\]/g;
        let match = bracketRegex.exec(line);
        while (match) {
            const bracketText = match[1];
            if (checkAbba(bracketText)) {
                return false;
            }
            match = bracketRegex.exec(line);
        }
        return true;
    }).filter(line => checkAbba(line));

    return lines.length;
}

function checkAbba(input: string) {
    const abbaRegex = /([a-z])([a-z])\2\1/g;

    let match = abbaRegex.exec(input);
    while (match) {
        if (match[1] !== match[2]) return true;
        match = abbaRegex.exec(input);
    }
    return false;
}

function processPartTwo(lines: string[]) {
    const lineParts = lines
        .map(line => {
            const lineParts: { supernet: string[], hypernet: string[] } = { supernet: [], hypernet: [] };
            line.split(/\[|\]/).forEach((item, index) => {
                if (index % 2 == 0) {
                    lineParts.supernet.push(item);
                } else {
                    lineParts.hypernet.push(item);
                }
            })
            return lineParts;
        }).map(linepart => {
            const supernet3: string[] = [];
            const hypernet3: string[] = [];
            linepart.supernet.forEach(sn => {
                if (sn.length < 3)
                    return;
                for (let index = 0; index < sn.length - 2; index++) {
                    if ((sn[index] === sn[index + 2]) && (sn[index] !== sn[index + 1])) {
                        supernet3.push(sn.substring(index, index + 3));
                    }
                }
            });
            linepart.hypernet.forEach(hn => {
                if (hn.length < 3)
                    return;
                for (let index = 0; index < hn.length - 2; index++) {
                    if ((hn[index] === hn[index + 2]) && (hn[index] !== hn[index + 1])) {
                        hypernet3.push(hn.substring(index, index + 3));
                    }
                }
            });
            return {
                supernet: supernet3,
                hypernet: hypernet3
            };
        }).filter(lp => {
            if (lp.supernet.length === 0) return false;
            for (let index = 0; index < lp.supernet.length; index++) {
                const sn = lp.supernet[index];
                const candidate = sn[1] + sn[0] + sn[1];
                if (lp.hypernet.includes(candidate))
                    return true;
            }
            return false;
        });

    return lineParts.length;
}

main();