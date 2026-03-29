# The Game Server

The chat server relayed messages between clients. The game server is different — it runs the *game*. It has its own loop, its own state, its own physics. Clients don't tell it what happened. They tell it what buttons are pressed, and the server decides what happens.

## Create `server.js`

Create (or replace) `projects/pong/server.js`:

```js
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ host: '0.0.0.0', port: 4000 });

// --- Game state ---
const state = {
  ball: { x: 400, y: 300, vx: 0, vy: 0, size: 8 },
  paddles: [
    { y: 260, height: 80 },
    { y: 260, height: 80 }
  ],
  scores: [0, 0],
  phase: 'waiting', // waiting, countdown, playing, scored, over
  servePause: 0,
  winner: -1
};

const paddleSpeed = 6;
const paddleWidth = 12;
const winScore = 5;

// Input from each player: 'up', 'down', or 'none'
const inputs = ['none', 'none'];

// --- Ball reset ---
function resetBall(direction) {
  state.ball.x = 400;
  state.ball.y = 300;
  state.ball.vx = 0;
  state.ball.vy = 0;
  state.servePause = 60;
  state.ball._serveDir = direction;
}

// --- Game loop (runs on server, not in browser) ---
function tick() {
  if (state.phase !== 'playing' && state.phase !== 'scored') return;

  // Serve pause
  if (state.servePause > 0) {
    state.servePause = state.servePause - 1;
    if (state.servePause === 0) {
      state.ball.vx = 4 * state.ball._serveDir;
      state.ball.vy = (Math.random() - 0.5) * 4;
      state.phase = 'playing';
    }
    return;
  }

  // Move paddles from input
  for (let i = 0; i < 2; i++) {
    if (inputs[i] === 'up') { state.paddles[i].y -= paddleSpeed; }
    if (inputs[i] === 'down') { state.paddles[i].y += paddleSpeed; }
    if (state.paddles[i].y < 0) { state.paddles[i].y = 0; }
    if (state.paddles[i].y + state.paddles[i].height > 600) {
      state.paddles[i].y = 600 - state.paddles[i].height;
    }
  }

  // Move ball
  state.ball.x += state.ball.vx;
  state.ball.y += state.ball.vy;

  // Bounce top/bottom
  if (state.ball.y - state.ball.size < 0 || state.ball.y + state.ball.size > 600) {
    state.ball.vy = -state.ball.vy;
  }

  // Paddle collision (left)
  checkPaddleHit(0, 20);
  // Paddle collision (right)
  checkPaddleHit(1, 800 - 20 - paddleWidth);

  // Scoring
  if (state.ball.x < 0) {
    state.scores[1]++;
    if (state.scores[1] >= winScore) {
      state.phase = 'over';
      state.winner = 1;
    } else {
      state.phase = 'scored';
      resetBall(1);
    }
  }
  if (state.ball.x > 800) {
    state.scores[0]++;
    if (state.scores[0] >= winScore) {
      state.phase = 'over';
      state.winner = 0;
    } else {
      state.phase = 'scored';
      resetBall(-1);
    }
  }
}

function checkPaddleHit(playerIndex, paddleX) {
  const p = state.paddles[playerIndex];
  const b = state.ball;
  if (
    b.x - b.size / 2 < paddleX + paddleWidth &&
    b.x + b.size / 2 > paddleX &&
    b.y - b.size / 2 < p.y + p.height &&
    b.y + b.size / 2 > p.y
  ) {
    b.vx = -b.vx * 1.05;
    const hitPoint = (b.y - p.y) / p.height;
    b.vy = (hitPoint - 0.5) * 8;
    if (b.vx > 0) {
      b.x = paddleX + paddleWidth + b.size / 2;
    } else {
      b.x = paddleX - b.size / 2;
    }
  }
}

// --- Run at 60fps ---
setInterval(() => {
  tick();
  broadcast({ type: 'state', state: state });
}, 1000 / 60);

// --- Networking ---
const players = [null, null];

function broadcast(message) {
  const json = JSON.stringify(message);
  for (const socket of players) {
    if (socket && socket.readyState === 1) {
      socket.send(json);
    }
  }
}

wss.on('connection', (socket) => {
  // Assign to first open slot.
  let playerIndex = -1;
  for (let i = 0; i < 2; i++) {
    if (players[i] === null) {
      players[i] = socket;
      playerIndex = i;
      break;
    }
  }

  if (playerIndex === -1) {
    socket.send(JSON.stringify({ type: 'full' }));
    socket.close();
    return;
  }

  console.log(`Player ${playerIndex + 1} connected`);
  socket.send(JSON.stringify({ type: 'assign', player: playerIndex }));

  // Start game when both players are connected.
  if (players[0] && players[1] && state.phase === 'waiting') {
    state.phase = 'scored'; // triggers serve pause
    resetBall(1);
    console.log('Game starting');
  }

  socket.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      if (message.type === 'input') {
        inputs[playerIndex] = message.direction;
      }
    } catch (err) {
      // ignore
    }
  });

  socket.on('close', () => {
    console.log(`Player ${playerIndex + 1} disconnected`);
    players[playerIndex] = null;
    inputs[playerIndex] = 'none';
    state.phase = 'waiting';
  });
});

console.log('Pong server running on ws://0.0.0.0:4000');
```

## Test it

Run in a terminal:

```
node projects/pong/server.js
```

The server starts its game loop immediately — `setInterval` calls `tick()` 60 times per second. It waits for two players before switching from `'waiting'` to playing.

Notice `host: '0.0.0.0'` — this means the server accepts connections from any network interface, not just `localhost`. This is what allows another computer on the same Wi-Fi to connect.

## What's different from the chat server

The chat server was passive — it received messages and forwarded them. This server is **active** — it runs a simulation. Every 16ms it updates the ball, checks collisions, and broadcasts the result. The clients are just viewers that happen to also send input.

The `players` array has exactly two slots. When both are filled, the game starts. When one disconnects, it pauses. This is a fundamentally different structure from the chat's open-ended connection list.
