# Sending and Receiving

The input works. The server from Chapter 9 is ready. Let's connect them and make messages appear on screen.

## Start the server

Open a terminal and run:

```
node projects/chat/server.js
```

If you haven't changed it since Chapter 9, it's the version with the `clients` Map, broadcast, and structured messages. Leave it running.

## Connect from the client

Update `src/client.js`. Add the connection at the top, after the element references:

```js
const messages = document.getElementById('messages');
const input = document.getElementById('input');
const sendBtn = document.getElementById('send');

const socket = new WebSocket('ws://localhost:4000');

socket.addEventListener('open', () => {
  socket.send(JSON.stringify({ type: 'join', name: 'Player' }));
  console.log('status', 'Connected');
});

socket.addEventListener('close', () => {
  console.log('status', 'Disconnected');
});
```

## Send chat messages

Update `handleSend` to send through the socket instead of just logging:

```js
function handleSend() {
  const text = input.value.trim();
  if (text === '' || socket.readyState !== 1) return;

  socket.send(JSON.stringify({ type: 'chat', text: text }));
  input.value = '';
  input.focus();
}
```

`socket.readyState !== 1` prevents sending when the connection isn't open.

## Display incoming messages

This is where you create HTML elements from JavaScript for the first time. When a message arrives, you need to create a new `<div>`, put text in it, and add it to the messages container.

```js
function addMessage(name, text) {
  const row = document.createElement('div');
  row.style.padding = '4px 0';

  const nameSpan = document.createElement('span');
  nameSpan.textContent = name + ': ';
  nameSpan.style.color = '#64b5f6';
  nameSpan.style.fontWeight = 'bold';

  const textSpan = document.createElement('span');
  textSpan.textContent = text;

  row.appendChild(nameSpan);
  row.appendChild(textSpan);
  messages.appendChild(row);

  messages.scrollTop = messages.scrollHeight;
}

function addSystemMessage(text) {
  const row = document.createElement('div');
  row.style.padding = '4px 0';
  row.style.color = '#666';
  row.style.fontStyle = 'italic';
  row.textContent = text;
  messages.appendChild(row);

  messages.scrollTop = messages.scrollHeight;
}
```

**`document.createElement('div')`** creates a new `<div>` element — but it's not on the page yet. It exists only in memory.

**`row.appendChild(nameSpan)`** puts the name span inside the row. **`messages.appendChild(row)`** puts the row inside the messages container. Only when an element is appended to something already on the page does it become visible.

**`messages.scrollTop = messages.scrollHeight`** scrolls to the bottom so the latest message is visible.

## Handle incoming messages

```js
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);

  if (message.type === 'chat') {
    addMessage(message.name, message.text);
  }

  if (message.type === 'system') {
    addSystemMessage(message.text);
  }
});
```

Save. Type a message and press Enter. It appears in the chat — your name in blue, the text in white. The system message "Player joined" appears in grey italics at the top.

Open a second browser tab to `http://localhost:3001`. Send a message from one — it appears in both.

## What just happened

Two programs are talking through a third. The client sends JSON to the server. The server broadcasts it to every client. Each client creates HTML elements and appends them to the page. The chat works.
