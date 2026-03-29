# Laser and Explosion

Let's build two sounds: a laser and an explosion. Each is a function that creates fresh audio nodes, plays them, and lets them clean themselves up.

## Laser sound

A laser is a high pitch that sweeps down quickly. Add this to `audio.js`:

```js
export function playLaser() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.type = 'square';
  osc.frequency.setValueAtTime(880, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.15);

  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.15);
}
```

Key differences from the test tone:

- **`osc.type = 'square'`** — changes the waveform from a smooth sine wave to a buzzy square wave. Sounds more electronic, more "game."
- **Frequency sweeps from 880 to 110** — that's a pitch drop of three octaves in 0.15 seconds. The sweep is what makes it sound like a laser instead of a beep.
- **Short duration (0.15s)** — snappy and quick.

## Explosion sound

An explosion isn't a tone — it's noise. We can't use an oscillator directly, but we can create noise by filling a buffer with random values:

```js
export function playExplosion() {
  const sampleRate = audioCtx.sampleRate;
  const duration = 0.3;
  const buffer = audioCtx.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;

  const gain = audioCtx.createGain();
  source.connect(gain);
  gain.connect(audioCtx.destination);

  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

  source.start();
}
```

This creates a buffer of random samples (white noise) where each sample is slightly quieter than the last (`* (1 - i / data.length)`) — so the noise decays naturally. The gain envelope fades it out on top of that.

## Wire them in

In `main.js`:

```js
import { playLaser, playExplosion } from './audio.js';
```

**Laser:** In `Ship.js`, import and call it in `fire()`:

```js
import { playLaser } from './audio.js';
```

At the top of the `fire()` method:

```js
  fire(projectiles) {
    playLaser();
    // ... rest of fire logic
  }
```

**Explosion:** In `main.js`, in `checkCollisions()`, when an enemy is destroyed:

```js
        if (destroyed) {
          playExplosion();
          // ... rest of destruction logic
        }
```

Save and play. Fire a laser — you hear a descending buzz. Destroy an enemy — a burst of static. The game immediately feels more alive.

## Try it

- Change the laser's `osc.type` to `'sawtooth'` — harsher, more aggressive.
- Change the starting frequency to `1200` — higher pitch, more frantic.
- Change the explosion duration to `0.6` — deeper, more rumbling.
- Try `osc.type = 'sine'` for a smoother, sci-fi feel.
