import * as md5 from "md5";


async function main() {
    const input = "ugkcyxxp";
    // const input = "abc"
    
    // const result = processPartOne(input);
    // console.log(`Part1: ${result}`);

    const result = processPartTwo(input, true);
    console.log(`Part2: ${result}`);
}

function processPartOne(key: string, debug = false){
    let index = 0;
    let count = 0;
    let result = [];
    while (true) {
        if (debug && index % 123497 === 0)
            console.log(index);

        const source = key + index;
        const hash:string = md5(source);
        if (hash.startsWith("00000")) {
            count++;
            if (debug) console.log(hash);
            result.push(hash[5]);
            if (count == 8) break;
        }
        index++;
    }
    return result.join("");
}

function processPartTwo(key: string, debug = false){
    let index = 0;
    let count = 0;
    let result = "________";
    while (true) {
        if (debug && index % 123497 === 0)
            console.log(index);

        const source = key + index;
        const hash:string = md5(source);
        if (hash.startsWith("00000")) {
            count++;
            const rindex = parseInt(hash[5], 16);
            if (result[rindex] === "_") {
                result = result.slice(0, rindex) + hash[6] + result.slice(rindex+1);
            }
            
            if (debug) { 
                console.log(hash);
                console.log(result);
            }

            if (result.indexOf("_")===-1) break;
        }
        index++;
    }
    return result;
}

main();