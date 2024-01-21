import run from 'aocrunner';

const parseInput = (rawInput: string) => buildPatterns(rawInput.split('\n'));

const part1 = (rawInput: string) => {
    return parseInput(rawInput).reduce((total, pattern) => {
        let colScore = mirrorValue(pattern.cols);
        if (colScore) {
            return total + colScore;
        }
        return total + 100 * mirrorValue(pattern.rows);
    }, 0);
};

const part2 = (rawInput: string) => {
    return parseInput(rawInput).reduce((total, pattern) => {
        let colScore = smudgeValue(pattern.cols);
        if (colScore) {
            return total + colScore;
        }
        return total + 100 * smudgeValue(pattern.rows);
    }, 0);
};

type Pattern = {
    rows: number[];
    cols: number[];
};

const buildPatterns = (input: string[]) => {
    const patterns: Pattern[] = [];
    let pattern: Pattern;

    input.forEach((line, lineIndex) => {
        if (!line || lineIndex === 0) {
            pattern && patterns.push(pattern);
            pattern = {
                rows: Array<number>(),
                cols: Array<number>(),
            };
        }

        if (!line) return;

        if (pattern.cols.length === 0) {
            pattern.cols = new Array<number>(line.length).fill(0);
        }

        const rowValue = line.split('').reduce((p, c, i) => {
            pattern.cols[i] += c === '#' ? Math.pow(2, pattern.rows.length) : 0;
            return p + (c === '#' ? Math.pow(2, i) : 0);
        }, 0);
        pattern.rows.push(rowValue);

        if (lineIndex === input.length - 1) {
            patterns.push(pattern);
        }
    });

    return patterns;
};

// Return the number of elements mirrored in the sequence
const mirrorValue = (sequence: number[]) => {
    for (let i = 0; i < sequence.length - 1; i++) {
        let isMirror = true;
        if (sequence[i] === sequence[i + 1]) {
            isMirror = true;
            for (let j = 1; j <= i && i + j < sequence.length - 1; j++) {
                if (sequence[i - j] !== sequence[i + j + 1]) {
                    isMirror = false;
                    break;
                }
            }
            if (isMirror) return i + 1;
        }
    }
    return 0;
};

// Return the number of elements mirrored in a sequence, if a smudge is detected and fixed
const smudgeValue = (sequence: number[]) => {
    let foundSmudge = false;
    for (let i = 0; i < sequence.length - 1; i++) {
        let isMirror = true;
        if (
            sequence[i] === sequence[i + 1] ||
            (!foundSmudge && isSmudge(sequence[i], sequence[i + 1]))
        ) {
            isMirror = true;
            foundSmudge = isSmudge(sequence[i], sequence[i + 1]);

            for (let j = 1; j <= i && i + j < sequence.length - 1; j++) {
                if (sequence[i - j] !== sequence[i + j + 1]) {
                    if (
                        !foundSmudge &&
                        isSmudge(sequence[i - j], sequence[i + j + 1])
                    ) {
                        foundSmudge = true;
                    } else {
                        isMirror = false;
                        foundSmudge = false;
                        break;
                    }
                }
            }
            if (isMirror && foundSmudge) {
                return i + 1;
            }
        }
    }
    return 0;
};

const isSmudge = (a: number, b: number) => {
    const diff = a ^ b;
    return diff > 0 && (diff & (diff - 1)) === 0;
};

const testInput = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`;

run({
    part1: {
        tests: [
            {
                input: testInput,
                expected: 405,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: testInput,
                expected: 400,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
