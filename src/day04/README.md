# 🎄 Advent of Code 2023 - day 4 🎄

## Info

Task description: [link](https://adventofcode.com/2023/day/4)

## Notes

When splitting on spaces for a string containing numbers, use the regex version of split to match one or more spaces (and avoid empty values in the resulting array). e.g. `str.split(/\s+/)`

```js
'12  4 98'.split(' ');      // 😦 [ '12', '', '4', '98' ]
'12  4 98'.split(/\s+/);    // 😄 [ '12', '4', '98' ]
```

I could have solved this with a single regular expression, but I'm not sure if the solution is any clearer.

```js
const input = 'Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1';

const regex = /Card (\d+):((?:\s+\d+)+)\s+\|\s+((?:\d+\s*)+)/g;
const matches = [...input.matchAll(regex)];

const cardNumber = matches[0][1];
const numbersBeforePipe = matches[0][2].trim().split(/\s+/).map(Number);
const numbersAfterPipe = matches[0][3].trim().split(/\s+/).map(Number);

console.log(cardNumber); // Output: 3
console.log(numbersBeforePipe); // Output: [1, 21, 53, 59, 44]
console.log(numbersAfterPipe); // Output: [69, 82, 63, 72, 16, 21, 14, 1]
```
