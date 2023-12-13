import run from 'aocrunner';

type Range = {
    destStart: number;
    sourceStart: number;
    length: number;
};

type RangeMap = {
    ranges: Range[];
};

type SeedRange = {
    start: number;
    length: number;
};

type PuzzleInput = {
    seedValues: number[];
    seedRanges: SeedRange[];
    maps: RangeMap[];
};

const parseInput = (rawInput: string) => {
    const puzzle: PuzzleInput = {
        seedValues: new Array<number>(),
        seedRanges: new Array<SeedRange>(),
        maps: new Array<RangeMap>(),
    };
    rawInput.split('\n').forEach((line) => {
        if (line.match(/seeds: (.*)/g)) {
            puzzle.seedValues = line
                .split(': ')[1]
                .split(/\s/)
                .map((s) => +s);
            for (let i = 0; i < puzzle.seedValues.length; i += 2) {
                puzzle.seedRanges.push({
                    start: puzzle.seedValues[i],
                    length: puzzle.seedValues[i + 1],
                });
            }
        } else if (line.match(/(.*) map:/g)) {
            puzzle.maps.push({
                ranges: new Array<Range>(),
            });
        } else if (line.match(/(\d+) (\d+) (\d+)/g)) {
            const map = puzzle.maps[puzzle.maps.length - 1];
            const [destStart, sourceStart, length] = line
                .split(/\s/)
                .map((s) => +s);
            map.ranges.push({
                destStart,
                sourceStart,
                length,
            });
        }
    });
    return puzzle;
};

const toDest = (source: number, map: RangeMap) => {
    for (let range of map.ranges) {
        if (
            source >= range.sourceStart &&
            source < range.sourceStart + range.length
        ) {
            const offset = source - range.sourceStart;
            const dest = range.destStart + offset;
            return dest;
        }
    }
    return source;
};

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);

    return input.seedValues.reduce((lowest, seed) => {
        const dest = input.maps.reduce(
            (source, map) => toDest(source, map),
            seed,
        );

        if (typeof lowest === 'undefined') return dest;

        return dest < lowest ? dest : lowest;
    });
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);

    return input.seedRanges.reduce((lowest, range, rangeIndex) => {
        for (let i = 0; i < range.length; i++) {
            const dest = input.maps.reduce(
                (source, map) => toDest(source, map),
                range.start + i,
            );

            if (rangeIndex === 0 && i === 0) lowest = dest;

            lowest = Math.min(dest, lowest);
        }
        return lowest;
    }, 0);
};

const testInput = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

run({
    part1: {
        tests: [
            {
                input: testInput,
                expected: 35,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: testInput,
                expected: 46,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
