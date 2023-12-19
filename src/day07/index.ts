import run from 'aocrunner';

enum HandType {
    HighCard,
    OnePair,
    TwoPair,
    ThreeOfAKind,
    FullHouse,
    FourOfAKind,
    FiveOfAKind,
}

type Hand = {
    cards: string;
    bid: number;
    type: HandType;
};

const computeHandType = (
    cards: string,
    withJokers: boolean = false,
): HandType => {
    const counts = cards.split('').reduce((map, card) => {
        const count = map.get(card) ?? 0;
        return map.set(card, count + 1);
    }, new Map<string, number>());
    const countsArray = Array.from(counts.values());
    const maxCount = Math.max(...countsArray);

    if (withJokers && maxCount < 5 && counts.has('J')) {
        const mostCommonCard = Array.from(counts.entries())
            .filter(([card]) => card !== 'J')
            .reduce(
                (mostCommon, [card, count]) => {
                    if (
                        count > mostCommon[1] ||
                        (count === mostCommon[1] &&
                            cardValue(card) > cardValue(mostCommon[0]))
                    ) {
                        return [card, count];
                    }
                    return mostCommon;
                },
                ['', 0],
            )[0];
        const newHand = cards.replace(/J/g, mostCommonCard);
        console.log(`${cards} -> ${newHand}}`)
        return computeHandType(cards.replace(/J/g, mostCommonCard));
    }

    if (maxCount === 5) {
        return HandType.FiveOfAKind;
    }
    if (maxCount === 4) {
        return HandType.FourOfAKind;
    }
    if (maxCount === 3) {
        const minCount = Math.min(...countsArray);
        return minCount === 2 ? HandType.FullHouse : HandType.ThreeOfAKind;
    }
    if (maxCount === 2) {
        const pairs = countsArray.filter((count) => count === 2).length;
        return pairs === 2 ? HandType.TwoPair : HandType.OnePair;
    }
    return HandType.HighCard;
};

const cardValue = (card: string, weakJokers: boolean = false) => {
    const values: Record<string, number> = {
        T: 10,
        J: weakJokers ? 11 : 1,
        Q: 12,
        K: 13,
        A: 14,
    };
    return values[card] ?? +card;
};

const compareHands = (
    hand1: Hand,
    hand2: Hand,
    weakJokers: boolean = false,
) => {
    if (hand1.type !== hand2.type) {
        return hand1.type - hand2.type;
    }

    for (let i = 0; i < hand1.cards.length; i++) {
        const card1 = cardValue(hand1.cards[i], weakJokers);
        const card2 = cardValue(hand2.cards[i], weakJokers);
        if (card1 !== card2) {
            return card1 - card2;
        }
    }

    return 0;
};

const parseInput = (rawInput: string, withJokers: boolean): Hand[] =>
    rawInput.split('\n').map((line) => {
        const [cards, bid] = line.split(/\s/);
        return { cards, bid: +bid, type: computeHandType(cards, withJokers) };
    });

const WithJokers = true;

const part1 = (rawInput: string) => {
    const hands = parseInput(rawInput, !WithJokers);
    return hands.sort(compareHands).reduce((total, hand, index) => {
        return +hand.bid * (index + 1) + total;
    }, 0);
};

const part2 = (rawInput: string) => {
    const hands = parseInput(rawInput, WithJokers);
    return hands
        .sort(compareHands)
        .reduce((total, hand, index) => {
            return +hand.bid * (index + 1) + total;
        }, 0);
};

const testInput = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`;

run({
    part1: {
        tests: [
            {
                input: testInput,
                expected: 6440,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: testInput,
                expected: 5905,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
