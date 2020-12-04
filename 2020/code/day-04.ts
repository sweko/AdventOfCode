import { readInputLines, readInput, debugLog } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Puzzle } from "./model";

interface Passport {
    byr?: string;
    iyr?: string;
    eyr?: string;
    hgt?: string;
    hcl?: string;
    ecl?: string;
    pid?: string;
};

// cid?: string;

function validatePassport(pass: Passport) {
    const fields = ['byr', 'iyr','eyr','hgt','hcl','ecl','pid'];
    for (const field of fields) {
        if (!pass[field]) {
            return false;
        }
    }
    return true;
}


const processInput = async (day: number) => {
    const input = await readInputLines(day);
    const result: Passport[] = [];
    let current: Passport = {};
    for (const line of input) {
        if (line === "") {
            result.push(current);
            current = {};
            continue;
        }
        const items = line.split(" ").map(data => data.split(":"))
        for (const item of items) {
            current[item[0]] = item[1];
        }
    }
    result.push(current);

    return result;

};

const partOne = (input: Passport[], debug: boolean) => {
    return input.filter(validatePassport).length;
};

const passportCheck: {[key:string]: (pass:Passport)=> boolean} = {
    byr: (pass) => {
        const value = Number(pass.byr);
        return (value >= 1920) && (value <= 2002);
    },
    iyr: (pass) => {
        const value = Number(pass.iyr);
        return (value >= 2010) && (value <= 2020);
    },
    eyr: (pass) => {
        const value = Number(pass.eyr);
        return (value >= 2020) && (value <= 2030);
    },
    hgt: (pass) => {
        const regex = /^(\d+)(in|cm)$/;
        const match = pass.hgt.match(regex);
        if (!match) {
            return false;
        }
        const height = Number(match[1]);
        if (match[2] === "in") {
            return (height >= 59) && (height <= 76);
        }
        return (height >= 150) && (height <= 193);
    },
    hcl: (pass) => {
        const regex = /^#[0-9a-f]{6}$/;
        return regex.test(pass.hcl);
    },
    ecl: (pass) => {
        const valid = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
        return valid.includes(pass.ecl);
    },
    pid: (pass) => {
        const regex = /^[0-9]{9}$/;
        return regex.test(pass.pid);
    },
};

function validatePassportTwo(pass: Passport) {
    const fields = ['byr', 'iyr','eyr','hgt','hcl','ecl','pid'];
    for (const field of fields) {
        if (!pass[field]) {
            return false;
        }
        if (!passportCheck[field](pass)) {
            return false;
        }
    }
    return true;
}

const partTwo = (input: Passport[], debug: boolean) => {
    return input.filter(validatePassportTwo).length;
};

const result = (_: any, result: number) => {
    return `Total number of valid passports is ${result}`;
};

const showInput = (input: Passport[]) => {
    console.log(input);
};

const test = (passports: Passport[]) => {
    passports.slice(0, 10).map(pass => {
        console.log(pass.hgt);
        console.log(passportCheck.hgt(pass));
    });
};

export const solutionFour: Puzzle<Passport[], number> = {
    day: 4,
    input: processInput,
    partOne,
    partTwo,
    resultOne: result,
    resultTwo: result,
    showInput,
    test,
}


