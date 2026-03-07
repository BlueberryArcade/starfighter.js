# Getting Started

Welcome to **Starfighter.js** — a JavaScript tutorial where you'll build a 2D space shooter from scratch using the browser's Canvas API.

By the end of this tutorial you'll have a fully playable game with a ship, enemies, bullets, and a score. Let's go.

## Your workspace

You're looking at a split-screen setup:

- **Left** (here) — tutorial instructions
- **Right** — your game running live in the browser

Every time you save a file in VS Code, the right panel will update automatically and this window will come back into focus.

## The files

Open your editor and you'll see two files:

- `index.html` — the page that loads your game
- `src/main.js` — where you write your JavaScript

Take a look at `src/main.js`. Right now it just grabs the canvas element and sets up a drawing context — the starting point for everything we'll build.

## Your first task

The canvas is 800 × 600 pixels. Let's confirm it's working by filling it with the colour of space.

Add this to the bottom of `main.js`:

```js
ctx.fillStyle = '#0a0a1a';
ctx.fillRect(0, 0, canvas.width, canvas.height);
```

Save the file. The right panel should turn dark. That's your universe — empty for now, but not for long.
