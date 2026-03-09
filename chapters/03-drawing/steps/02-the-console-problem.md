# The Console Problem

Games run in a loop — and so does anything that animates or responds to input over time. You've seen `requestAnimationFrame` before in Chapter 1. Let's add the same pattern here.

Add this below your Hello World drawing code:

```js
let frameCount = 0;

function loop() {
  frameCount++;
  console.log(frameCount);
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
```

Save and look at the console panel at the bottom of the screen. It fills up immediately — hundreds of lines per second, one per frame. `frameCount` is 60, 120, 300, 600... by the time you look at it. Scrolling up is useless because by the time you find the value, it's already changed a thousand times.

This is the console problem: **anything you log inside a game loop becomes noise.**

## A better way

There's a special behaviour built into this environment: if you call `console.log` with a **string as the first argument and a value as the second**, it shows up in the watch panel in the top-right corner instead of the console. The panel updates in place — no flood, just the latest value.

Replace the `console.log` line with this:

```js
console.log('frame', frameCount);
```

Save. The console panel goes quiet. The watch panel shows `frame = 603` (or whatever frame you're on), and it updates silently every frame. You can actually read it.

## What just happened?

`console.log` normally takes any number of arguments and prints them all. This environment intercepts the **two-argument, string-first** form and treats it as a named watch value:

```js
console.log('name', value)  // → watch panel
console.log(value)          // → console panel (normal)
console.log('message')      // → console panel (normal)
```

The first argument is the **name** — it labels the row in the watch panel. The second is the **value** — whatever you want to see.

You'll use this constantly throughout this chapter. Any time something changes every frame and you want to track it, `console.log('label', value)` is your tool.
