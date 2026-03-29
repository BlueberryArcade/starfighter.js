# Username Prompt

Everyone connects as "Player." Let's ask for a name first.

## Add the overlay HTML

In `index.html`, add this inside `<div id="app">`, before `<div id="messages">`:

```html
    <div id="name-overlay">
      <div id="name-box">
        <div id="name-title">Enter your name</div>
        <input id="name-input" type="text" placeholder="Your name..." maxlength="20" />
      </div>
    </div>
```

Add styles:

```css
#name-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
#name-overlay.hidden {
  display: none;
}
#name-box {
  background: #1a1a2e;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  padding: 24px;
  text-align: center;
}
#name-title {
  font-size: 16px;
  margin-bottom: 12px;
  color: #a0aacc;
}
#name-input {
  background: #0a0a1a;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 4px;
  color: #e0e0e0;
  font-family: monospace;
  font-size: 16px;
  padding: 8px 12px;
  outline: none;
  width: 200px;
  text-align: center;
}
#name-input:focus {
  border-color: rgba(100,180,255,0.5);
}
```

## Wire it up in JavaScript

In `client.js`, grab the overlay elements and delay the connection until the user enters a name:

```js
const nameOverlay = document.getElementById('name-overlay');
const nameInput = document.getElementById('name-input');

let myName = '';
let socket = null;

nameInput.focus();

nameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const name = nameInput.value.trim();
    if (name === '') return;

    myName = name;
    nameOverlay.className = 'hidden';
    input.focus();

    connectToServer();
  }
});
```

## Extract the connection logic

Move the WebSocket code into a function:

```js
function connectToServer() {
  socket = new WebSocket('ws://localhost:4000');

  socket.addEventListener('open', () => {
    socket.send(JSON.stringify({ type: 'join', name: myName }));
    console.log('status', 'Connected as ' + myName);
  });

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);

    if (message.type === 'chat') {
      addMessage(message.name, message.text, message.name === myName);
    }
    if (message.type === 'system') {
      addSystemMessage(message.text);
    }
  });

  socket.addEventListener('close', () => {
    console.log('status', 'Disconnected');
  });
}
```

Update `handleSend` to check that `socket` exists:

```js
function handleSend() {
  const text = input.value.trim();
  if (text === '' || !socket || socket.readyState !== 1) return;

  socket.send(JSON.stringify({ type: 'chat', text: text }));
  input.value = '';
  input.focus();
}
```

Save and reload. A dark overlay appears asking for your name. Type it, press Enter — the overlay disappears, the connection opens, and "YourName joined" appears in the chat.

## Try it

- Open two tabs. Enter different names. Send messages between them — each shows the correct name.
- Press Enter with an empty name — nothing happens (the `trim()` check prevents it).
