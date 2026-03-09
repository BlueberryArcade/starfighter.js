# Hello World

Welcome to Chapter 3. This chapter is a detour from the game — but a purposeful one. Before we can make our Starfighter look the way we want, we need to get comfortable with the canvas as a drawing surface. By the end of this chapter you'll have built your own drawing tool and used it to design the ships that go into Chapter 4.

This chapter starts completely fresh. Open `src/main.js` and you'll see it's nearly empty — just the canvas and context setup. That's your blank slate.

## Three ways to draw

The canvas gives you three basic drawing tools you'll use constantly:

- **`fillRect(x, y, width, height)`** — fills a rectangle with the current colour
- **`arc(x, y, radius, startAngle, endAngle)`** — draws a circle or arc
- **`fillText(text, x, y)`** — draws text

Let's use all three to build a simple scene: a blue sky, brown ground, a yellow sun, and some red text.

## The sky and ground

Add this to `main.js` below the first two lines:

```js
// Fill the whole canvas with sky blue.
ctx.fillStyle = 'dodgerblue';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Draw a brown strip across the bottom quarter.
ctx.fillStyle = 'saddlebrown';
ctx.fillRect(0, canvas.height * 0.75, canvas.width, canvas.height * 0.25);
```

Save the file. You should see a blue sky and brown ground. The `fillRect` arguments are `x, y, width, height` — so the ground starts 75% of the way down and fills the remaining 25%.

## The sun

```js
// Draw a yellow circle in the upper-left.
ctx.fillStyle = 'gold';
ctx.beginPath();
ctx.arc(120, 100, 60, 0, Math.PI * 2);
ctx.fill();
```

`arc(x, y, radius, startAngle, endAngle)` draws a circle when you go from angle `0` to `Math.PI * 2` (a full rotation). The sun is centred at `(120, 100)` with a radius of 60 pixels.

## The text

```js
// Draw "Hello" and "World" centred on the canvas.
ctx.fillStyle = 'red';
ctx.font = 'bold 72px monospace';
ctx.textAlign = 'center';
ctx.fillText('Hello', canvas.width / 2, canvas.height / 2 - 20);
ctx.fillText('World', canvas.width / 2, canvas.height / 2 + 70);
```

`textAlign = 'center'` means the `x` coordinate in `fillText` is treated as the horizontal centre of the text, not the left edge. Two separate `fillText` calls stack the words vertically.

Save the file. You should see a complete scene.

## Try it

- Change `'dodgerblue'` to `'midnightblue'` or `'skyblue'` — HTML colour names are just words.
- Move the sun to a different position.
- Change the font size or the text itself.

In the next step we'll add a game loop and meet our first debugging tool.
