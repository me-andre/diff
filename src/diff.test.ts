import { test, expect, describe } from 'vitest';
import { diff } from './diff.ts';

describe('single', () => {
    test('middle insert', () => {
        const source = [1, 2, 3, 4, 5];
        const result = [1, 2,    4, 5];

        const expected = [
            { type: 'delete', index: 2 },
        ];

        const actual = diff(source, result);

        expect(actual).toEqual(expected);
    });

    test('middle deletion', () => {
        const source = [1, 2,    4, 5];
        const result = [1, 2, 3, 4, 5];

        const expected = [
            { type: 'insert', index: 2, value: 3 },
        ];

        const actual = diff(source, result);

        expect(actual).toEqual(expected);
    });

    test('prepend', () => {
        const source = [1, 2, 3, 4, 5];
        const result = [   2, 3, 4, 5];

        const expected = [
            { type: 'delete', index: 0 },
        ];

        const actual = diff(source, result);

        expect(actual).toEqual(expected);
    });

    test('shift', () => {
        const source = [   2, 3, 4, 5];
        const result = [1, 2, 3, 4, 5];

        const expected = [
            { type: 'insert', index: 0, value: 1 },
        ];

        const actual = diff(source, result);

        expect(actual).toEqual(expected);
    });

    test('append', () => {
        const source = [1, 2, 3, 4, 5];
        const result = [1, 2, 3, 4];

        const expected = [
            { type: 'delete', index: 4 },
        ];

        const actual = diff(source, result);

        expect(actual).toEqual(expected);
    });

    test('pop', () => {
        const source = [1, 2, 3, 4];
        const result = [1, 2, 3, 4, 5];

        const expected = [
            { type: 'insert', index: 4, value: 5 },
        ];

        const actual = diff(source, result);

        expect(actual).toEqual(expected);
    });
});

describe('multiple', () => {
    test('middle insert', () => {
        const source = [1, 2, 3, 6, 4, 5];
        const result = [1, 2, 4, 5];

        const expected = [
            { type: 'delete', index: 2 },
            { type: 'delete', index: 3 },
        ];

        const actual = diff(source, result);

        expect(actual).toEqual(expected);
    });

    test('middle deletion', () => {
        const source = [1, 2,       4, 5];
        const result = [1, 2, 3, 6, 4, 5];

        const expected = [
            { type: 'insert', index: 2, value: 3 },
            { type: 'insert', index: 3, value: 6 },
        ];

        const actual = diff(source, result);

        expect(actual).toEqual(expected);
    });

    test('prepend', () => {
        const source = [1, 2, 3, 4, 5];
        const result = [      3, 4, 5];

        const expected = [
            { type: 'delete', index: 0 },
            { type: 'delete', index: 1 },
        ];

        const actual = diff(source, result);

        expect(actual).toEqual(expected);
    });

    test('shift', () => {
        const source = [      3, 4, 5];
        const result = [1, 2, 3, 4, 5];

        const expected = [
            { type: 'insert', index: 0, value: 1 },
            { type: 'insert', index: 1, value: 2 },
        ];

        const actual = diff(source, result);

        expect(actual).toEqual(expected);
    });

    test('append', () => {
        const source = [1, 2, 3, 4, 5];
        const result = [1, 2, 3];

        const expected = [
            { type: 'delete', index: 3 },
            { type: 'delete', index: 4 },
        ];

        const actual = diff(source, result);

        expect(actual).toEqual(expected);
    });

    test('pop', () => {
        const source = [1, 2, 3];
        const result = [1, 2, 3, 4, 5];

        const expected = [
            { type: 'insert', index: 3, value: 4 },
            { type: 'insert', index: 4, value: 5 },
        ];

        const actual = diff(source, result);

        expect(actual).toEqual(expected);
    });
});

describe('no intersection', () => {
    test('works', () => {
        const source = [1, 2, 3, 4, 5];
        const result = [6, 7, 8, 9, 10];

        const expected = [
            { type: 'delete', index: 0 },
            { type: 'delete', index: 1 },
            { type: 'delete', index: 2 },
            { type: 'delete', index: 3 },
            { type: 'delete', index: 4 },
            { type: 'insert', index: 0, value: 6 },
            { type: 'insert', index: 1, value: 7 },
            { type: 'insert', index: 2, value: 8 },
            { type: 'insert', index: 3, value: 9 },
            { type: 'insert', index: 4, value: 10 }
        ];

        const actual = diff(source, result);

        expect(actual).toEqual(expected);
    });
});

describe('multiple differences', () => {
    test('both deletions and insertions', () => {
        const source = [   1, 2, 3, 5, 6, 9, 10, 11, 12, 8, 14, 15];
        const result = [0, 1, 2, 3, 4, 7,            12, 8, 16, 17];

        const expected = [
            { type: 'insert', index: 0, value: 0 },
            { type: 'delete', index: 3 },
            { type: 'delete', index: 4 },
            { type: 'delete', index: 5 },
            { type: 'delete', index: 6 },
            { type: 'delete', index: 7 },
            { type: 'insert', index: 3, value: 4 },
            { type: 'insert', index: 4, value: 7 },
            { type: 'delete', index: 10 },
            { type: 'delete', index: 11 },
            { type: 'insert', index: 10, value: 16 },
            { type: 'insert', index: 11, value: 17 },
        ];

        const actual = diff(source, result);

        expect(actual).toEqual(expected);
    });
});