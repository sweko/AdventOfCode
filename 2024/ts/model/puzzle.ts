export  interface Puzzle<TInput = any, TOutput = any> {
    day: number;

    input(): TInput;
    showInput(input: TInput): void;

    partOne(input: TInput, debug?: boolean) : TOutput
    partTwo?(input: TInput, debug?: boolean): TOutput;

    resultOne(input: TInput, result: TOutput): string;
    resultTwo?(input: TInput, result: TOutput): string;

    test(input: TInput) : void;
}
