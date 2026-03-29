# Building with Callbacks

Now that you know functions can be passed around, let's build some useful tools with that idea.

## repeat(n, fn)

A function that calls another function `n` times:

```js
function repeat(n, fn) {
  for (let i = 0; i < n; i++) {
    fn(i);
  }
}
```

Usage:

```js
repeat(5, (i) => {
  console.log('Star ' + i);
});
```

`repeat` doesn't know what `fn` does. It just calls it. The caller decides the behaviour by passing a different function each time. This is the power of higher-order functions — they separate the *structure* (do something N times) from the *content* (what to do).

## after(frames, fn)

A timer that counts down and fires a callback. This is useful for delayed events in the game — showing a message for a few seconds, or triggering something after a pause.

Add this to `main.js`:

```js
const timers = [];

function after(frames, fn) {
  timers.push({ frames: frames, fn: fn });
}

function updateTimers() {
  for (let i = timers.length - 1; i >= 0; i--) {
    timers[i].frames = timers[i].frames - 1;
    if (timers[i].frames <= 0) {
      timers[i].fn();
      timers.splice(i, 1);
    }
  }
}
```

Call `updateTimers()` at the top of `loop()`.

Now you can write:

```js
after(180, () => {
  console.log('3 seconds later!');
});
```

The arrow function `() => { ... }` is the callback. It's stored inside the timer object and called when the countdown reaches zero. You don't call it — `updateTimers` does, at the right time.

## Using it in the game

Try this in `checkCollisions()`, when an enemy is destroyed:

```js
if (destroyed) {
  score = score + enemies[ei].points;

  // Flash a score popup after a brief delay.
  const pts = enemies[ei].points;
  const ex = enemies[ei].x;
  const ey = enemies[ei].y;

  after(1, () => {
    console.log('scored', '+' + pts + ' at (' + Math.round(ex) + ',' + Math.round(ey) + ')');
  });

  enemies.splice(ei, 1);
}
```

The watch panel briefly shows the points earned and where. Notice that the callback uses `pts`, `ex`, and `ey` — variables that were defined *outside* the arrow function. How does the callback still have access to them after the surrounding code has finished running?

That's a **closure**. We'll look at it properly in the next step.
