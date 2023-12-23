import run from 'aocrunner';

type Network = { [key: string]: { left: string; right: string } };

const parseInput = (rawInput: string) => {
    const input = rawInput.split('\n');
    const instructions = input[0];
    const network: Network = {};
    input.slice(2).forEach((line) => {
        const result = line.match(/[A-Z0-9]{3}/g);
        if (result) {
            const [key, left, right] = result;
            network[key] = { left, right };
        }
    });

    return { instructions, network };
};

const gcd = (a: number, b: number): number => {
    return !b ? a : gcd(b, a % b);
};

const lcm = (a: number, b: number): number => {
    return Math.abs(a * b) / gcd(a, b);
};

const lcmOfArray = (arr: number[]): number => {
    let multiple = arr[0];
    for (let i = 1; i < arr.length; i++) {
        multiple = lcm(multiple, arr[i]);
    }
    return multiple;
};

const part1 = (rawInput: string) => {
    const { instructions, network } = parseInput(rawInput);
    let step = 0;
    let key = 'AAA';
    while (key !== 'ZZZ') {
        const instruction = instructions[step % instructions.length];
        key = network[key][instruction === 'R' ? 'right' : 'left'];
        step++;
    }

    return step;
};

const part2 = (rawInput: string) => {
    const { instructions, network } = parseInput(rawInput);
    let keys = Object.keys(network).filter((k) => k.endsWith('A'));
    let steps = keys.map(key => {
        let step = 0;
        while (!key.endsWith('Z')) {
            const instruction = instructions[step % instructions.length];
            key = network[key][instruction === 'R' ? 'right' : 'left'];
            step++;
        }
        return step;
    });

    return lcmOfArray(steps);
};

const testInput = `
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
`;

const part2TestInput = `
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`;

run({
    part1: {
        tests: [
            {
                input: testInput,
                expected: 6,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: part2TestInput,
                expected: 6,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
