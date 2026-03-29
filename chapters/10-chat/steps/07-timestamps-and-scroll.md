# Timestamps and Scroll

Two small improvements that make the chat feel polished: timestamps on messages and smarter scrolling.

## Timestamps

JavaScript's `Date` object gives you the current time. To format it as a clock time:

```js
function formatTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return hours + ':' + minutes;
}
```

`padStart(2, '0')` ensures single-digit numbers get a leading zero: `9` becomes `'09'`.

Add a timestamp to `addMessage`:

```js
function addMessage(name, text, isSelf) {
  const row = document.createElement('div');
  row.className = isSelf ? 'msg msg-self' : 'msg';

  const time = document.createElement('span');
  time.className = 'msg-time';
  time.textContent = formatTime() + ' ';

  const nameSpan = document.createElement('span');
  nameSpan.className = 'msg-name';
  nameSpan.textContent = name + ': ';

  const textSpan = document.createElement('span');
  textSpan.textContent = text;

  row.appendChild(time);
  row.appendChild(nameSpan);
  row.appendChild(textSpan);
  messages.appendChild(row);

  autoScroll();
}
```

Add the style in `index.html`:

```css
.msg-time {
  color: rgba(255,255,255,0.2);
  font-size: 12px;
}
```

## Smart scrolling

Right now `messages.scrollTop = messages.scrollHeight` forces the chat to the bottom on every message. That's annoying if you're reading old messages — each new message yanks you back down.

The fix: only auto-scroll if the user is already near the bottom.

```js
function autoScroll() {
  const threshold = 50;
  const isNearBottom = messages.scrollHeight - messages.scrollTop - messages.clientHeight < threshold;

  if (isNearBottom) {
    messages.scrollTop = messages.scrollHeight;
  }
}
```

Three properties:

- **`scrollHeight`** — the total height of all content, including content scrolled out of view
- **`scrollTop`** — how far the user has scrolled down from the top
- **`clientHeight`** — the visible height of the container

If `scrollHeight - scrollTop - clientHeight` is small (less than 50 pixels), the user is near the bottom and we scroll. If they've scrolled up to read something, we leave them alone.

Replace the `messages.scrollTop = messages.scrollHeight` line in `addSystemMessage` with `autoScroll()` too.

## Try it

- Send a bunch of messages to fill the chat. Scroll up halfway. Have another tab send a message — you stay where you are. Scroll back to the bottom — new messages auto-scroll again.
- Watch the timestamps — they update with each message. Messages sent in the same minute share a timestamp.
