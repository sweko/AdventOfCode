import { readInputLines, readInput } from "../extra/aoc-helper";
import "../extra/array-helpers";
import { Hash, toArray } from "../extra/hash-helpers";
import { Puzzle } from "./model";


type Pod = "A" | "B" | "C" | "D" | "-";
type Input = [[Pod, Pod], [Pod, Pod], [Pod, Pod], [Pod, Pod]];
const prices = {
    "A": 1,
    "B": 10,
    "C": 100,
    "D": 1000,
}

const processInput = async (day: number) => {
    // // test example
    // return [ ["B", "A"], ["C", "D"], ["B", "C"], ["D", "A"] ] as Input;
    // real input
    return [ ["B", "C"], ["B", "A"], ["D", "A"], ["D", "C"] ] as Input;
};


const partOne = (input: Input, debug: boolean) => {
    type Room = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "a1" | "a2" | "b1" | "b2" | "c1" | "c2" | "d1" | "d2";
    type Burrow = {[key in Room]: Pod};

    const burrowPaths: {[key in Room]: {[key in Room]: Room[]}} = (() => {
        const result = {};
        for (let findex = 0; findex <= 10; findex++) {
            result[findex] = {};
            for (let tindex = 0; tindex <= 10; tindex++) {
                result[findex][tindex] = [];
                if (findex < tindex) {
                    for (let index = findex+1; index < tindex; index++) {
                        result[findex][tindex].push(index.toString());
                    }
                } else {
                    for (let index = findex-1; index > tindex; index--) {
                        result[findex][tindex].push(index.toString());
                    }
                }
            }
        }
        result[0]["a1"] = ["1", "2"];
        result[0]["a2"] = ["1", "2", "a1"];
        result[0]["b1"] = ["1", "2", "3", "4"];
        result[0]["b2"] = ["1", "2", "3", "4", "b1"];
        result[0]["c1"] = ["1", "2", "3", "4", "5", "6"];
        result[0]["c2"] = ["1", "2", "3", "4", "5", "6", "c1"];
        result[0]["d1"] = ["1", "2", "3", "4", "5", "6", "7", "8"];
        result[0]["d2"] = ["1", "2", "3", "4", "5", "6", "7", "8", "d1"];
    
        result[1]["a1"] = ["2"];
        result[1]["a2"] = ["2", "a1"];
        result[1]["b1"] = ["2", "3", "4"];
        result[1]["b2"] = ["2", "3", "4", "b1"];
        result[1]["c1"] = ["2", "3", "4", "5", "6"];
        result[1]["c2"] = ["2", "3", "4", "5", "6", "c1"];
        result[1]["d1"] = ["2", "3", "4", "5", "6", "7", "8"];
        result[1]["d2"] = ["2", "3", "4", "5", "6", "7", "8", "d1"];
    
        result[2]["a1"] = [];
        result[2]["a2"] = ["a1"];
        result[2]["b1"] = ["3", "4"];
        result[2]["b2"] = ["3", "4", "b1"];
        result[2]["c1"] = ["3", "4", "5", "6"];
        result[2]["c2"] = ["3", "4", "5", "6", "c1"];
        result[2]["d1"] = ["3", "4", "5", "6", "7", "8"];
        result[2]["d2"] = ["3", "4", "5", "6", "7", "8", "d1"];
    
        result[3]["a1"] = ["2"];
        result[3]["a2"] = ["2", "a1"];
        result[3]["b1"] = ["4"];
        result[3]["b2"] = ["4", "b1"];
        result[3]["c1"] = ["4", "5", "6"];
        result[3]["c2"] = ["4", "5", "6", "c1"];
        result[3]["d1"] = ["4", "5", "6", "7", "8"];
        result[3]["d2"] = ["4", "5", "6", "7", "8", "d1"];
    
        result[4]["a1"] = ["3", "2"];
        result[4]["a2"] = ["3", "2", "a1"];
        result[4]["b1"] = [];
        result[4]["b2"] = ["b1"];
        result[4]["c1"] = ["5", "6"];
        result[4]["c2"] = ["5", "6", "c1"];
        result[4]["d1"] = ["5", "6", "7", "8"];
        result[4]["d2"] = ["5", "6", "7", "8", "d1"];
    
        result[5]["a1"] = ["4", "3", "2"];
        result[5]["a2"] = ["4", "3", "2", "a1"];
        result[5]["b1"] = ["4"];
        result[5]["b2"] = ["4", "b1"];
        result[5]["c1"] = ["6"];
        result[5]["c2"] = ["6", "c1"];
        result[5]["d1"] = ["6", "7", "8"];
        result[5]["d2"] = ["6", "7", "8", "d1"];
    
        result[6]["a1"] = ["5", "4", "3", "2"];
        result[6]["a2"] = ["5", "4", "3", "2", "a1"];
        result[6]["b1"] = ["5", "4"];
        result[6]["b2"] = ["5", "4", "b1"];
        result[6]["c1"] = [];
        result[6]["c2"] = ["c1"];
        result[6]["d1"] = ["7", "8"];
        result[6]["d2"] = ["7", "8", "d1"];
    
        result[7]["a1"] = ["6", "5", "4", "3", "2"];
        result[7]["a2"] = ["6", "5", "4", "3", "2", "a1"];
        result[7]["b1"] = ["6", "5", "4"];
        result[7]["b2"] = ["6", "5", "4", "b1"];
        result[7]["c1"] = ["6"];
        result[7]["c2"] = ["6", "c1"];
        result[7]["d1"] = ["8"];
        result[7]["d2"] = ["8", "d1"];
    
        result[8]["a1"] = ["7", "6", "5", "4", "3", "2"];
        result[8]["a2"] = ["7", "6", "5", "4", "3", "2", "a1"];
        result[8]["b1"] = ["7", "6", "5", "4"];
        result[8]["b2"] = ["7", "6", "5", "4", "b1"];
        result[8]["c1"] = ["7", "6"];
        result[8]["c2"] = ["7", "6", "c1"];
        result[8]["d1"] = [];
        result[8]["d2"] = ["d1"];
    
        result[9]["a1"] = ["8", "7", "6", "5", "4", "3", "2"];
        result[9]["a2"] = ["8", "7", "6", "5", "4", "3", "2", "a1"];
        result[9]["b1"] = ["8", "7", "6", "5", "4"];
        result[9]["b2"] = ["8", "7", "6", "5", "4", "b1"];
        result[9]["c1"] = ["8", "7", "6"];
        result[9]["c2"] = ["8", "7", "6", "c1"];
        result[9]["d1"] = ["8"];
        result[9]["d2"] = ["8", "d1"];
    
        result[10]["a1"] = ["9", "8", "7", "6", "5", "4", "3", "2"];
        result[10]["a2"] = ["9", "8", "7", "6", "5", "4", "3", "2", "a1"];
        result[10]["b1"] = ["9", "8", "7", "6", "5", "4"];
        result[10]["b2"] = ["9", "8", "7", "6", "5", "4", "b1"];
        result[10]["c1"] = ["9", "8", "7", "6"];
        result[10]["c2"] = ["9", "8", "7", "6", "c1"];
        result[10]["d1"] = ["9", "8"];
        result[10]["d2"] = ["9", "8", "d1"];
    
        result["a1"] = {};
        result["a2"] = {};
        result["b1"] = {};
        result["b2"] = {};
        result["c1"] = {};
        result["c2"] = {};
        result["d1"] = {};
        result["d2"] = {};
        for (let index = 0; index <= 10; index++) {
            result["a1"][index] = result[index]["a1"].reverse();
            result["a2"][index] = result[index]["a2"].reverse();
            result["b1"][index] = result[index]["b1"].reverse();
            result["b2"][index] = result[index]["b2"].reverse();
            result["c1"][index] = result[index]["c1"].reverse();
            result["c2"][index] = result[index]["c2"].reverse();
            result["d1"][index] = result[index]["d1"].reverse();
            result["d2"][index] = result[index]["d2"].reverse();
        }
    
        result["a1"]["a1"] = [];
        result["a1"]["a2"] = [];
        result["a1"]["b1"] = ["2", "3", "4"];
        result["a1"]["b2"] = ["2", "3", "4", "b1"];
        result["a1"]["c1"] = ["2", "3", "4", "5", "6"];
        result["a1"]["c2"] = ["2", "3", "4", "5", "6", "c1"];
        result["a1"]["d1"] = ["2", "3", "4", "5", "6", "7", "8"];
        result["a1"]["d2"] = ["2", "3", "4", "5", "6", "7", "8", "d1"];
    
        result["a2"]["a1"] = [];
        result["a2"]["a2"] = [];
        result["a2"]["b1"] = ["a1", "2", "3", "4"];
        result["a2"]["b2"] = ["a1", "2", "3", "4", "b1"];
        result["a2"]["c1"] = ["a1", "2", "3", "4", "5", "6"];
        result["a2"]["c2"] = ["a1", "2", "3", "4", "5", "6", "c1"];
        result["a2"]["d1"] = ["a1", "2", "3", "4", "5", "6", "7", "8"];
        result["a2"]["d2"] = ["a1", "2", "3", "4", "5", "6", "7", "8", "d1"];
    
        result["b1"]["a1"] = ["4", "3", "2"];
        result["b1"]["a2"] = ["4", "3", "2", "a1"];
        result["b1"]["b1"] = [];
        result["b1"]["b2"] = [];
        result["b1"]["c1"] = ["4", "5", "6"];
        result["b1"]["c2"] = ["4", "5", "6", "c1"];
        result["b1"]["d1"] = ["4", "5", "6", "7", "8"];
        result["b1"]["d2"] = ["4", "5", "6", "7", "8", "d1"];
    
        result["b2"]["a1"] = ["b1", "4", "3", "2"];
        result["b2"]["a2"] = ["b1", "4", "3", "2", "a1"];
        result["b2"]["b1"] = [];
        result["b2"]["b2"] = [];
        result["b2"]["c1"] = ["b1", "4", "5", "6"];
        result["b2"]["c2"] = ["b1", "4", "5", "6", "c1"];
        result["b2"]["d1"] = ["b1", "4", "5", "6", "7", "8"];
        result["b2"]["d2"] = ["b1", "4", "5", "6", "7", "8", "d1"];
    
        result["c1"]["a1"] = ["6", "5", "4", "3", "2"];
        result["c1"]["a2"] = ["6", "5", "4", "3", "2", "a1"];
        result["c1"]["b1"] = ["6", "5", "4"];
        result["c1"]["b2"] = ["6", "5", "4", "b1"];
        result["c1"]["c1"] = [];
        result["c1"]["c2"] = [];
        result["c1"]["d1"] = ["6", "7", "8"];
        result["c1"]["d2"] = ["6", "7", "8", "d1"];
    
        result["c2"]["a1"] = ["c1", "6", "5", "4", "3", "2"];
        result["c2"]["a2"] = ["c1", "6", "5", "4", "3", "2", "a1"];
        result["c2"]["b1"] = ["c1", "6", "5", "4"];
        result["c2"]["b2"] = ["c1", "6", "5", "4", "b1"];
        result["c2"]["c1"] = [];
        result["c2"]["c2"] = [];
        result["c2"]["d1"] = ["c1", "6", "7", "8"];
        result["c2"]["d2"] = ["c1", "6", "7", "8", "d1"];
    
        result["d1"]["a1"] = ["8", "7", "6", "5", "4", "3", "2"];
        result["d1"]["a2"] = ["8", "7", "6", "5", "4", "3", "2", "a1"];
        result["d1"]["b1"] = ["8", "7", "6", "5", "4"];
        result["d1"]["b2"] = ["8", "7", "6", "5", "4", "b1"];
        result["d1"]["c1"] = ["8", "7", "6"];
        result["d1"]["c2"] = ["8", "7", "6", "c1"];
        result["d1"]["d1"] = [];
        result["d1"]["d2"] = [];
    
        result["d2"]["a1"] = ["d1", "8", "7", "6", "5", "4", "3", "2"];
        result["d2"]["a2"] = ["d1", "8", "7", "6", "5", "4", "3", "2", "a1"];
        result["d2"]["b1"] = ["d1", "8", "7", "6", "5", "4"];
        result["d2"]["b2"] = ["d1", "8", "7", "6", "5", "4", "b1"];
        result["d2"]["c1"] = ["d1", "8", "7", "6"];
        result["d2"]["c2"] = ["d1", "8", "7", "6", "c1"];
        result["d2"]["d1"] = [];
        result["d2"]["d2"] = [];
    
        return result as  {[key in Room]: {[key in Room]: Room[]}};
    })();
    
    const canMove = (from: Room, to: Room, burrow: Burrow) => {
        if (from === to) {
            return false;
        }
        if (burrow[from] === "-") {
            return false;
        };
        if (burrow[to] !== "-") {
            return false;
        };
        const pod = burrow[from];
    
        const siderooms = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2', 'd1', 'd2'];
    
        // are we moving from a side room?
        if (siderooms.includes(from)) {
            const sideRoom = from[0];
            const sideIndex = from[1];
            if (sideRoom === pod.toLocaleLowerCase()) {
                if (sideIndex === "2") {
                    return false;
                }
                if (burrow[`${sideRoom}2`] === pod) {
                    return false;
                }
            }
        }
    
        // are we moving to a side room?
        if (siderooms.includes(to)) {
            // is it the correct side room?
            if (!to.startsWith(pod.toLocaleLowerCase())) {
                return false;
            }
            // is there a pod in the room?
            const top = to[0]+"1";
            const bottom = to[0]+"2";
            if (to === top) {
                // is there another pod in the room?
                if ((burrow[bottom] !== "-")  && (burrow[bottom] !== pod)) {
                        return false;
                }
            }
        } else {
            // we are moving to the coridor
            if (!isNaN(parseInt(from))) {
                // moving from coridor to coridor is a no-no
                return false;
            }
            const entrances = ["2", "4", "6", "8"];
            if (entrances.includes(to)) {
                return false;
            }
        }
    
        if (burrowPaths[from][to].some(r => burrow[r] !== "-") ) {
            // colision with other object
            return false;
        }
    
        return true;
    }
    
    const copyBurrow = (burrow: Burrow): Burrow => {
        const result = {};
        for (const key in burrow) {
            result[key] = burrow[key];
        }
        return result as Burrow;
    }
    
    const executeMove = (from: Room, to: Room, burrow: Burrow) => {
        // assume this is a valid move
        const result = copyBurrow(burrow);
        const pod = result[from];
        const type = pod[0];
        const price = prices[type] * (burrowPaths[from][to].length + 1);
        result[from] = "-";
        result[to] = pod;
        return {price, burrow: result};
    }
    
    const isComplete = (burrow: Burrow) => {
        const target: Hash<Pod> = {
            "0": "-",
            "1": "-",
            "2": "-",
            "3": "-",
            "4": "-",
            "5": "-",
            "6": "-",
            "7": "-",
            "8": "-",
            "9": "-",
            "10": "-",
            "a1": "A",
            "a2": "A",
            "b1": "B",
            "b2": "B",
            "c1": "C",
            "c2": "C",
            "d1": "D",
            "d2": "D",
        };
    
        for (const key in burrow) {
            if (burrow[key] !== target[key]) {
                return false;
            }
        }
        return true;
    }
    
    const getNextMoves = (burrow: Burrow): { from: Room, to: Room}[] => {
        const rooms: Room[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", 
            "a1", "a2", "b1", "b2", "c1", "c2", "d1", "d2"];
    
        const result: { from: Room, to: Room}[] = [];
        for (const key in burrow) {
            const from = key as Room;
            const pod: Pod = burrow[key];
            if (pod === "-") {
                continue;
            }
            for (const to of rooms) {
                if (canMove(from, to, burrow)) {
                    result.push({from, to});
                }
            }
        }
        return result;
    }
    
    const toKey = (burrow: Burrow) => {
        let result = [];
        for (const key in burrow) {
            result.push(`${key}:${burrow[key]}`);
        }
        return result.join("|");
    }
    
    const toMoveKey = (move: { from: Room, to: Room}) => `${move.from}->${move.to}`;
    
    const cache = {};
    
    const getMinPrice = (burrow: Burrow, moves: string[] = []) :number => {
        const key = toKey(burrow);
        if (cache[key]) {
            return cache[key];
        }
        const nexts = getNextMoves(burrow);
        let minPrice = Number.POSITIVE_INFINITY;
        for (const move of nexts) {
            if (moves.includes(toMoveKey(move))) {
                continue;
            }
            const {price, burrow: nextBurrow} = executeMove(move.from, move.to, burrow);
            if (isComplete(nextBurrow)) {
                // console.log(`Managed to complete at ${price}`);
                cache[key] = price;
                return price;
            }
            else {
                const totalPrice = price + getMinPrice(nextBurrow, moves.concat(toMoveKey(move)));
                if (totalPrice < minPrice) {
                    minPrice = totalPrice;
                }
            }
        }
        cache[key] = minPrice;
        return minPrice;
    }

    if (debug) {
        console.log("-------Debug-----");
    }

    const occupancy: Burrow = {
        "0": "-",
        "1": "-",
        "2": "-",
        "3": "-",
        "4": "-",
        "5": "-",
        "6": "-",
        "7": "-",
        "8": "-",
        "9": "-",
        "10": "-",
        "a1": input[0][0],
        "a2": input[0][1],
        "b1": input[1][0],
        "b2": input[1][1],
        "c1": input[2][0],
        "c2": input[2][1],
        "d1": input[3][0],
        "d2": input[3][1],
    };

    const price = getMinPrice(occupancy);
    return price;
};

