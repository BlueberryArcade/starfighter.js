# Grabbing Elements

In Chapter 1, the first thing you did was grab the canvas:

```js
const canvas = document.getElementById('game');
```

The same pattern works for any HTML element. The `id` attribute in HTML gives the element a name, and `document.getElementById` finds it from JavaScript.

## Wire up the input

Open `src/client.js` and replace everything with:

```js
const messages = document.getElementById('messages');
const input = document.getElementById('input');
const sendBtn = document.getElementById('send');

function handleSend() {
  const text = input.value.trim();
  if (text === '') return;

  console.log('message', text);
  input.value = '';
  input.focus();
}

sendBtn.addEventListener('click', handleSend);

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleSend();
  }
});
```

Save. Type something in the input field and press Enter (or click Send). The watch panel shows `message = whatever you typed`. The input clears and refocuses, ready for the next message.

## What's familiar

- **`addEventListener`** — same as keyboard and mouse events in the game.
- **`event.key === 'Enter'`** — same key check as the spacebar for firing.
- **Arrow function** — same syntax from Chapter 7.

## What's new

- **`input.value`** — the current text in the input field. Reading it gives you the string the user typed. Setting it to `''` clears the field.
- **`.trim()`** — removes whitespace from both ends of a string. `'  hello  '.trim()` gives `'hello'`. This prevents sending blank messages made of only spaces.
- **`input.focus()`** — moves the cursor back into the input field. Without it, clicking the Send button would leave focus on the button and the user would need to click the input again.

## The `document` object

`document` is the browser's representation of the entire page. Every HTML element you wrote in `index.html` becomes an object inside `document`. `getElementById` searches the tree and returns the matching element.

This tree of objects is called the **DOM** (Document Object Model). When you change an element's properties — its text, its style, its children — the browser updates the page immediately. You've been doing this with the canvas context (`ctx`). The DOM is the same idea, applied to HTML elements instead of pixels.

## Try it

- Type a message and check the watch panel — it updates each time you send.
- Try sending an empty message (just spaces) — the `trim()` check prevents it.
- Add `console.log('length', messages.children.length)` after `handleSend()` — it shows 0 because we haven't added any child elements to the messages container yet. That's next.
