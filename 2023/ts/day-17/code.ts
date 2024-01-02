// Solution for day 17 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";
import { printMatrix } from "../utils/matrix";

interface Point {
    x: number;
    y: number;
}

interface TravelType {
    direction: 'up' | 'down' | 'left' | 'right' | 'start';
    distance: number;
}

type TravelingPoint = Point & TravelType & { price: number };

interface PriceList extends Record<string, number> {
    "up-0": number;
    "up-1": number;
    "up-2": number;
    "down-0": number;
    "down-1": number;
    "down-2": number;
    "left-0": number;
    "left-1": number;
    "left-2": number;
    "right-0": number;
    "right-1": number;
    "right-2": number;
}

const getDefaultPriceList = () => {
    return {
        "up-0": Number.MAX_SAFE_INTEGER,
        "up-1": Number.MAX_SAFE_INTEGER,
        "up-2": Number.MAX_SAFE_INTEGER,
        "down-0": Number.MAX_SAFE_INTEGER,
        "down-1": Number.MAX_SAFE_INTEGER,
        "down-2": Number.MAX_SAFE_INTEGER,
        "left-0": Number.MAX_SAFE_INTEGER,
        "left-1": Number.MAX_SAFE_INTEGER,
        "left-2": Number.MAX_SAFE_INTEGER,
        "right-0": Number.MAX_SAFE_INTEGER,
        "right-1": Number.MAX_SAFE_INTEGER,
        "right-2": Number.MAX_SAFE_INTEGER,
    }
};



const processInput = (day: number) => {
    const lines = readInputLines(day);
    const numbers = lines.map(line => line.split("").map(c => parseInt(c, 10)));
    return numbers;
};

const getUpPosition = (costs: number[][], prices: PriceList[][], position: TravelingPoint):TravelingPoint | null => {
    if (position.y <= 0) {
        return null;
    }
    if (position.direction === 'up') {
        if (position.distance === 2) {
            return null;
        }
        const priceKey = `up-${position.distance+1}`;

        const nextPrice = position.price + costs[position.y-1][position.x];
        const currentPrice = prices[position.y-1][position.x][priceKey];
        if (currentPrice < nextPrice) {
            return null;
        }

        const uposition = { 
            x: position.x, 
            y: position.y - 1, 
            direction: 'up', 
            distance: position.distance + 1, 
            price: nextPrice
        } as const;

        prices[position.y-1][position.x][priceKey] = nextPrice;
        return uposition;
    }

    if (position.direction === 'down') {
        return null;
    }

    const priceKey = `up-0`;

    const nextPrice = position.price + costs[position.y-1][position.x];
    const currentPrice = prices[position.y-1][position.x][priceKey];
    if (currentPrice < nextPrice) {
        return null;
    }

    const uposition = { 
        x: position.x, 
        y: position.y - 1, 
        direction: 'up', 
        distance: 0, 
        price: nextPrice
    } as const;

    prices[position.y-1][position.x][priceKey] = nextPrice;
    return uposition;
}

const getDownPosition = (costs: number[][], prices: PriceList[][], position: TravelingPoint):TravelingPoint | null => {
    if (position.y >= costs.length - 1) {
        return null;
    }
    if (position.direction === 'down') {
        if (position.distance === 2) {
            return null;
        }
        const priceKey = `down-${position.distance+1}`;

        const nextPrice = position.price + costs[position.y+1][position.x];
        const currentPrice = prices[position.y+1][position.x][priceKey];
        if (currentPrice < nextPrice) {
            return null;
        }

        const dposition = {
            x: position.x,
            y: position.y + 1,
            direction: 'down',
            distance: position.distance + 1, 
            price: nextPrice
        } as const;

        prices[position.y+1][position.x][priceKey] = nextPrice;
        return dposition;
    }

    if (position.direction === 'up') {
        return null;
    }

    const priceKey = `down-0`;

    const nextPrice = position.price + costs[position.y+1][position.x];
    const currentPrice = prices[position.y+1][position.x][priceKey];
    if (currentPrice < nextPrice) {
        return null;
    }

    const uposition = { 
        x: position.x, 
        y: position.y + 1, 
        direction: 'down', 
        distance: 0, 
        price: nextPrice
    } as const;

    prices[position.y+1][position.x][priceKey] = nextPrice;
    return uposition;
}

const getLeftPosition = (costs: number[][], prices: PriceList[][], position: TravelingPoint):TravelingPoint | null => {
    if (position.x <= 0) {
        return null;
    }
    if (position.direction === 'left') {
        if (position.distance === 2) {
            return null;
        }
        const priceKey = `left-${position.distance+1}`;

        const nextPrice = position.price + costs[position.y][position.x-1];
        const currentPrice = prices[position.y][position.x-1][priceKey];
        if (currentPrice < nextPrice) {
            return null;
        }

        const lposition = {
            x: position.x - 1,
            y: position.y,
            direction: 'left',
            distance: position.distance + 1, 
            price: nextPrice
        } as const;

        prices[position.y][position.x-1][priceKey] = nextPrice;
        return lposition;
    }

    if (position.direction === 'right') {
        return null;
    }

    const priceKey = `left-0`;

    const nextPrice = position.price + costs[position.y][position.x-1];
    const currentPrice = prices[position.y][position.x-1][priceKey];
    if (currentPrice < nextPrice) {
        return null;
    }

    const lposition = { 
        x: position.x - 1, 
        y: position.y, 
        direction: 'left', 
        distance: 0, 
        price: nextPrice
    } as const;

    prices[position.y][position.x-1][priceKey] = nextPrice;
    return lposition;
}