const partTwo = (input: Input, debug: boolean) => {
    const a1 = "a1";
    const a2 = "a2";
    const a3 = "a3";
    const a4 = "a4";
    const b1 = "b1";
    const b2 = "b2";
    const b3 = "b3";
    const b4 = "b4";
    const c1 = "c1";
    const c2 = "c2";
    const c3 = "c3";
    const c4 = "c4";
    const d1 = "d1";
    const d2 = "d2";
    const d3 = "d3";
    const d4 = "d4";

    type Room = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" 
        | "a1" | "a2" | "a3" | "a4"
        | "b1" | "b2" | "b3" | "b4"
        | "c1" | "c2" | "c3" | "c4"
        | "d1" | "d2" | "d3" | "d4";
    type Burrow = {[key in Room]: Pod};

    type RoomConnections = {[key in Room]: Room[]};

    const burrowPaths: {[key in Room]: {[key in Room]: Room[]}} = (() => {

        const burrowNodes: {[key in Room]: Room[]} = {
            "0": ["1"],
            "1": ["0", "2"],
            "2": ["1", "3", a1],
            "3": ["2", "4"],
            "4": ["3", "5", b1],
            "5": ["4", "6"],
            "6": ["5", "7", c1],
            "7": ["6", "8"],
            "8": ["7", "9", d1],
            "9": ["8", "10"],
            "10": ["9"],
            "a1": ["2", "a2"],
            "a2": ["a1", "a3"],
            "a3": ["a2", "a4"],
            "a4": ["a3"],
            "b1": ["4", "b2"],
            "b2": ["b1", "b3"],
            "b3": ["b2", "b4"],
            "b4": ["b3"],
            "c1": ["6", "c2"],
            "c2": ["c1", "c3"],
            "c3": ["c2", "c4"],
            "c4": ["c3"],
            "d1": ["8", "d2"],
            "d2": ["d1", "d3"],
            "d3": ["d2", "d4"],
            "d4": ["d3"],
        };

        const allPaths = {} as {[key in Room]: {[key in Room]: Room[]}};

        const getPath = (from: Room, to: Room, connections: RoomConnections, currentPath: Room[] = []): Room[] => {
            if (to === from) {
                const result = [];
                allPaths[from] = {...allPaths[from], [to]: result};
                return result;
            }
            if (burrowNodes[from].includes(to)) {
                const result = [];
                allPaths[from] = {...allPaths[from], [to]: result};
                return result;
            }
            if (allPaths[from] && allPaths[from][to]) {
                return allPaths[from][to];
            }
            for (const connection of burrowNodes[from]) {
                if (currentPath.includes(connection)) {
                    continue;
                }
                const path = getPath(connection, to, connections, [...currentPath, connection]);
                if (!path) {
                    continue;
                }
                const result = [connection, ...path];
                allPaths[from] = {...allPaths[from], [to]: result};
                return result;
            }
            return null;
        }

        const rooms: Room[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", 
                "a1", "a2", a3, a4, "b1", "b2", b3, b4, "c1", "c2", c3, c4, "d1", "d2", d3, d4];
        for (const from of rooms) {
            for (const to of rooms) {
                getPath(from, to, burrowNodes);
            }
        }

        return allPaths;
    })();

    const canMove = (from: Room, to: Room, burrow: Burrow) => {
        if (from === to) {
            return false;
        }
        if (burrow[from] === "-") {
            return false;
        };
        if (burrow[to] !== "-") {
            return false;
        };
        const pod = burrow[from];
    
        const siderooms = [
            a1, a2, a3, a4, 
            b1, b2, b3, b4, 
            c1, c2, c3, c4, 
            d1, d2, d3, d4
        ];

        // are we moving from a side room?
        if (siderooms.includes(from)) {
            const sideRoom = from[0];
            const sideIndex = from[1];
            if (sideRoom === pod.toLocaleLowerCase()) {
                // 4 is final by definition
                if (sideIndex === "4") {
                    return false;
                }
                // 3 is final if 4 is the same
                if ((sideIndex === "3") && (burrow[`${sideRoom}4`] === pod)) {
                    return false;
                }
                // 2 is final if 3 and 4 is the same
                if ((sideIndex === "2") && (burrow[`${sideRoom}3`] === pod) && (burrow[`${sideRoom}4`] === pod)) {
                    return false;
                }
                // 1 is final if 2, 3 and 4 is the same
                if ((sideIndex === "1") && (burrow[`${sideRoom}2`] === pod) && (burrow[`${sideRoom}3`] === pod) && (burrow[`${sideRoom}4`] === pod)) {
                    return false;
                }
            }
        }

        // are we moving to a side room?
        if (siderooms.includes(to)) {
            // is it the correct side room?
            if (!to.startsWith(pod.toLocaleLowerCase())) {
                return false;
            }
            // is there a pod in the room?
            const one = to[0]+"1";
            const two = to[0]+"2";
            const three = to[0]+"3";
            const four = to[0]+"4";

            if (to == three) {
                if (burrow[four] !== pod){
                    return false;
                }
            }
            if (to == two) {
                if (burrow[four] !== pod || burrow[three] !== pod){
                    return false;
                }
            }
            if (to == one) {
                if (burrow[four] !== pod || burrow[three] !== pod || burrow[two] !== pod){
                    return false;
                }
            }
        } else {
            // we are moving to the coridor
            if (!isNaN(parseInt(from))) {
                // moving from coridor to coridor is a no-no
                return false;
            }
            const entrances = ["2", "4", "6", "8"];
            if (entrances.includes(to)) {
                return false;
            }
        }

        if (burrowPaths[from][to].some(r => burrow[r] !== "-") ) {
            // colision with other object
            return false;
        }

        return true;
    }

    const copyBurrow = (burrow: Burrow): Burrow => {
        const result = {};
        for (const key in burrow) {
            result[key] = burrow[key];
        }
        return result as Burrow;
    }

    const executeMove = (from: Room, to: Room, burrow: Burrow) => {
        // assume this is a valid move
        const result = copyBurrow(burrow);
        const pod = result[from];
        const type = pod[0];
        const price = prices[type] * (burrowPaths[from][to].length + 1);
        result[from] = "-";
        result[to] = pod;
        return {price, burrow: result};
    }

    const isComplete = (burrow: Burrow) => {
        const target: Hash<Pod> = {
            "0": "-",
            "1": "-",
            "2": "-",
            "3": "-",
            "4": "-",
            "5": "-",
            "6": "-",
            "7": "-",
            "8": "-",
            "9": "-",
            "10": "-",
            "a1": "A",
            "a2": "A",
            "a3": "A",
            "a4": "A",
            "b1": "B",
            "b2": "B",
            "b3": "B",
            "b4": "B",
            "c1": "C",
            "c2": "C",
            "c3": "C",
            "c4": "C",
            "d1": "D",
            "d2": "D",
            "d3": "D",
            "d4": "D",
        };

        for (const key in burrow) {
            if (burrow[key] !== target[key]) {
                return false;
            }
        }
        return true;
    }

    const getNextMoves = (burrow: Burrow): { from: Room, to: Room}[] => {
        const rooms: Room[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", 
            'a1', 'a2', a3, a4, 'b1', 'b2', b3, b4, 'c1', 'c2', c3, c4, 'd1', 'd2', d3, d4];

        const result: { from: Room, to: Room}[] = [];
        for (const key in burrow) {
            const from = key as Room;
            const pod: Pod = burrow[key];
            if (pod === "-") {
                continue;
            }
            for (const to of rooms) {
                if (canMove(from, to, burrow)) {
                    result.push({from, to});
                }
            }
        }
        return result;
    }

    const toKey = (burrow: Burrow) => {
        let result = [];
        for (const key in burrow) {
            result.push(`${key}:${burrow[key]}`);
        }
        return result.join("|");
    }

    const toMoveKey = (move: { from: Room, to: Room}) => `${move.from}->${move.to}`;

    const cache = {};

    const getMinPrice = (burrow: Burrow, moves: string[] = []) :number => {
        const key = toKey(burrow);
        if (cache[key]) {
            return cache[key];
        }
        const nexts = getNextMoves(burrow);
        let minPrice = Number.POSITIVE_INFINITY;
        for (const move of nexts) {
            if (moves.includes(toMoveKey(move))) {
                continue;
            }
            const {price, burrow: nextBurrow} = executeMove(move.from, move.to, burrow);
            if (isComplete(nextBurrow)) {
                // console.log(`Managed to complete at ${price}`);
                cache[key] = price;
                return price;
            }
            else {
                const totalPrice = price + getMinPrice(nextBurrow, moves.concat(toMoveKey(move)));
                if (totalPrice < minPrice) {
                    minPrice = totalPrice;
                }
            }
        }
        cache[key] = minPrice;
        return minPrice;
    }

    if (debug) {
        console.log("-------Debug-----");
    }

    const occupancy: Burrow = {
        "0": "-",
        "1": "-",
        "2": "-",
        "3": "-",
        "4": "-",
        "5": "-",
        "6": "-",
        "7": "-",
        "8": "-",
        "9": "-",
        "10": "-",
        "a1": input[0][0],
        "a2": "D",
        "a3": "D",
        "a4": input[0][1],
        "b1": input[1][0],
        "b2": "C",
        "b3": "B",
        "b4": input[1][1],
        "c1": input[2][0],
        "c2": "B",
        "c3": "A",
        "c4": input[2][1],
        "d1": input[3][0],
        "d2": "A",
        "d3": "C",
        "d4": input[3][1],
    };

    const price = getMinPrice(occupancy);
    return price;

    return 0;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};


const showInput = (input: Input) => {
    console.log(input);
};

const test = (_: Input) => {
    console.log("----Test-----");
};

export const solutionTwentyThree: Puzzle<Input, number> = {
    day: 23,
    input: processInput,
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}
