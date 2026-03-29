# localStorage

Every time the page reloads, the score resets. There's no record of your best run. Let's save the high score so it persists across sessions.

## What is localStorage?

The browser provides a simple key-value store called `localStorage`. You give it a name and a value (always a string), and it saves it to disk. It survives page reloads, browser restarts, and even computer reboots. It's not a database — it's a sticky note the browser keeps for your site.

```js
localStorage.setItem('name', 'Wolfie');
const name = localStorage.getItem('name');  // 'Wolfie'
```

Two methods: `setItem` to save, `getItem` to read. That's it.

## Save the high score

In `main.js`, add a function:

```js
function getHighScore() {
  const saved = localStorage.getItem('starfighter-highscore');
  if (saved === null) return 0;
  return Number(saved);
}

function saveHighScore(score) {
  const current = getHighScore();
  if (score > current) {
    localStorage.setItem('starfighter-highscore', String(score));
  }
}
```

`localStorage` only stores strings. `Number(saved)` converts the string back to a number. `String(score)` converts the number to a string for storage. This conversion — back and forth between types — is necessary whenever you store non-string data.

## Check on game over

In `loop()`, inside the game-over block, save the score:

```js
  if (gameOver) {
    saveHighScore(score);
    // ... rest of game over drawing
  }
```

## Display it

In `drawHUD()`, add the high score:

```js
  const hi = getHighScore();
  ctx.fillText('High: ' + hi, canvas.width - 10, 30);
  ctx.textAlign = 'left';
```

Set `ctx.textAlign = 'right'` before drawing it so it's anchored to the right side:

```js
  ctx.textAlign = 'right';
  ctx.fillText('High: ' + hi, canvas.width - 10, 30);
  ctx.textAlign = 'left';
```

Save and play. Score some points, let the game end, then reload the page. The high score persists.

## Try it

- Beat your high score. Reload. It stays.
- Open the browser's DevTools (Cmd+Alt+I), go to the Application tab, and look under Local Storage. You can see the key and value directly.
- Try `localStorage.removeItem('starfighter-highscore')` in the console to reset it.
