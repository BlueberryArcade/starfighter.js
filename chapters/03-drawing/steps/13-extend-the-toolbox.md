# Extend the Toolbox

You now have a rect tool and a polygon tool. The canvas has more drawing primitives — and you have everything you need to add them.

## Circles and ellipses

The canvas `arc` command draws circles and arcs. To draw a filled circle, you use the same `beginPath` / `arc` / `fill` pattern you used for the sun in step 1:

```js
ctx.beginPath();
ctx.arc(x, y, radius, 0, Math.PI * 2);
ctx.fill();
```

Inside the coordinate system (after `setupCoords`), `radius` is in world units — so `arc(0, 0, 2, 0, Math.PI * 2)` draws a circle of radius 2 centred at the origin.

For an ellipse, use `ctx.ellipse`:

```js
ctx.beginPath();
ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
ctx.fill();
```

`radiusX` is the half-width, `radiusY` is the half-height.

## Adding a circle tool

You could add a `'circle'` tool that works like the rect tool: `mousedown` records the centre, `mouseup` computes the radius from the distance between the two points and stores a circle in a `circles` array. The `drawTool` function in `draw-tool.js` would then draw each one.

The distance between two points `(x1, y1)` and `(x2, y2)` is:

```js
const radius = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
```

That's the same formula from Chapter 1's collision detection.

## Things to try

- Add a `'circle'` tool triggered by pressing `c`. Follow the same pattern as the rect tool but store `{ x, y, radius }` objects instead.
- Add an arc tool that lets you click three points to define an arc segment.
- Add an undo step: pressing `z` while in line mode removes the last point from `points`. Pressing `z` with no in-progress shape removes the last completed shape from `shapes`.

## Looking ahead

In Chapter 4 you'll take the coordinate strings you saved, the classes from Chapter 2, and the `coords.js` module you wrote here, and combine them into a version of the game that's truly yours — custom ship, custom enemies, and the tools to keep iterating on both.
