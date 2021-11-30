type Assert<T=any> = (actual: T, expected?: T) => void;

const assertImpl = {
    isTrue : (actual: any) => assertImpl.areSame(actual, true),
    isFalse: (actual: any) => assertImpl.areSame(actual, false),
    areSame: <T>(actual: T, expected: T) => actual === expected,
    areEqual: <T>(actual: T, expected: T) => {
        // expects well ordered objects, does not work on functions
        return JSON.stringify(actual) === JSON.stringify(expected);
    }
}

export const assert: {[key: string]: Assert} = Object.keys(assertImpl).map(key => {
    return {
        key,
        code: (actual: any, expected: any) => {
            const result = assertImpl[key](actual, expected);
            if (!result) {
                throw Error(`${key} test failed: Expected ${JSON.stringify(expected)}, actual value was ${JSON.stringify(actual)}`);
            }
        }
    }
}).reduce((acc, item) => ({...acc, [item.key]: item.code}), {})

export const expectError = (code: () => void, message: string) => {
    try {
        code();
        return false;
    } catch (err) {
        return true;
    }
}

assert.expectError = (code) => {
    const result = expectError(code, "NOT USED");
    if (!result) {
        throw Error(`Test failed: Expected error, but code executed`);
    };
};

export const test = (name: string, code: () => void) => {
    try {
        code();
        console.log(`\x1b[32m${name} passed\x1b[0m`)
        return true;
    } catch (error) {
        console.log(`\x1b[31m${name} failed - ${error.message}\x1b[0m`);
    }
}

