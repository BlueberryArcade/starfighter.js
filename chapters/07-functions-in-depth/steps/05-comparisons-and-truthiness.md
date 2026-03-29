# Comparisons and Truthiness

Before we move to recursion, let's clear up something you've been using without a full explanation: how comparisons and conditions work in JavaScript.

## `===` vs `==`

You've been using `===` (triple equals) throughout the tutorial:

```js
if (event.key === ' ') { ... }
if (this.phase === 'patrol') { ... }
```

JavaScript also has `==` (double equals). The difference:

- **`===` (strict equality)** — checks if two values are the same type *and* the same value. `5 === 5` is `true`. `5 === '5'` is `false` (number vs string).
- **`==` (loose equality)** — tries to convert the types before comparing. `5 == '5'` is `true` because the string `'5'` is converted to the number `5` first.

Always use `===`. Loose equality has surprising rules that cause bugs. `0 == ''` is `true`. `null == undefined` is `true`. `false == ''` is `true`. None of these make intuitive sense. Strict equality does exactly what it says: same type, same value.

The same applies to `!==` (strict not-equal) vs `!=` (loose not-equal). Use `!==`.

## Truthiness

`if` statements don't require a boolean (`true` or `false`). They work with any value:

```js
if (name) {
  console.log(`Hello, ${name}`);
}
```

If `name` is `'Wolfie'`, the block runs. If `name` is `''` (empty string), it doesn't. JavaScript treats certain values as "falsy" — they behave like `false` in a condition:

| Falsy values |
|-------------|
| `false` |
| `0` |
| `''` (empty string) |
| `null` |
| `undefined` |
| `NaN` |

Everything else is "truthy" — it behaves like `true`. This includes non-empty strings, non-zero numbers, arrays (even empty ones), and objects.

## Where you've used this

In the game, you've written:

```js
if (ship) {
  // safe to access ship.x
}
```

This works because `ship` starts as `null` (falsy). Once `setShip()` is called, it's an object (truthy). The `if` check protects against accessing properties on `null`, which would crash.

You've also written:

```js
const name = message.name || 'Anonymous';
```

The `||` (or) operator returns the first truthy value. If `message.name` is an empty string or `undefined`, it's falsy, so `||` moves to `'Anonymous'`. If `message.name` is `'Wolfie'`, it's truthy, and `||` returns it immediately.

## Short-circuit evaluation

Both `&&` and `||` **short-circuit** — they stop evaluating as soon as the result is known:

```js
// If ship is null, the right side never runs (no crash).
ship && ship.fire(projectiles);

// If name is truthy, 'Anonymous' is never evaluated.
const display = name || 'Anonymous';
```

This is why `&&` and `||` are safe to use as guards, not just inside `if` statements.

## Try it

- Try `console.log(0 == '')` and `console.log(0 === '')` in the browser console. See the difference.
- Check what `[] == false` returns. Then check `[] === false`. Loose equality is full of surprises.
