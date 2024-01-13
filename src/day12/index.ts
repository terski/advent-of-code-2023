import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n');

const part1 = (rawInput: string) => {
    return parseInput(rawInput).reduce((sum, line) => {
        const [sequence, groups] = line.split(' ');
        return (
            sum +
            arrangements(
                sequence,
                groups.split(',').map(Number),
                new Map<string, number>(),
            )
        );
    }, 0);
};

const part2 = (rawInput: string) => {
    return parseInput(rawInput).reduce((sum, line) => {
        const [sequence, groups] = line.split(' ');
        return (
            sum +
            arrangements(
                new Array(5).fill(sequence).join('?'),
                new Array(5).fill(groups.split(',').map(Number)).flat(),
                new Map<string, number>(),
            )
        );
    }, 0);
};

const arrangements = (
    sequence: string,
    groups: number[],
    results: Map<string, number>,
): number => {
    const key = JSON.stringify({ sequence, groups });
    if (results.has(key)) {
        return results.get(key)!;
    }
    if (groups.length === 0) {
        return memoize(key, sequence.indexOf('#') === -1 ? 1 : 0, results);
    }
    if (sequence.length < minLength(groups)) {
        return memoize(key, 0, results);
    }
    const hasSeparator = sequence.substring(0, groups[0]).indexOf('.') > -1;
    if (sequence.length === groups[0]) {
        return memoize(key, hasSeparator ? 0 : 1, results);
    }
    const canUse = !hasSeparator && sequence[groups[0]] !== '#';
    if (sequence[0] === '#') {
        if (canUse) {
            return memoize(
                key,
                arrangements(
                    sequence.substring(groups[0] + 1).replace(/^\.+/, ''),
                    groups.slice(1),
                    results,
                ),
                results,
            );
        }
        return memoize(key, 0, results);
    }
    const skip = arrangements(
        sequence.substring(1).replace(/^\.+/, ''),
        groups,
        results,
    );
    if (!canUse) {
        return memoize(key, skip, results);
    }
    return memoize(
        key,
        skip +
            arrangements(
                sequence.substring(groups[0] + 1).replace(/^\.+/, ''),
                groups.slice(1),
                results,
            ),
        results,
    );
};

const memoize = (key: string, result: number, results: Map<string, number>) => {
    results.set(key, result);
    return result;
};

const minLength = (numbers: number[]) =>
    numbers.reduce((sum, cur) => sum + cur, numbers.length - 1);

const testInput = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`;

run({
    part1: {
        tests: [
            {
                input: testInput,
                expected: 21,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: testInput,
                expected: 525152,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