const getRightPosition = (costs: number[][], prices: PriceList[][], position: TravelingPoint):TravelingPoint | null => {
    if (position.x >= costs[0].length - 1) {
        return null;
    }
    if (position.direction === 'right') {
        if (position.distance === 2) {
            return null;
        }
        const priceKey = `right-${position.distance+1}`;

        const nextPrice = position.price + costs[position.y][position.x+1];
        const currentPrice = prices[position.y][position.x+1][priceKey];
        if (currentPrice < nextPrice) {
            return null;
        }

        const rposition = {
            x: position.x + 1,
            y: position.y,
            direction: 'right',
            distance: position.distance + 1, 
            price: nextPrice
        } as const;

        prices[position.y][position.x+1][priceKey] = nextPrice;
        return rposition;
    }

    if (position.direction === 'left') {
        return null;
    }

    const priceKey = `right-0`;

    const nextPrice = position.price + costs[position.y][position.x+1];
    const currentPrice = prices[position.y][position.x+1][priceKey];
    if (currentPrice < nextPrice) {
        return null;
    }

    const rposition = { 
        x: position.x + 1, 
        y: position.y, 
        direction: 'right', 
        distance: 0, 
        price: nextPrice
    } as const;

    prices[position.y][position.x+1][priceKey] = nextPrice;
    return rposition;
}



const partOne = (input: number[][], debug: boolean) => {
    const startPosition = { x: 0, y: 0, direction: 'right', distance: -1, price: 0 } as const;

    const prices: PriceList[][]  = Array(input.length).fill(0).map(_ => Array(input[0].length).fill(0).map(_ => getDefaultPriceList()));
    prices[0][0] = {
        "up-0": 0,
        "up-1": 0,
        "up-2": 0,
        "down-0": 0,
        "down-1": 0,
        "down-2": 0,
        "left-0": 0,
        "left-1": 0,
        "left-2": 0,
        "right-0": 0,
        "right-1": 0,
        "right-2": 0,
    }

    const queue: TravelingPoint[] = [startPosition];

    let callCount = 0;

    while (queue.length > 0) {
        callCount += 1;
        const position = queue.shift()!;

        if (callCount % 100_000 === 0) {
            console.log(`At ${callCount} calls, queue is ${queue.length}`);
            if (callCount % 1_000_000 === 0) {
                console.log(prices[prices.length-1][prices[0].length-1]);
            }
            console.log(position);
            //console.log(prices[position.y][position.x]);
        }

        // is the price current?
        const currentPrice = prices[position.y][position.x][`${position.direction}-${position.distance}`];
        if (currentPrice < position.price) {
            continue;
        }

        const upPosition = getUpPosition(input, prices, position);
        if (upPosition) {
            // if there was a cheaper one, we would not be here
            let existing = queue.findIndex(q => q.x === upPosition.x && q.y === upPosition.y && q.direction === upPosition.direction && q.distance === upPosition.distance);
            while (existing !== -1) {
                queue.splice(existing, 1);
                existing = queue.findIndex(q => q.x === upPosition.x && q.y === upPosition.y && q.direction === upPosition.direction && q.distance === upPosition.distance);
            }
            queue.push(upPosition);
        }

        const downPosition = getDownPosition(input, prices, position);
        if (downPosition) {
            // if there was a cheaper one, we would not be here
            let existing = queue.findIndex(q => q.x === downPosition.x && q.y === downPosition.y && q.direction === downPosition.direction && q.distance === downPosition.distance);
            while (existing !== -1) {
                queue.splice(existing, 1);
                existing = queue.findIndex(q => q.x === downPosition.x && q.y === downPosition.y && q.direction === downPosition.direction && q.distance === downPosition.distance);
            }
            queue.push(downPosition);
        }

        const leftPosition = getLeftPosition(input, prices, position);
        if (leftPosition) {
            // if there was a cheaper one, we would not be here
            let existing = queue.findIndex(q => q.x === leftPosition.x && q.y === leftPosition.y && q.direction === leftPosition.direction && q.distance === leftPosition.distance);
            while (existing !== -1) {
                queue.splice(existing, 1);
                existing = queue.findIndex(q => q.x === leftPosition.x && q.y === leftPosition.y && q.direction === leftPosition.direction && q.distance === leftPosition.distance);
            }
            queue.push(leftPosition);
        }

        const rightPosition = getRightPosition(input, prices, position);
        if (rightPosition) {
            // if there was a cheaper one, we would not be here
            let existing = queue.findIndex(q => q.x === rightPosition.x && q.y === rightPosition.y && q.direction === rightPosition.direction && q.distance === rightPosition.distance);
            while (existing !== -1) {
                queue.splice(existing, 1);
                existing = queue.findIndex(q => q.x === rightPosition.x && q.y === rightPosition.y && q.direction === rightPosition.direction && q.distance === rightPosition.distance);
            }
            queue.push(rightPosition);
        }
    }

    console.log(callCount);
    // console.log(prices);
    const finishPrices = prices[prices.length-1][prices[0].length-1];
    const minPrice = Math.min(...Object.values(finishPrices));
    return minPrice;
};

const partTwo = (input: number[][], debug: boolean) => {
    if (debug) {
        console.log("-------Debug-----");
    }
    return input.length;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: number[][]) => {
    console.log(input);
};

const test = (_: number[][]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<number[][], number> = {
    day: 17,
    input: () => processInput(17),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}