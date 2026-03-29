# Connecting Players

The server is running. Now the client needs to connect — and it needs to know *where* to connect.

On the same machine, the address is `localhost:4000`. On another computer on the same network, it's the server machine's local IP address. We'll add a connection screen where the player types the address.

## Find your local IP

The server machine needs to know its own IP address. In a terminal:

**Mac:**
```
ipconfig getifaddr en0
```

**Linux:**
```
hostname -I
```

**Windows:**
```
ipconfig
```
Look for the "IPv4 Address" under your active network adapter. It'll be something like `192.168.1.42`.

This is the address another computer on the same Wi-Fi will use to connect.

## Add a connection screen

In `projects/pong/index.html`, add this inside the `<body>`, before the canvas:

```html
<div id="connect-overlay">
  <div id="connect-box">
    <div id="connect-title">Connect to Server</div>
    <input id="server-input" type="text" value="localhost:4000" />
    <div id="connect-hint">On another computer, enter the host's IP (e.g. 192.168.1.42:4000)</div>
  </div>
</div>
```

Add styles in the `<head>`:

```html
<style>
  /* ... existing styles ... */
  #connect-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,0.85);
    display: flex; align-items: center; justify-content: center;
    font-family: monospace;
  }
  #connect-overlay.hidden { display: none; }
  #connect-box { text-align: center; }
  #connect-title {
    color: #a0aacc; font-size: 18px; margin-bottom: 16px;
  }
  #server-input {
    background: #1a1a2e; border: 1px solid rgba(255,255,255,0.2);
    border-radius: 4px; color: #e0e0e0; font-family: monospace;
    font-size: 18px; padding: 10px 14px; outline: none;
    text-align: center; width: 280px;
  }
  #server-input:focus { border-color: rgba(100,180,255,0.5); }
  #connect-hint {
    color: rgba(255,255,255,0.25); font-size: 12px; margin-top: 10px;
  }
</style>
```

## Update the client

Replace `src/main.js` with a version that connects after the user enters an address:

```js
import Player from './Player.js';
import { audioCtx, playHit, playScore, playWall } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('connect-overlay');
const serverInput = document.getElementById('server-input');

let socket = null;
let myPlayer = -1;
let gameState = null;

// --- Connection screen ---
serverInput.focus();
serverInput.select();

serverInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const address = serverInput.value.trim();
    if (address === '') return;
    connectToServer(address);
  }
});

function connectToServer(address) {
  overlay.className = 'hidden';
  socket = new WebSocket(`ws://${address}`);

  socket.addEventListener('open', () => {
    console.log('status', 'Connected');
  });

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);

    if (message.type === 'assign') {
      myPlayer = message.player;
      console.log('player', `Player ${myPlayer + 1}`);
    }

    if (message.type === 'state') {
      gameState = message.state;
    }

    if (message.type === 'full') {
      console.log('status', 'Server full');
    }
  });

  socket.addEventListener('close', () => {
    console.log('status', 'Disconnected');
    gameState = null;
    overlay.className = '';
    serverInput.focus();
  });
}

// --- Input ---
const keys = {};

window.addEventListener('keydown', (event) => {
  if (audioCtx.state === 'suspended') { audioCtx.resume(); }
  keys[event.key] = true;
  sendInput();
});

window.addEventListener('keyup', (event) => {
  keys[event.key] = false;
  sendInput();
});

function sendInput() {
  if (!socket || socket.readyState !== 1) return;

  let direction = 'none';
  if (keys['ArrowUp'] || keys['w']) { direction = 'up'; }
  if (keys['ArrowDown'] || keys['s']) { direction = 'down'; }

  socket.send(JSON.stringify({ type: 'input', direction: direction }));
}

// --- Render ---
function loop() {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!gameState) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Waiting for connection...', canvas.width / 2, canvas.height / 2);
    requestAnimationFrame(loop);
    return;
  }

  // Centre line
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Scores
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '64px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(String(gameState.scores[0]), canvas.width / 4, 70);
  ctx.fillText(String(gameState.scores[1]), canvas.width * 3 / 4, 70);

  // Ball
  const b = gameState.ball;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(b.x - b.size / 2, b.y - b.size / 2, b.size, b.size);

  // Paddles
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(20, gameState.paddles[0].y, 12, gameState.paddles[0].height);
  ctx.fillRect(canvas.width - 32, gameState.paddles[1].y, 12, gameState.paddles[1].height);

  // Waiting for opponent
  if (gameState.phase === 'waiting') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Waiting for Player 2...', canvas.width / 2, canvas.height / 2);
  }

  // Game over
  if (gameState.phase === 'over') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '48px monospace';
    ctx.textAlign = 'center';
    const winnerName = `Player ${gameState.winner + 1}`;
    ctx.fillText(`${winnerName} Wins!`, canvas.width / 2, canvas.height / 2);
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
```

## Test it

1. Start the server: `node projects/pong/server.js`
2. The right panel shows the connection screen. Press Enter (default is `localhost:4000`). You're Player 1.
3. Open a browser tab to `http://localhost:3001`. Enter `localhost:4000`. You're Player 2.
4. The game starts.

To play from another computer on the same Wi-Fi: open a browser on that machine, go to `http://<server-ip>:3001`, and enter `<server-ip>:4000` in the connection screen.
