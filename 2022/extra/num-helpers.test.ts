import { getAllVariations } from "./num-helpers";

import { assert, test } from "../test/engine";

test("Ordered combinations of order 0 returns array with an empty array ", () => {
    // 1. Arrange
    const source = [1, 2, 3, 4];
    const order = 0;
    const expected: number[][] = [[]];

    // 2. Act
    const actual = getAllVariations(source, order);

    // 3. Assert
    assert.areEqual(actual, expected);
})


test("Ordered combinations of empty array source with any order returns empty array ", () => {
    // 1. Arrange
    const source = [];
    const order = 10;
    const expected: number[][] = [];

    // 2. Act
    const actual = getAllVariations(source, order);

    // 3. Assert
    assert.areEqual(actual, expected);
})

test("Ordered combinations of 3 element array with order 2 returns 6 variations ", () => {
    // 1. Arrange
    const source = [1, 2, 3];
    const order = 2;
    const expected: number[][] = [[1, 2], [1, 3], [2, 1], [2, 3], [3, 1], [3, 2]];

    // 2. Act
    const actual = getAllVariations(source, order);

    // 3. Assert
    assert.areEqual(actual, expected);
})