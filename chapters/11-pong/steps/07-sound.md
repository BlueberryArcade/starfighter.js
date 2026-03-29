# Sound

Let's reuse the sound factory from Chapter 8. The game needs two sounds: a blip when the ball hits a paddle, and a lower tone when someone scores.

## Copy the sound factory

You could import from `../../games/your-first-game/src/audio.js`, but that's a fragile cross-project dependency. Instead, create a local `src/audio.js` with just what Pong needs:

```js
const audioCtx = new AudioContext();

export { audioCtx };

export function createSound({ type, startFreq, endFreq, duration, volume }) {
  return () => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = type || 'square';
    osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(volume || 0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  };
}

export const playHit = createSound({
  type: 'square',
  startFreq: 660,
  endFreq: 440,
  duration: 0.06,
  volume: 0.12
});

export const playScore = createSound({
  type: 'sine',
  startFreq: 220,
  endFreq: 110,
  duration: 0.3,
  volume: 0.15
});

export const playWall = createSound({
  type: 'triangle',
  startFreq: 440,
  endFreq: 330,
  duration: 0.04,
  volume: 0.08
});
```

Three sounds: a short blip for paddle hits, a deeper tone for scoring, and a quiet tap for wall bounces.

## Wire them in

In `main.js`:

```js
import { audioCtx, playHit, playScore, playWall } from './audio.js';
```

Resume the audio context on first keypress (same pattern from Chapter 8):

```js
window.addEventListener('keydown', (event) => {
  if (audioCtx.state === 'suspended') { audioCtx.resume(); }
  keys[event.key] = true;
  // ...
});
```

In `checkPaddleCollision`, after reversing `ball.vx`:

```js
    playHit();
```

In the top/bottom bounce check:

```js
  if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
    ball.vy = -ball.vy;
    playWall();
  }
```

In both scoring blocks, after incrementing the score:

```js
    playScore();
```

Save and play. Every hit, bounce, and score has audio feedback. The game feels complete.

## The pattern

This is the same `createSound` factory from Chapter 8 — a closure that returns a play function. You've now used it across two different projects. The factory doesn't know anything about Pong or Starfighter. It just takes parameters and returns a function. That's reusability in practice.
