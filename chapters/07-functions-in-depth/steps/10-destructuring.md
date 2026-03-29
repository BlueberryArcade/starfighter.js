# Destructuring

Throughout the tutorial you've accessed object properties one at a time:

```js
const name = message.name;
const text = message.text;
const type = message.type;
```

JavaScript has a shorthand for this called **destructuring** — pulling values out of an object (or array) into variables in one line.

## Object destructuring

```js
const { name, text, type } = message;
```

This creates three variables — `name`, `text`, and `type` — and assigns them the matching properties from `message`. It's exactly equivalent to the three-line version above, just shorter.

The variable names must match the property names. If they don't exist on the object, they're `undefined`.

## Where it helps

Look at the `after()` callback from earlier:

```js
const pts = enemies[ei].points;
const ex = enemies[ei].x;
const ey = enemies[ei].y;
```

With destructuring:

```js
const { x: ex, y: ey, points: pts } = enemies[ei];
```

The `x: ex` syntax means "take the `x` property and store it in a variable called `ex`." This is useful when the property name doesn't match the variable name you want.

## In function parameters

Destructuring works directly in function parameters. You've already seen this pattern without knowing its name — `BaseEnemy`'s constructor:

```js
constructor(x, y, { speed, radius, hp, points }) {
```

The third argument is an object, and `{ speed, radius, hp, points }` pulls out four properties into four local variables. Without destructuring, you'd write:

```js
constructor(x, y, config) {
  this.speed = config.speed;
  this.radius = config.radius;
  // ...
}
```

The destructured version is cleaner and makes the expected shape of the argument visible in the function signature.

## Array destructuring

The same idea works for arrays, using square brackets:

```js
const [first, second, third] = [10, 20, 30];
// first is 10, second is 20, third is 30
```

A practical use — swapping two variables without a temporary:

```js
let a = 1;
let b = 2;
[a, b] = [b, a];
// a is 2, b is 1
```

## Try it

- Find a place in your game code where you access multiple properties from the same object (like `enemies[i].x`, `enemies[i].y`) and try destructuring them into local variables.
- In the collision check, try: `const { x, y } = projectiles[bi]` at the top of the loop body to simplify the `dx`/`dy` calculations.
