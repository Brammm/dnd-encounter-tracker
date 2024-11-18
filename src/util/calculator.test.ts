import { calculateMaximum } from './calculator.ts';

const dataProvider: [string, number][] = [
    ['1', 1],
    ['100', 100],
    ['2d4', 8],
    ['12d4', 48],
    ['2d12', 24],
    ['12d12', 144],
    ['2d4+13', 21],
    ['2d8-3', 13],
];

describe('calculateMaximum', () => {
    it('Should calculate the maximum for each formula', () => {
        for (const [formula, expected] of dataProvider) {
            expect(calculateMaximum(formula)).toBe(expected);
        }
    });
});
