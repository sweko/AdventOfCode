// Solution for day 7 of advent of code 2023

import { readInputLines, readInput } from "../system/aoc-helper";
import "../utils/array-helpers";
import { Puzzle } from "../model/puzzle";

type Card = "A" | "K" | "Q" | "J" | "T" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2";

type HandType = "high-card"
    | "one-pair"
    | "two-pairs"
    | "three-of-a-kind"
    | "full-house"
    | "four-of-a-kind"
    | "five-of-a-kind"

type PokerHand = [Card, Card, Card, Card, Card];

interface BiddedHand {
    hand: PokerHand;
    bid: number;
}

const processInput = (day: number) => {
    const input = readInputLines(day);
    const hands = input.map(line => {
        const [hand, bid] = line.split(" ");
        return {
            hand: hand.split("") as [Card, Card, Card, Card, Card],
            bid: +bid
        };
    });
    return hands;
};

const typeValues: Record<HandType, number> = {
    "high-card": 1,
    "one-pair": 2,
    "two-pairs": 3,
    "three-of-a-kind": 4,
    "full-house": 5,
    "four-of-a-kind": 6,
    "five-of-a-kind": 7
};

const getComparer = (getHandType: (hand: PokerHand) => HandType, values: Record<Card, number>) => {
    const compareHands = (first: PokerHand, second: PokerHand): number => {
        const ftype = typeValues[getHandType(first)];
        const stype = typeValues[getHandType(second)];
        if (ftype > stype) {
            return 1;
        }
        if (ftype < stype) {
            return -1;
        }
        const fvalues = first.map(card => values[card]);
        const svalues = second.map(card => values[card]);

        for (let index = 0; index < 5; index++) {
            if (fvalues[index] > svalues[index]) {
                return 1;
            }
            if (fvalues[index] < svalues[index]) {
                return -1;
            }
        }
        return 0;
    };
    return compareHands;
};

const partOne = (input: BiddedHand[], debug: boolean) => {

    const values: Record<Card, number> = {
        "A": 14,
        "K": 13,
        "Q": 12,
        "J": 11,
        "T": 10,
        "9": 9,
        "8": 8,
        "7": 7,
        "6": 6,
        "5": 5,
        "4": 4,
        "3": 3,
        "2": 2
    };

    const getHandType = (hand: PokerHand): HandType => {
        const reduced = hand.groupReduce(
            card => card,
            (acc, _) => acc + 1,
            0
        );

        if (reduced.length === 1) {
            return "five-of-a-kind";
        }

        if (reduced.length === 2) {
            const [first, second] = reduced;
            if (first.value === 4 || second.value === 4) {
                return "four-of-a-kind";
            }
            return "full-house";
        }

        if (reduced.length === 3) {
            const [first, second, third] = reduced;
            if (first.value === 3 || second.value === 3 || third.value === 3) {
                return "three-of-a-kind";
            }
            return "two-pairs";
        }

        if (reduced.length === 4) {
            return "one-pair";
        }

        return "high-card";
    }

    const compareHands = getComparer(getHandType, values);

    const results = input.toSorted((first, second) => compareHands(first.hand, second.hand));
    const result = results.sum((hand, index) => hand.bid * (index + 1));
    return result;
};

const partTwo = (input: BiddedHand[], debug: boolean) => {
    const values: Record<Card, number> = {
        "A": 14,
        "K": 13,
        "Q": 12,
        "T": 10,
        "9": 9,
        "8": 8,
        "7": 7,
        "6": 6,
        "5": 5,
        "4": 4,
        "3": 3,
        "2": 2,
        "J": 1,
    };

    const getHandType = (hand: PokerHand): HandType => {
        const reduced = hand.groupReduce(
            card => card,
            (acc, _) => acc + 1,
            0
        );

        if (reduced.length === 1) {
            return "five-of-a-kind";
        }

        if (reduced.every(card => card.key !== "J")) {
            if (reduced.length === 2) {
                const [first, second] = reduced;
                if (first.value === 4 || second.value === 4) {
                    return "four-of-a-kind";
                }
                return "full-house";
            }

            if (reduced.length === 3) {
                const [first, second, third] = reduced;
                if (first.value === 3 || second.value === 3 || third.value === 3) {
                    return "three-of-a-kind";
                }
                return "two-pairs";
            }

            if (reduced.length === 4) {
                return "one-pair";
            }

            return "high-card";
        }

        // we have a joker
        if (reduced.length === 5) {
            return "one-pair";
        }

        if (reduced.length === 4) {
            return "three-of-a-kind";
        }

        if (reduced.length === 3) {
            const [first, second, third] = reduced;
            if (first.value === 3 || second.value === 3 || third.value === 3) {
                return "four-of-a-kind";
            }
            const jcards = reduced.find(card => card.key === "J")!;
            if (jcards.value === 2) {
                return "four-of-a-kind";
            }
            return "full-house";
        }

        return "five-of-a-kind";
    }

    const compareHands = getComparer(getHandType, values);

    const results = input.toSorted((first, second) => compareHands(first.hand, second.hand));
    const result = results.sum((hand, index) => hand.bid * (index + 1));
    return result;
};

const resultOne = (_: any, result: number) => {
    return `Result part one is ${result}`;
};

const resultTwo = (_: any, result: number) => {
    return `Result part two is ${result}`;
};

const showInput = (input: BiddedHand[]) => {
    console.log(input);
};

const test = (_: BiddedHand[]) => {
    console.log("----Test-----");
};

export const solution: Puzzle<BiddedHand[], number> = {
    day: 7,
    input: () => processInput(7),
    partOne,
    partTwo,
    resultOne: resultOne,
    resultTwo: resultTwo,
    showInput,
    test,
}