# Tracking the Mouse

The mouse fires events just like the keyboard does. The one you'll use most is `mousemove` — it fires continuously as the cursor moves over an element. Add these listeners below your loop code:

```js
canvas.addEventListener('mousemove', function(event) {
  console.log('mouse', event.offsetX + ', ' + event.offsetY);
});

canvas.addEventListener('mousedown', function(event) {
  console.log('click', event.offsetX + ', ' + event.offsetY);
});
```

Save and move your mouse over the canvas. The watch panel shows two rows updating live: `mouse` tracking every position, `click` updating each time you press down. Move your mouse to the corners — you can feel the coordinate system: `0, 0` is the top-left, `800, 0` is the top-right, `0, 600` is the bottom-left.

## Strings and numbers

Take a close look at what we're logging:

```js
console.log('mouse', event.offsetX + ', ' + event.offsetY);
```

The first argument — `'mouse'` — is in quotes. That makes it a **string**: a sequence of text characters. Strings in JavaScript are always wrapped in single or double quotes. They represent words, labels, messages, anything made of characters.

The second argument — `event.offsetX + ', ' + event.offsetY` — is also a string, but one built by joining pieces together. `event.offsetX` is a **number** (no quotes, just a value). When you use `+` between a number and a string, JavaScript converts the number to text and glues them together. So if `offsetX` is 412 and `offsetY` is 293, the result is the string `'412, 293'`.

The distinction matters: numbers can do math. Strings can't. `412 + 10` gives `422`. `'412' + 10` gives `'41210'`. You'll bump into this occasionally — and now you know why.

## Try it

- Move your mouse to the exact center of the canvas. What coordinates do you expect? What do you get?
- Click in the top-left corner, then the bottom-right. Note the values in the watch panel.
- Try logging just `event.offsetX` (a raw number, not joined into a string) and compare how the watch panel displays it.

In the next step we'll use these coordinates to start drawing on the canvas.
