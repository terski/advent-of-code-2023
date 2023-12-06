import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n');

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const sumOfPartNumbers = input.reduce((sum, line, rowIndex, schematic) => {
        const regex = /\d+/g;
        let match;
        while ((match = regex.exec(line)) !== null) {
            if (adjacentToASymbol(rowIndex, match.index, match[0], schematic)) {
                sum += +match[0];
            }
        }
        return sum;
    }, 0);

    return sumOfPartNumbers.toString();
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const sumOfGearRatios = input.reduce((sum, line, rowIndex, schematic) => {
        const regex = /\*/g;
        let match;
        while ((match = regex.exec(line)) !== null) {
            sum += gearRatio(rowIndex, match.index, schematic);
        }
        return sum;
    }, 0);

    return sumOfGearRatios.toString();
};

const adjacentToASymbol = (
    row: number,
    col: number,
    partNumber: string,
    schematic: string[],
) => {
    const minRow = Math.max(0, row - 1);
    const maxRow = Math.min(schematic.length - 1, row + 1);
    const minCol = Math.max(0, col - 1);
    const maxCol = Math.min(schematic[row].length - 1, col + partNumber.length);
    const block = schematic
        .slice(minRow, maxRow + 1)
        .map((row) => row.slice(minCol, maxCol + 1))
        .join('');

    return /[^0-9.]/g.test(block);
};

const gearRatio = (
    row: number,
    col: number,
    schematic: string[],
) => {
    const minRow = Math.max(0, row - 1);
    const maxRow = Math.min(schematic.length - 1, row + 1);
    const partNumbers = schematic
        .slice(minRow, maxRow + 1)
        .reduce((overlaps: number[], line) => {
            overlaps.push(...findOverlaps(line, col));
            return overlaps;
        }, []);
    return (partNumbers.length === 2) ? partNumbers[0] * partNumbers[1] : 0;
};

const findOverlaps = (input: string, col: number) => {
    const overlapping = [];
    let regex = /\d+/g;
    let match;
    while ((match = regex.exec(input)) !== null) {
        if (
            Math.abs(match.index - col) < 2 ||
            Math.abs(match.index + match[0].length - 1 - col) < 2
        ) {
            overlapping.push(+match[0]);
        }
    }
    return overlapping;
};

run({
    part1: {
        tests: [
            {
                input: `
                    467..114..
                    ...*......
                    ..35..633.
                    ......#...
                    617*......
                    .....+.58.
                    ..592.....
                    ......755.
                    ...$.*....
                    .664.598..`,
                expected: '4361',
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `
                    467..114..
                    ...*......
                    ..35..633.
                    ......#...
                    617*......
                    .....+.58.
                    ..592.....
                    ......755.
                    ...$.*....
                    .664.598..`,
                expected: '467835',
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
