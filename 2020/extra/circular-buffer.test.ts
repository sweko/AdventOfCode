import { CircularBuffer } from "./circular-buffer";

import { assert, test } from "../test/engine";

test("Circular buffer with a single element construction", () => {
    // 1. Arrange
    const input = [1];
    const expected = [1];

    // 2. Act
    const buffer = new CircularBuffer(input);
    const actual = buffer.toArray();

    // 3. Assert
    assert.areEqual(actual, expected);

})

test("Circular buffer with no elements construction should fail", () => {
    // 1. Arrange
    const input = [];

    // 2, 3. Act, Assert
    assert.expectError(() => new CircularBuffer(input));
})

test("Circular buffer adding elements", () => {
    // 1. Arrange 
    const input = [1];
    const expected = [1, 2, 3, 4];
    const buffer = new CircularBuffer(input);

    // 2. Act
    buffer.addAfter(1, 2, 3, 4);
    const actual = buffer.toArray();

    // 3. Assert
    assert.areEqual(actual, expected);
})

test("Circular buffer remove elements", () => {
    // 1. Arrange
    const input = [1, 2, 3];
    const expected = [1, 3];
    const buffer = new CircularBuffer(input);

    // 2. Act
    buffer.remove(2);
    const actual = buffer.toArray();

    // 3. Assert
    assert.areEqual(actual, expected);
})


test("Circular buffer replace element", () => {
    // 1. Arrange
    const input = [1, 2, 3];
    const expected = [1, 4, 3];
    const buffer = new CircularBuffer(input);

    // 2. Act
    buffer.addAfter(2, 4);
    buffer.remove(2);
    const actual = buffer.toArray();

    // 3. Assert
    assert.areEqual(actual, expected);
})
