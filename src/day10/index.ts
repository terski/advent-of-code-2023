import run from 'aocrunner';

type Point = { row: number; col: number };

const parseInput = (rawInput: string) => rawInput.split('\n');

const startingPosition = (sketch: string[]) => {
    for (let row = 0; row < sketch.length; row++) {
        const col = sketch[row].indexOf('S');
        if (col > -1) {
            return { row, col };
        }
    }
};

const nextPosition = (visited: Point[], sketch: string[]) => {
    if (visited.length === 0) {
        return startingPosition(sketch);
    }
    if (visited.length === 1) {
        return connections(visited[0], sketch)[0];
    }
    for (let pos of connections(visited[visited.length - 1], sketch)) {
        if (!visited.some((v) => v.row === pos.row && v.col === pos.col)) {
            return pos;
        }
    }
};

const connections = (cur: Point, sketch: string[]) => {
    const result: Point[] = [];
    [
        { rowOffset: -1, colOffset: 0, from: 'S|LJ', to: '|7F' }, // Up
        { rowOffset: 0, colOffset: -1, from: 'S-7J', to: '-FL' }, // Left
        { rowOffset: 0, colOffset: 1, from: 'S-LF', to: '-J7' }, // Right
        { rowOffset: 1, colOffset: 0, from: 'S|7F', to: '|LJ' }, // Down
    ].forEach(({ rowOffset, colOffset, from, to }) => {
        const pos = { row: cur.row + rowOffset, col: cur.col + colOffset };
        if (
            pos.row > -1 &&
            pos.row < sketch.length &&
            pos.col > -1 &&
            pos.col < sketch[cur.row].length &&
            from.includes(sketch[cur.row][cur.col]) &&
            to.includes(sketch[pos.row][pos.col])
        ) {
            result.push(pos);
        }
    });
    return result;
};

const buildLoop = (sketch: string[]) => {
    const visited: Point[] = [];
    let next: Point | undefined;

    do {
        next = nextPosition(visited, sketch);
        if (next) visited.push(next);
    } while (next);

    return visited;
};

const cross = (a: Point, b: Point, c: Point) => {
    return (
        (b.col - a.col) * (c.row - a.row) - (c.col - a.col) * (b.row - a.row)
    );
};

const insideLoop = (p: Point, loop: Point[]) => {
    if (loop.some((l) => l.row === p.row && l.col === p.col)) {
        return false;
    }

    let windingNumber = 0;

    loop.forEach((a, i) => {
        const b = loop[(i + 1) % loop.length];
        if (a.col <= p.col) {
            if (b.col > p.col && cross(a, b, p) > 0) {
                windingNumber += 1;
            }
        } else if (b.col <= p.col && cross(a, b, p) < 0) {
            windingNumber -= 1;
        }
    });

    return windingNumber !== 0;
};

const part1 = (rawInput: string) => {
    const sketch = parseInput(rawInput);
    const loop = buildLoop(sketch);
    return Math.floor(loop.length / 2);
};

const part2 = (rawInput: string) => {
    const sketch = parseInput(rawInput);
    const loop = buildLoop(sketch);
    let count = 0;
    for (let row = 0; row < sketch.length; row++) {
        for (let col = 0; col < sketch[row].length; col++) {
            count += insideLoop({ row, col }, loop) ? 1 : 0;
        }
    }
    return count;
};

const simpleTestInput = `
.....
.S-7.
.|.|.
.L-J.
.....`;

const moreComplexTestInput = `
..F7.
.FJ|.
SJ.L7
|F--J
LJ...`;

const aComplexLoop = `
...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`;

const anEvenMoreComplexLoop = `
.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`;

run({
    part1: {
        tests: [
            {
                input: simpleTestInput,
                expected: 4,
            },
            {
                input: moreComplexTestInput,
                expected: 8,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: simpleTestInput,
                expected: 1,
            },
            {
                input: aComplexLoop,
                expected: 4,
            },
            {
                input: anEvenMoreComplexLoop,
                expected: 8,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
