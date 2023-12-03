import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n');

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);

    const result = input.reduce((sum, calibrationReading) => {
        const digits = calibrationReading.match(/\d/g) || [];
        if (digits.length > 0) {
            const reading = digits[0] + digits[digits.length - 1];
            sum += +reading;
        }
        return sum;
    }, 0);

    return result.toString();
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const regex = new RegExp(
        `(?=(${Object.keys(digitMap).join('|')}|\\d))`,
        'g',
    );

    const result = input.reduce((sum, calibrationReading) => {
        let pos = 0;
        let matches: number[] = [];
        let match: RegExpExecArray | null;
        while (
            (match = regex.exec(calibrationReading.substring(pos))) !== null
        ) {
            matches.push(match[1] in digitMap ? digitMap[match[1]] : +match[1]);
            pos++;
        }

        const reading = matches[0] * 10 + matches[matches.length - 1];
        sum += reading;
        return sum;
    }, 0);

    return result.toString();
};

const digitMap: { [key: string]: number } = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
};

run({
    part1: {
        tests: [
            {
                input: `
                    1abc2
                    pqr3stu8vwx
                    a1b2c3d4e5f
                    treb7uchet`,
                expected: '142',
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `
                    two1nine
                    eightwothree
                    abcone2threexyz
                    xtwone3four
                    4nineeightseven2
                    zoneight234
                    7pqrstsixteen`,
                expected: '281',
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
