# Recursion: Fractal Tree

Time for a detour. We're going to step outside the game and draw something on a blank canvas — a tree that grows branches, where each branch grows smaller branches, where each of those grows even smaller branches.

This is **recursion**: a function that calls itself.

## Set up

For this step, temporarily replace your `loop()` body with a single static drawing (or create a test file — up to you). We just need a blank canvas and `ctx`.

## The function

```js
function drawBranch(x, y, length, angle, depth) {
  if (depth <= 0) return;

  const endX = x + Math.cos(angle) * length;
  const endY = y + Math.sin(angle) * length;

  ctx.strokeStyle = depth > 2 ? 'saddlebrown' : 'green';
  ctx.lineWidth = depth;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Grow two smaller branches from the end of this one.
  drawBranch(endX, endY, length * 0.7, angle - 0.4, depth - 1);
  drawBranch(endX, endY, length * 0.7, angle + 0.4, depth - 1);
}
```

Call it once to draw the tree:

```js
ctx.fillStyle = '#0a0a1a';
ctx.fillRect(0, 0, canvas.width, canvas.height);
drawBranch(canvas.width / 2, canvas.height, 120, -Math.PI / 2, 10);
```

Save. A tree appears. Brown trunk, green tips, branching at every level.

## How it works

`drawBranch` draws a line from `(x, y)` to `(endX, endY)`, then calls itself twice — once angled left, once angled right — with a shorter length and a reduced `depth`.

The **base case** is `if (depth <= 0) return`. Without it, the function would call itself forever. The base case is what stops the recursion — when the branches are too small to matter, we stop.

Each call creates its own `x`, `y`, `length`, `angle`, and `depth` — local variables in their own scope. The function doesn't need to track state across calls. Each level is self-contained.

## The pattern

Every recursive function has two parts:

1. **Base case** — when to stop. Without it, you get infinite recursion (and a crash).
2. **Recursive case** — do something, then call yourself with a smaller or simpler version of the problem.

For the tree: the base case is `depth <= 0`. The recursive case is "draw a line, then grow two branches that are shorter and shallower."

## Try it

- Change `0.4` (the branch angle) to `0.6` — the tree spreads wider.
- Change `0.7` (the length multiplier) to `0.8` — branches stay longer, the tree gets denser.
- Add a third `drawBranch` call — the tree becomes bushier.
- Add `Math.random() * 0.2` to the angle — no two branches are the same.
- Increase depth to 12 or 14 — the tree gets more detailed (but slower to draw).

## Why this matters

Recursion solves problems where the structure is **self-similar** — the whole looks like the parts. Trees, file systems, nested menus, HTML elements inside other elements, mathematical sequences, search algorithms. Anywhere a big problem breaks down into smaller versions of itself, recursion is the natural tool.

When you're done exploring, restore your game loop. In the next step we'll use recursion inside the game.
