import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n');

type Point = { row: number; col: number };

const galaxyColumns = (row: string) => {
    return row
        .split('')
        .map((char, index) => (char === '#' ? index : undefined))
        .filter((index): index is number => index !== undefined);
};

const galaxyPairs = (points: Point[]) => {
    const pairs: Point[][] = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            pairs.push([points[i], points[j]]);
        }
    }
    return pairs;
};

const galaxies = (universe: string[], expandIncrement: number = 1) => {
    let rowOffset = 0;
    let points: Point[] = [];
    const emptyColumns = new Set(
        Array.from({ length: universe[0].length }, (_, i) => i),
    );

    universe.forEach((line, rowIndex) => {
        const columns = galaxyColumns(line);
        if (columns.length === 0) {
            rowOffset += expandIncrement;
        } else {
            columns.forEach((col) => {
                emptyColumns.delete(col);
                points.push({ row: rowIndex + rowOffset, col });
            });
        }
    });

    const columnsToExpand = Array.from(emptyColumns);
    points = points.map(({ row, col }) => {
        const expansionFactor =
            columnsToExpand.filter((i) => i < col).length * expandIncrement;
        const columnsLessThan = columnsToExpand.filter((i) => i < col);
        return { row, col: col + expansionFactor };
    });

    return points;
};

const distance = (p1: Point, p2: Point) => {
    return Math.abs(p1.row - p2.row) + Math.abs(p1.col - p2.col);
};

const part1 = (rawInput: string) => {
    return galaxyPairs(galaxies(parseInput(rawInput))).reduce(
        (sum, [p1, p2]) => {
            return sum + distance(p1, p2);
        },
        0,
    );
};

const part2 = (rawInput: string) => {
    return galaxyPairs(galaxies(parseInput(rawInput), 1_000_000 - 1)).reduce(
        (sum, [p1, p2]) => {
            return sum + distance(p1, p2);
        },
        0,
    );
};

const testInput = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`;

run({
    part1: {
        tests: [
            {
                input: testInput,
                expected: 374,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: testInput,
                expected: 82000210,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
