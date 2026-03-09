# Draw Your Ship

Now you have a proper drawing tool. Let's use it for something real.

In Chapter 1 and 2, the player's ship was a triangle — three points, simple but functional. In Chapter 4 you'll bring that ship into a new version of the game and make it your own. The coordinate string you copy from this tool is what you'll paste into your ship's draw code.

**Start by clearing your test shapes.** The shapes you've drawn so far are stored in the `shapes` and `rects` arrays inside `draw-tool.js`. Just refresh the page (`Cmd+R`) — a fresh load starts with empty arrays.

## Draw a triangle to start

Switch to the line tool (`l`), click three points to form a triangle pointing upward, then double-click to fill. A triangle centred around the origin, nose pointing up, might look like:

```
(0.0,-4.0) (-3.0,2.0) (3.0,2.0)
```

That's the same shape as Chapter 1's ship — nose at the top (negative y = up), wings at the bottom corners.

## Go further

The triangle is a starting point, not a requirement. Here are some directions to take it:

**Add laser cannons.** Draw two small rectangles extending from the wing tips.

**Galaga-style Y-shape.** An upside-down Y has a central body with two swept-back wings and a tail. Try plotting it: start at the nose `(0, -4)`, go to the fuselage midpoint `(0, 0)`, then branch to the left wing `(-4, 3)` and come back to branch to the right wing `(4, 3)`, return to centre and drop to the tail `(0, 4)`.

**Your own design.** It doesn't need to look like a spaceship. Use the rect tool to sketch bounding boxes, then switch to the line tool to trace the actual outline.

## Save your coordinates

When you have a shape you like, copy the coordinate string from the watch panel **before double-clicking** — or right after, before clicking again. Paste it into a comment at the top of `main.js` so you don't lose it:

```js
// Ship points: (0.0,-4.0) (-2.5,1.0) (-4.0,2.5) (0.0,1.5) (4.0,2.5) (2.5,1.0)
```

That comment is your source of truth. In Chapter 4, those numbers become `moveTo` and `lineTo` calls inside your ship's `draw()` method.

## A note on size

Your ship can be drawn as large as you want in this coordinate space. A ship that spans from `-5` to `5` on x and `-4` to `4` on y is perfectly reasonable here. When it appears in the game, you'll scale the coordinate system to fit — the ship's coordinates don't change, just the view.
