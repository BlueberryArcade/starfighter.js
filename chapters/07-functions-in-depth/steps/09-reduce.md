# Reduce

`map` transforms each element. `filter` selects elements. **`reduce`** combines all elements into a single value.

```js
const numbers = [3, 7, 2, 5];
const total = numbers.reduce((sum, n) => sum + n, 0);
// total is 17
```

The callback takes two arguments: the **accumulator** (the running result, starting at `0`) and the current element. Each call returns the new accumulator. After all elements are processed, the final accumulator is the result.

## Walking through it

```
Step 1: sum = 0,  n = 3  → returns 3
Step 2: sum = 3,  n = 7  → returns 10
Step 3: sum = 10, n = 2  → returns 12
Step 4: sum = 12, n = 5  → returns 17
```

The second argument to `reduce` (`0`) is the initial value. If you leave it out, the first element is used as the starting value — but it's clearer to always provide it.

## Uses in the game

**Total enemy HP on screen:**

```js
const totalHP = enemies.reduce((sum, e) => sum + e.hp, 0);
console.log('totalHP', totalHP);
```

This tells you how much firepower is needed to clear the screen — useful for tuning.

**Counting enemy types:**

```js
const shooterCount = enemies.reduce((count, e) => {
  return e.bullets ? count + 1 : count;
}, 0);
console.log('shooters', shooterCount);
```

**Finding the nearest enemy:**

```js
const nearest = enemies.reduce((closest, e) => {
  const d = Math.sqrt((e.x - ship.x) * (e.x - ship.x) + (e.y - ship.y) * (e.y - ship.y));
  return d < closest.dist ? { enemy: e, dist: d } : closest;
}, { enemy: null, dist: Infinity });
```

This walks through every enemy and keeps track of the one with the smallest distance. The accumulator is an object `{ enemy, dist }` — `reduce` can accumulate any type of value, not just numbers.

## When to use reduce

`reduce` is the most powerful of the three — you can implement `map` and `filter` using `reduce`. But that doesn't mean you should. Use it when you're combining many values into one:

- Summing numbers
- Finding a minimum or maximum
- Building an object from an array
- Counting things that match a condition

If you're producing an array of the same length, use `map`. If you're producing a shorter array, use `filter`. If you're producing a single value, use `reduce`.

## Try it

- Add a `console.log('totalHP', enemies.reduce(...))` line in the game loop and watch it in the watch panel as you destroy enemies.
- Use `reduce` to calculate the total score from a wave definition array: `wave.enemies.reduce((sum, e) => sum + e.count * ???, 0)` — what should `???` be?
