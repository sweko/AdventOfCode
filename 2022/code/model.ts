export  interface Puzzle<TInput, TOutput> {
    day: number;

    input(day: number): Promise<TInput>;
    showInput?(input: TInput): void;

    partOne(input: TInput, debug?: boolean) : TOutput
    partTwo?(input: TInput, debug?: boolean): TOutput;

    resultOne(input: TInput, result: TOutput): string;
    resultTwo?(input: TInput, result: TOutput): string;

    test(input: TInput) : void;
}
