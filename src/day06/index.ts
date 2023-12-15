import run from 'aocrunner';

type Race = {
    time: number;
    recordDistance: number;
};

const parseRaces = (rawInput: string): Race[] => {
    const [timeLine, distanceLine] = rawInput.split('\n');
    const timeValues = timeLine.match(/\d+/g)?.map(Number) ?? [];
    const distanceValues = distanceLine.match(/\d+/g)?.map(Number) ?? [];
    return timeValues.map((time, index) => {
        return {
            time,
            recordDistance: distanceValues[index],
        };
    });
};

const parseSingleRace = (rawInput: string): Race => {
    const [timeLine, distanceLine] = rawInput.split('\n');
    const time = Number(timeLine.match(/\d+/g)?.join(''));
    const recordDistance = Number(distanceLine.match(/\d+/g)?.join(''));
    return { time, recordDistance };
};

const waysToWin = (race: Race) => {
    let winCount = 0;
    for (let i = 1; i < race.time; i++) {
        const distance = (race.time - i) * i;
        if (distance > race.recordDistance) {
            winCount++;
        }
    }
    return winCount;
};

const part1 = (rawInput: string) => {
    const races = parseRaces(rawInput);
    return races.reduce((product, race) => {
        return product * waysToWin(race);
    }, 1);
};

const part2 = (rawInput: string) => {
    const race = parseSingleRace(rawInput);
    return waysToWin(race);
};

const testInput = `
Time:      7  15   30
Distance:  9  40  200
`;

run({
    part1: {
        tests: [
            {
                input: testInput,
                expected: 288,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: testInput,
                expected: 71503,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
