import { access } from "fs";

interface Floor {
    microchips: boolean[];
    generators: boolean[];
}

interface Floors {
    elevator: number;
    floors: Floor[];
    state: string;
    generation: number;
}

interface Move {
    goingUp: boolean;
    firstIndex: number; // 1x - generator, 2x - microchip
    secondIndex: number; // 1x - generator, 2x - microchip
}


function copyFloors(floors: Floors): Floors {
    return {
        elevator: floors.elevator,
        floors: floors.floors.map(f => ({
            microchips: f.microchips.slice(),
            generators: f.generators.slice()
        })),
        generation: floors.generation,
        state: floors.state
    };
}

let previousStates = {};

function main() {

    // The first floor contains a strontium generator, a strontium-compatible microchip, a plutonium generator, and a plutonium-compatible microchip.
    // The second floor contains a thulium generator, a ruthenium generator, a ruthenium-compatible microchip, a curium generator, and a curium-compatible microchip.
    // The third floor contains a thulium-compatible microchip.
    // The fourth floor contains nothing relevant.

    // strontium, plutonium, thulium, ruthenium, curium
    const floors: Floors = {
        elevator: 0,
        floors: [
            {
                microchips: [true, true, false, false, false],
                generators: [true, true, false, false, false]
            },
            {
                microchips: [false, false, false, true, true],
                generators: [false, false, true, true, true]
            },
            {
                microchips: [false, false, true, false, false],
                generators: [false, false, false, false, false]
            },
            {
                microchips: [false, false, false, false, false],
                generators: [false, false, false, false, false]
            }
        ],
        state: "",
        generation: 0
    };

    floors.state = getStateString(floors);
    previousStates[floors.state] = -1;
    console.log(floors);

    let minMoves = processPartOne(floors);
    console.log(`Part 1: minimal number of moves is ${minMoves}`);

    // elerium, dilithium
    floors.floors[0].generators.push(true, true);
    floors.floors[0].microchips.push(true, true);

    floors.floors[1].generators.push(false, false);
    floors.floors[1].microchips.push(false, false);

    floors.floors[2].generators.push(false, false);
    floors.floors[2].microchips.push(false, false);

    floors.floors[3].generators.push(false, false);
    floors.floors[3].microchips.push(false, false);

    previousStates = {};
    floors.state = getStateString(floors);
    previousStates[floors.state] = -1;
    minMoves = processPartOne(floors);
    console.log(`Part 2: minimal number of moves is ${minMoves}`);
}

function getStateString(floors: Floors) {
    let state = "" + floors.elevator;
    for (let i = 0; i < floors.floors[0].generators.length; i++) {
        for (let j = 0; j < floors.floors.length; j++) {
            if (floors.floors[j].generators[i]) state += j;
        }
        for (let j = 0; j < floors.floors.length; j++) {
            if (floors.floors[j].microchips[i]) state += j;
        }
    }
    return state;
}

function getEndState(floors: Floors){
    let state = "3";
    for (let i = 0; i < floors.floors[0].generators.length; i++) {
        state += "33";
    }
    return state;
}

function generateMoves(floors: Floors): Floors[] {
    const currentFloor = floors.floors[floors.elevator];
    const items = [];
    const combinations = [];
    for (let index = 0; index < currentFloor.microchips.length; index++) {
        if (currentFloor.generators[index]) {
            items.push(10 + index);
        }
        if (currentFloor.microchips[index]) {
            items.push(20 + index);
        }
    }
    for (let i = 0; i < items.length; i++) {
        combinations.push([items[i]]);
        for (let j = i + 1; j < items.length; j++) {
            combinations.push([items[i], items[j]]);
        }
    }

    const moves: Move[] = [];
    for (let index = 0; index < combinations.length; index++) {
        const element = combinations[index];
        if (floors.elevator !== 0) {
            moves.push({
                goingUp: false,
                firstIndex: element[0],
                secondIndex: element[1]
            });
        }
        if (floors.elevator !== floors.floors.length - 1) {
            moves.push({
                goingUp: true,
                firstIndex: element[0],
                secondIndex: element[1]
            });
        }
    }

    const newFloors = moves.map(m => applyMove(floors, m)).filter(f => !!f);
    // console.log(JSON.stringify(newFloors, null, 2));
    return newFloors;
}

function applyMove(floors: Floors, move: Move): Floors {
    const result: Floors = copyFloors(floors);
    result.elevator = floors.elevator + (move.goingUp ? 1 : -1);

    const oldFloor = result.floors[floors.elevator];
    const newFloor = result.floors[result.elevator];

    if (move.firstIndex < 20) {
        const genIndex = move.firstIndex - 10;
        oldFloor.generators[genIndex] = false;
        newFloor.generators[genIndex] = true;
    } else {
        const chipIndex = move.firstIndex - 20;
        oldFloor.microchips[chipIndex] = false;
        newFloor.microchips[chipIndex] = true;
    }

    if (move.secondIndex) {
        if (move.secondIndex < 20) {
            const genIndex = move.secondIndex - 10;
            oldFloor.generators[genIndex] = false;
            newFloor.generators[genIndex] = true;
        } else {
            const chipIndex = move.secondIndex - 20;
            oldFloor.microchips[chipIndex] = false;
            newFloor.microchips[chipIndex] = true;
        }
    }

    result.state = getStateString(result);
    result.generation = floors.generation + 1;

    if (!verifyState(result))
        return null;

    previousStates[result.state] = result.generation;

    return result;
}

function verifyState(floors: Floors) {
    if (previousStates[floors.state]){
        return false;
    }

    return floors.floors.every(f => {
        const irradiated = f.generators.some(g => g);
        if (!irradiated) return true;
        for (let index = 0; index < f.microchips.length; index++) {
            const microchip = f.microchips[index];
            const generator = f.generators[index];
            if (microchip && !generator)
                return false;
        }
        return true;
    });
}

function processPartOne(floors: Floors) {
    let activeMoves = [];
    let endState = getEndState(floors);
    activeMoves = generateMoves(floors);
    let generation = 1;
    while (true) {
        console.log(generation, activeMoves.length);
        if (activeMoves.some(f => f.state === endState)) {
            return generation;
        };
        const newMoves = [];
        activeMoves.map(f => generateMoves(f)).forEach(moves => moves.forEach(move => newMoves.push(move)));
        activeMoves = newMoves;
        generation++;
    }
}

main();