# Styling Messages

The chat works, but everything looks the same. Let's differentiate message types visually and introduce a cleaner way to apply styles.

## CSS classes

So far you've set styles directly on elements: `row.style.color = '#666'`. That works but gets repetitive. A better approach: define styles in the `<style>` block and apply them by name using **classes**.

Add these to the `<style>` block in `index.html`:

```css
.msg {
  padding: 4px 0;
  line-height: 1.5;
}
.msg-name {
  color: #64b5f6;
  font-weight: bold;
}
.msg-system {
  color: #666;
  font-style: italic;
}
.msg-self .msg-name {
  color: #56d364;
}
```

## Apply classes in JavaScript

In `client.js`, update `addMessage`:

```js
function addMessage(name, text, isSelf) {
  const row = document.createElement('div');
  row.className = 'msg';
  if (isSelf) {
    row.className = 'msg msg-self';
  }

  const nameSpan = document.createElement('span');
  nameSpan.className = 'msg-name';
  nameSpan.textContent = name + ': ';

  const textSpan = document.createElement('span');
  textSpan.textContent = text;

  row.appendChild(nameSpan);
  row.appendChild(textSpan);
  messages.appendChild(row);

  messages.scrollTop = messages.scrollHeight;
}
```

Update `addSystemMessage`:

```js
function addSystemMessage(text) {
  const row = document.createElement('div');
  row.className = 'msg msg-system';
  row.textContent = text;
  messages.appendChild(row);

  messages.scrollTop = messages.scrollHeight;
}
```

**`element.className`** sets the element's CSS class. When the browser sees `class="msg"` on an element, it applies all the styles defined under `.msg` in the `<style>` block. Multiple classes are separated by spaces: `'msg msg-self'` applies both `.msg` and `.msg-self`.

## Track your own name

To colour your own messages differently, you need to know which messages are yours. Add a variable at the top of `client.js`:

```js
let myName = 'Player';
```

Update the message handler to check:

```js
  if (message.type === 'chat') {
    addMessage(message.name, message.text, message.name === myName);
  }
```

Save. Your messages now have a green name. Other people's messages have a blue name. System messages are grey and italic.

## Why CSS classes?

Inline styles (`element.style.color = '...'`) work but scatter styling across your JavaScript. CSS classes keep styles in one place — the `<style>` block — and your JavaScript just assigns a name. If you want to change how system messages look, you change one line of CSS instead of finding every `addSystemMessage` call.

This is the same principle as separating game logic from drawing code: keep different concerns in different places.
