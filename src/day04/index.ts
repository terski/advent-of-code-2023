import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n');

const part1 = (rawInput: string) => {
    const cards = parseInput(rawInput);

    return cards.reduce((score, line) => {
        const numMatches = matches(line);
        const cardScore = numMatches > 0 ? Math.pow(2, numMatches - 1) : 0;
        return score + cardScore;
    }, 0);
};

const part2 = (rawInput: string) => {
    const cards = parseInput(rawInput);
    let cardCount = 0;
    for (let i = 0; i < cards.length; i++) {
        cardCount += count(i, cards, new Map<number, number>());
    }
    return cardCount;
};

const count = (index: number, cards: string[], counts: Map<number, number>) => {
    if (counts.has(index)) {
        return counts.get(index) ?? 0;
    }
    let currentCount = 1;
    const score = matches(cards[index]);
    for (let i = 1; i <= score; i++) {
        currentCount += count(index + i, cards, counts);
    }
    counts.set(index, currentCount);
    return currentCount;
};

const matches = (line: string) => {
    const [_, numbers] = line.split(/:\s+/);
    const [wins, ours] = numbers.split(' | ');
    const winningNumbers = wins.split(/\s+/);
    let matchCount = 0;
    for (const ourNumber of ours.split(/\s+/)) {
        if (winningNumbers.includes(ourNumber)) {
            matchCount++;
        }
    }
    return matchCount;
};

const testInput = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`;

run({
    part1: {
        tests: [
            {
                input: testInput,
                expected: 13,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: testInput,
                expected: 30,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
