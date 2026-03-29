# Sending Input

Look at what the client does now: it reads keyboard input, sends it to the server, and draws whatever the server sends back. The client never moves a paddle. It never touches the ball. It just renders.

This is a fundamental shift from everything you've built before. In Starfighter, the game loop owned everything — input, physics, drawing. Now the client only does two of those three things: input and drawing. Physics belongs to the server.

## What the client sends

```js
socket.send(JSON.stringify({ type: 'input', direction: 'up' }));
```

One message, one field. `'up'`, `'down'`, or `'none'`. The server doesn't need to know which key was pressed — it just needs to know the player's *intent*. Arrow keys and WASD both produce `'up'` or `'down'`. The client translates hardware input into a game action.

This separation matters. If you later add touch controls on a phone, or a gamepad, the message format doesn't change. The server never knows or cares what input device the player is using.

## What the server does with it

In `server.js`, the `inputs` array stores the latest direction for each player. The game loop reads it every frame:

```js
if (inputs[i] === 'up') { state.paddles[i].y -= paddleSpeed; }
if (inputs[i] === 'down') { state.paddles[i].y += paddleSpeed; }
```

The input is applied by the server, on the server's timeline. The client doesn't predict, doesn't interpolate — it just waits for the next state update.

## Both keys map to the same input

Notice in the client's `sendInput`:

```js
if (keys['ArrowUp'] || keys['w']) { direction = 'up'; }
if (keys['ArrowDown'] || keys['s']) { direction = 'down'; }
```

Either player can use either key set. Since the server tracks which *connection* sent the input, it doesn't matter which physical keys are pressed — the server applies the direction to the correct paddle based on the player index.

## Responsiveness

Press a key and watch the paddle move. There's a slight delay — the input has to travel to the server and the state has to come back. On `localhost`, this is under 1ms and imperceptible. On a local network, 5-20ms. Over the internet, it becomes noticeable.

For Pong, this is acceptable. For fast-paced games, you'd add client-side prediction — the client guesses the result of its own input immediately and corrects later when the server's version arrives. We won't implement that here, but you'll see it referenced in the final step.
