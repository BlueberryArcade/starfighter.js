# Staying on Screen

Hold the arrow key long enough and the ship sails right off the edge. Let's fix that.

The solution is to **clamp** `shipX` after we move it — check whether it's gone out of bounds, and if so, snap it back to the limit. This is a perfect job for `if` statements.

## Clamping with `if`

Add this code **right after** the movement block from the previous step (still inside `loop()`, still before the drawing code):

```js
  // --- Keep the ship inside the canvas ---

  // The ship's triangle extends 15px to the left of shipX.
  // If shipX goes below 15, the left wing would go off screen.
  if (shipX < 15) {
    // Force shipX back to the minimum allowed value.
    shipX = 15;
  }

  // Similarly, the right wing extends 15px to the right.
  // canvas.width - 15 is the maximum allowed value.
  if (shipX > canvas.width - 15) {
    shipX = canvas.width - 15;
  }
```

Save and test. The ship now stops cleanly at both edges.

## Breaking down what's happening

On every frame:

1. The movement code tries to update `shipX`
2. The clamping code immediately checks the result
3. If `shipX` went out of bounds, it's corrected before anything is drawn

The ship can never be drawn in an invalid position because we fix the value before the drawing code runs.

## `if` / `else if` / `else`

So far we've used `if` on its own. You can chain multiple conditions with `else if`, and catch everything else with `else`:

```js
if (first condition) {
  // runs if the first condition is true
} else if (second condition) {
  // runs if the first was false AND this one is true
} else {
  // runs if none of the above were true
}
```

The chain stops as soon as one condition matches. For our clamping code, we use two **separate** `if` statements (not `else if`) because both edges need to be checked independently — if the canvas were very narrow, both could theoretically trigger in the same frame.

## Try it: different margins

The `15` we're using as the margin matches the half-width of the ship's triangle. Try changing the triangle size in the drawing code and see if you need to update the margin too. Understanding why those numbers are connected is good practice.

In the next step, we'll let the player fire lasers.

## A quick recap

Walk through your code so far. Make sure you understand each line. There are comments
throughout that you can read to help you understand what's there. Comments are
useful notes that programmers add to the code to help them read and understand it.

