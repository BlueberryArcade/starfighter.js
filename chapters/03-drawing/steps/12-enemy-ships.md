# Enemy Ships

Comment out your ship. We're now going to design an enemy.

In Chapter 1 the enemy was a downward-pointing red triangle — same shape as the ship, flipped and recoloured. That works, but you can do better.

## Some ideas

**A hexagon.** Six evenly spaced points around a centre. Use the line tool and plot them roughly by feel — they don't have to be mathematically perfect.

**A wide saucer shape.** A flat ellipse-like polygon with a dome on top. Something like:

```
(-5.0,0.5) (-3.0,-1.0) (0.0,-1.5) (3.0,-1.0) (5.0,0.5) (3.0,1.5) (0.0,2.0) (-3.0,1.5)
```

**Something angular and mechanical.** Sharp points, asymmetric, geometric. Enemies don't need to look aerodynamic.

Use the rect tool to block out bounding shapes first, then trace the actual outline with the line tool.

## Colours

When you bring the enemy into the game, you'll set the fill colour in code. HTML colour names are just words — no hex codes needed for most common colours:

```js
ctx.fillStyle = 'crimson';
ctx.fillStyle = 'darkorange';
ctx.fillStyle = 'limegreen';
ctx.fillStyle = 'mediumpurple';
ctx.fillStyle = 'deepskyblue';
```

There are about 140 named colours in HTML. Most are what you'd expect: `red`, `blue`, `green`, `yellow`, `pink`, `cyan`, `magenta`, `white`, `black`, `gray`. And then the more expressive ones: `tomato`, `coral`, `goldenrod`, `slateblue`, `orchid`.

## Save your enemy coordinates

Same workflow as the ship: copy the coordinate string from the watch panel after filling the shape, before your next click. Paste it into a comment.

```js
// Enemy points: (-4.0,0.0) (-2.0,-2.0) (2.0,-2.0) (4.0,0.0) (2.0,2.0) (-2.0,2.0)
```

In Chapter 4, you'll use these in your enemy's `draw()` method.
