# Keyboard Input

The loop is running. Now let's give the player something to do.

To make the ship respond to keys, we need two things:

1. A way to **track** which keys are currently held down
2. A way to **react** to that state on every frame

## Tracking keys

`keydown` events fire when a key is pressed and `keyup` events when it's released. We'll store the state of every key in a plain object called `keys`.

Add this code **above** your `loop` function:

```js
// keys is an object that tracks which keys are currently held down.
// When 'ArrowLeft' is held, keys['ArrowLeft'] is true.
// When it's released, it goes back to false (or undefined, which is also falsy).
const keys = {};

// 'keydown' fires the moment a key is pressed.
window.addEventListener('keydown', function(event) {
  // event.key is a string like 'ArrowLeft', 'ArrowRight', ' ', 'a', etc.
  keys[event.key] = true;
});

// 'keyup' fires the moment a key is released.
window.addEventListener('keyup', function(event) {
  keys[event.key] = false;
});
```

## Reacting in the loop

Now add a movement block **inside `loop()`**, just before the `ctx.save()` call:

```js
  // --- Move the ship ---
  // 'speed' controls how many pixels the ship moves per frame.
  const speed = 5;

  // An if statement runs its block only when the condition is true.
  // Here: if the left arrow key is currently held down, move the ship left.
  if (keys['ArrowLeft']) {
    shipX = shipX - speed;
  }

  // A separate if statement handles the right arrow key.
  if (keys['ArrowRight']) {
    shipX = shipX + speed;
  }
```

Save and try the arrow keys. The ship moves!

## What's an `if` statement?

An `if` statement is how code makes decisions. The condition inside the parentheses is evaluated — if it's `true`, the block in curly braces runs. If it's `false`, that block is skipped entirely.

```js
if (condition) {
  // this runs only when condition is true
}
```

Because `loop()` runs 60 times per second, this check happens 60 times per second too. As long as you hold the key, `keys['ArrowLeft']` is `true`, the condition passes, and `shipX` keeps decreasing.

## A note on `const` inside a loop

`const speed = 5;` is declared inside `loop()`. That's fine — `const` (and `let`) variables declared inside a function only exist for that one call of the function. The next frame creates a fresh one. For a simple number like speed that never changes, `const` is the right choice.

Try changing `speed` to `10` or `2` and see how the ship feels.

## Potential bugs

What happens if you hold a key down until the ship leaves the screen? In the next step we'll keep the ship from flying off into infinity and beyond.
