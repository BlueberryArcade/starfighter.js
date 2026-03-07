# Drawing the Ship

Now that we have a dark background, let's put a ship on it.

We'll draw the ship as a triangle using canvas **paths** — a way of connecting a series of points to make shapes.

## How paths work

Drawing a path always follows the same pattern:

```js
ctx.beginPath();   // start a new shape
ctx.moveTo(x, y);  // lift the pen and move to a point
ctx.lineTo(x, y);  // draw a line to a new point
ctx.closePath();   // connect back to the start
ctx.fill();        // fill it with colour
```

## Draw your ship

Add this to `main.js` after the background fill:

```js
const shipX = canvas.width / 2;
const shipY = canvas.height / 2;

ctx.fillStyle = '#00e5ff';
ctx.beginPath();
ctx.moveTo(shipX, shipY - 20);      // nose
ctx.lineTo(shipX - 15, shipY + 15); // bottom-left
ctx.lineTo(shipX + 15, shipY + 15); // bottom-right
ctx.closePath();
ctx.fill();
```

Save the file. You should see a cyan triangle in the middle of your dark canvas.

## What those numbers mean

- `shipX` and `shipY` are the centre of the canvas — the ship's anchor point
- The three `moveTo`/`lineTo` calls plot the three corners of the triangle
- Negative `y` goes **up** on a canvas (the top-left is `0, 0`)

Try changing the numbers and see what happens. Can you make the ship taller? Wider? Point it sideways?
