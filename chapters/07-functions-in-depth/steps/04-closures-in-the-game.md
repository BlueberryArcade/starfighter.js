# Closures in the Game

Let's apply closures to a real problem: timed visual effects. Right now, when the boss enters, there's no fanfare. When a wave ends, the text disappears instantly. Let's build a system for timed screen messages using closures.

## A message system

Add this to `main.js`:

```js
const messages = [];

function showMessage(text, frames, color) {
  let remaining = frames;
  messages.push({
    draw: (ctx, canvas) => {
      const alpha = Math.min(1, remaining / 20);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.textAlign = 'center';
      ctx.fillStyle = color || '#ffffff';
      ctx.font = '36px monospace';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      ctx.restore();
      remaining = remaining - 1;
    },
    isDone: () => remaining <= 0
  });
}
```

`showMessage` creates an object with a `draw` method and an `isDone` check. Both close over `remaining`, `text`, and `color`. Each message manages its own countdown — no external timer needed.

The `Math.min(1, remaining / 20)` creates a fade-out: the message is fully opaque until the last 20 frames, then fades to transparent.

## Draw and clean up

In `loop()`, after everything else is drawn but before `requestAnimationFrame`:

```js
  for (let i = messages.length - 1; i >= 0; i--) {
    messages[i].draw(ctx, canvas);
    if (messages[i].isDone()) {
      messages.splice(i, 1);
    }
  }
```

## Use it

Replace the between-waves text with:

```js
if (betweenWaves && betweenWaveTimer === 179) {
  showMessage('WAVE ' + (currentWave + 1), 120, '#ffffff');
}
```

When the boss spawns:

```js
if (score >= 50 && !bossSpawned) {
  enemies.push(new Boss());
  bossSpawned = true;
  showMessage('WARNING', 90, '#ff3333');
  return;
}
```

When the boss is defeated, add inside the destruction check:

```js
showMessage('+50', 60, '#ffcc00');
```

## Why closures work here

Each call to `showMessage` creates a new closure with its own `remaining` counter. Three messages on screen at once have three independent countdowns. You didn't need an array of timer objects, or IDs to track which message is which. The closure *is* the state.

Compare this to the `hitFlash` variable from Chapter 5: a single `let hitFlash = 0` that you increment and decrement manually. That works for one effect. But if you wanted three overlapping flashes at different speeds, you'd need three variables. Closures scale without adding variables — each call creates its own.

## Try it

- Add a `showMessage('GAME OVER', 999, '#ff5555')` in the game-over section so the text fades on restart.
- Create a `showMessage` variant that draws at a specific position instead of screen centre — useful for floating score numbers above destroyed enemies.
- Try the `createParticle` factory from the previous step: spawn 20 particles at an enemy's death position and update/draw them alongside messages.
