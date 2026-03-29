# Saving Objects with JSON

`localStorage` only stores strings. A high score is a number that converts easily — `String(42)` and `Number('42')`. But what if you want to save something more complex, like a list of the top 5 scores with names?

## JSON

**JSON** (JavaScript Object Notation) is a text format for representing structured data. It looks almost exactly like JavaScript objects and arrays:

```json
[
  { "name": "Wolfie", "score": 120 },
  { "name": "Nova", "score": 95 },
  { "name": "Ace", "score": 80 }
]
```

JavaScript has two built-in functions for working with JSON:

- **`JSON.stringify(value)`** — converts a JavaScript value to a JSON string
- **`JSON.parse(string)`** — converts a JSON string back to a JavaScript value

```js
const data = [{ name: 'Wolfie', score: 120 }];
const text = JSON.stringify(data);
// text is '[{"name":"Wolfie","score":120}]'

const restored = JSON.parse(text);
// restored is [{ name: 'Wolfie', score: 120 }]
```

`stringify` turns objects and arrays into strings. `parse` turns strings back into objects and arrays. Together, they let you store any data structure in `localStorage`.

## A scoreboard

Replace the single high score with a top-5 leaderboard. In `main.js`:

```js
function getScoreboard() {
  const saved = localStorage.getItem('starfighter-scores');
  if (saved === null) return [];
  return JSON.parse(saved);
}

function addScore(name, score) {
  const board = getScoreboard();
  board.push({ name: name, score: score });

  // Sort by score, highest first.
  board.sort((a, b) => b.score - a.score);

  // Keep only the top 5.
  if (board.length > 5) {
    board.length = 5;
  }

  localStorage.setItem('starfighter-scores', JSON.stringify(board));
}
```

`board.sort((a, b) => b.score - a.score)` sorts the array by score in descending order. The callback returns a negative number when `b` should come first, which puts the highest score at index 0.

`board.length = 5` is a trick — setting an array's length to a smaller number truncates it, removing elements from the end.

## Save on game over

When the game ends, add the score:

```js
  if (gameOver) {
    addScore('Player', score);
    // ...
  }
```

For now we hardcode the name `'Player'`. In a later chapter with a chat interface, the player will have a real username.

## Display the leaderboard

Update the game-over screen to show the top scores. Inside the `gameOver` block in `loop()`, after the existing text:

```js
    const board = getScoreboard();
    ctx.font = '16px monospace';
    ctx.fillStyle = '#aaaaaa';
    for (let i = 0; i < board.length; i++) {
      const entry = (i + 1) + '. ' + board[i].name + ' — ' + board[i].score;
      ctx.fillText(entry, canvas.width / 2, canvas.height / 2 + 100 + i * 24);
    }
```

## What JSON can't store

JSON handles objects, arrays, strings, numbers, booleans, and `null`. It **cannot** store:

- Functions
- `undefined`
- Class instances (the class identity is lost — you get a plain object back)
- Circular references (an object that refers to itself)

This means you can't just `JSON.stringify(ship)` and get a working Ship object back. You'd get a plain object with the right properties but no methods. Saving and restoring game state requires converting to and from plain data deliberately — which is a topic for another chapter.

## Try it

- Play a few rounds. Check the game-over screen — your scores accumulate across reloads.
- Open DevTools and look at the `starfighter-scores` key in localStorage. You can see the raw JSON.
- Edit the JSON in DevTools to add a fake score and reload — it appears on the leaderboard.
