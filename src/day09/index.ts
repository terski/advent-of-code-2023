import run from 'aocrunner';

const parseInput = (rawInput: string) =>
    rawInput.split('\n').map((line) => line.split(/\s/).map(Number));

const differences = (input: number[]) => {
    const result = [input];

    let current = input;
    while (current.some((i) => i !== 0)) {
        let next: number[] = [];
        for (let i = 1; i < current.length; i++) {
            next.push(current[i] - current[i - 1]);
        }
        result.push(next);
        current = next;
    }

    return result;
};

const nextValue = (input: number[]) => {
    return differences(input).reduceRight((prev, cur, index) => {
        return prev + cur[cur.length - 1];
    }, 0);
};

const previousValue = (input: number[]) => {
    return differences(input).reduceRight((prev, cur, index) => {
        return cur[0] - prev;
    }, 0);
};

const part1 = (rawInput: string) => {
    return parseInput(rawInput).reduce(
        (sum, cur) => sum + nextValue(cur),
        0,
    );
};

const part2 = (rawInput: string) => {
    return parseInput(rawInput).reduce(
        (sum, cur) => sum + previousValue(cur),
        0,
    );
};

const testInput = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`;

run({
    part1: {
        tests: [
            {
                input: testInput,
                expected: 114,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: testInput,
                expected: 2,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
