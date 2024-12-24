export  interface Puzzle<TInput = any, TOutput = any, TSecondOutput = TOutput> {
    day: number;

    input(): TInput;
    showInput(input: TInput): void;

    partOne(input: TInput, debug?: boolean) : TOutput
    partTwo?(input: TInput, debug?: boolean): TSecondOutput;

    resultOne(input: TInput, result: TOutput): string;
    resultTwo?(input: TInput, result: TSecondOutput): string;

    test(input: TInput) : void;
}
