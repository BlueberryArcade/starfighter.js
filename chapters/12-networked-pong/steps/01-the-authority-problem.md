# The Authority Problem

Pong works on one screen with one keyboard. Now imagine two computers, each running their own copy of the game. Both show the ball. Both run physics. Both check collisions.

Within seconds, they'll disagree.

One machine runs slightly faster. The ball position drifts by a pixel. That pixel difference changes the bounce angle. A few seconds later, one player sees a point scored while the other sees a save. The game is broken — not because of a bug, but because two independent simulations can never stay perfectly in sync.

## The solution: one source of truth

Instead of running the game on both machines, run it on **one machine** — the server. The server is the authority. It owns the ball, the paddles, the score, the physics. The clients are just displays.

Each client does two things:
1. **Sends input** to the server (which keys are pressed)
2. **Receives state** from the server (where everything is) and draws it

The client never moves the ball. It never checks collisions. It never updates scores. It just renders what the server tells it. If the server says the ball is at `(400, 300)`, the client draws it there — even if its own calculations would put it somewhere else.

This is the **authoritative server model**. It's how every serious online game works, from Pong to first-person shooters. The server is always right.

## The trade-off

The downside is **latency**. The player presses a key. The input travels to the server. The server processes it. The new state travels back. There's a delay — maybe 10-50ms on a local network, 50-200ms over the internet. Production games hide this with client-side prediction (the client guesses what will happen and corrects itself later). We'll mention that technique at the end, but for now we'll use the simple model: send input, wait for state, draw.

On a local network, the delay is small enough that Pong plays fine without prediction.

## What we're building

```
Player 1's computer          Server              Player 2's computer
                            (Node.js)
  [Browser]                                        [Browser]
     |                         |                      |
     |--- input: "up" -------->|                      |
     |                         |--- state: {...} ---->|
     |<--- state: {...} -------|                      |
     |                         |<--- input: "down" ---|
     |                         |                      |
```

The server runs the game loop. Both clients send input. Both clients receive the same state. Both draw the same thing. In the next step, we'll build the server.
