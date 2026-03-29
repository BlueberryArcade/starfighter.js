# Closures

In the last step, you wrote this:

```js
const pts = enemies[ei].points;
after(1, () => {
  console.log('scored', '+' + pts);
});
```

By the time the callback runs (one frame later), the loop has moved on. `ei` might be different. The enemy is already spliced out of the array. But the callback still correctly logs the right number of points. Why?

Because the arrow function **closes over** the variable `pts`. When a function is created, it captures a reference to every variable in its surrounding scope. Those variables stay alive as long as the function exists — even after the surrounding code has finished running. This captured environment is called a **closure**.

## Seeing it clearly

Here's a simpler example:

```js
function makeCounter() {
  let count = 0;
  return () => {
    count = count + 1;
    return count;
  };
}

const counter = makeCounter();
console.log(counter());  // 1
console.log(counter());  // 2
console.log(counter());  // 3
```

`makeCounter` runs once and returns a function. That returned function still has access to `count` — even though `makeCounter` has finished. Every call to `counter()` increments the *same* `count`. The variable lives on, held in the closure.

If you call `makeCounter` a second time, you get a *new* closure with its own separate `count`:

```js
const a = makeCounter();
const b = makeCounter();
console.log(a());  // 1
console.log(a());  // 2
console.log(b());  // 1  — b has its own count
```

## A factory function

Closures are especially useful for creating things that carry their own state. Let's build a particle factory:

```js
function createParticle(x, y, color) {
  let life = 30;
  let vx = (Math.random() - 0.5) * 4;
  let vy = (Math.random() - 0.5) * 4;

  return {
    update: () => {
      x = x + vx;
      y = y + vy;
      life = life - 1;
    },
    draw: (ctx) => {
      ctx.globalAlpha = life / 30;
      ctx.fillStyle = color;
      ctx.fillRect(x - 2, y - 2, 4, 4);
      ctx.globalAlpha = 1.0;
    },
    isDead: () => life <= 0
  };
}
```

`createParticle` returns an object with three methods. Those methods close over `x`, `y`, `vx`, `vy`, `life`, and `color`. No class, no `this`, no constructor — just a function that returns an object whose methods share access to the same set of variables.

You could use it like this:

```js
const p = createParticle(400, 300, '#ff8800');
// In the game loop:
p.update();
p.draw(ctx);
if (p.isDead()) { /* remove it */ }
```

This is an alternative to classes. Both work. Classes are better when you have inheritance and a clear type hierarchy (like enemies). Closures are better for lightweight, one-off objects where a full class feels like overkill.

## The closure in `after()`

Go back to the `after` function:

```js
function after(frames, fn) {
  timers.push({ frames: frames, fn: fn });
}
```

`fn` is a closure. It was created somewhere else and carries its captured variables with it. `after` doesn't know or care what those variables are — it just stores `fn` and calls it later. The closure handles the rest.

This is why closures matter: they let you create a function now that remembers its context and does the right thing later.
