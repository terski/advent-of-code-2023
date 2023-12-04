import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n');

const part1 = (rawInput: string) => {
    const input = parseInput(rawInput);
    const sum = input.reduce((sum, line) => {
        const [game, plays] = line.split(':');
        if (possible(plays.trim().split(';'))) {
            const gameNumber = +game.split(' ')[1];
            return sum + gameNumber;
        }
        return sum;
    }, 0);

    return sum.toString();
};

const limits: { [key: string]: number } = {
    red: 12,
    green: 13,
    blue: 14,
};

const possible = (plays: string[]) => {
    for (let round of plays) {
        for (let play of round.split(',')) {
            const [count, color] = play.trim().split(' ');
            if (limits[color] < +count) {
                return false;
            }
        }
    }
    return true;
};

const part2 = (rawInput: string) => {
    const input = parseInput(rawInput);

    return;
};

run({
    part1: {
        tests: [
            {
                input: `
                Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
                Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
                Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
                Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
                Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
                `,
                expected: '8',
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            // {
            //   input: ``,
            //   expected: '',
            // },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
