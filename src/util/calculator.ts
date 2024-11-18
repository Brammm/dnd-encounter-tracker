const operations = {
    d: (a: number, b: number) => a * b,
    '+': (a: number, b: number) => a + b,
    '-': (a: number, b: number) => a - b,
};

export function calculateMaximum(formula: string): number {
    const regex = /(\d+|d|\+|-)/g;
    const symbols = formula.match(regex);

    if (!symbols) {
        return 0;
    }

    const { operators, output } = symbols.reduce<{
        output: string[];
        operators: string[];
    }>(
        ({ operators, output }, symbol) => {
            const numeric = Number.parseFloat(symbol);
            if (Number.isNaN(numeric)) {
                while (operators.length) {
                    output.push(operators.pop() as string);
                }
                operators.push(symbol);
            } else {
                output.push(symbol);
            }

            return { output, operators };
        },
        { output: [], operators: [] },
    );

    while (operators.length) {
        output.push(operators.pop() as string);
    }

    const result = output.reduce<string[]>((stack, token) => {
        if (Object.keys(operations).includes(token)) {
            const operation = operations[token as keyof typeof operations];
            const b = stack.pop();
            const a = stack.pop();
            stack.push(
                operation(
                    Number.parseInt(a as string),
                    Number.parseInt(b as string),
                ).toString(),
            );
        } else {
            stack.push(token);
        }

        return stack;
    }, []);

    return Number.parseInt(result[0]);
}
