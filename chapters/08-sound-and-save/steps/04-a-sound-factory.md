# A Sound Factory

Look at the five sound functions. They all follow the same structure: create oscillator, create gain, connect them, set frequency, set envelope, start, stop. The differences are just parameters.

In Chapter 7 you learned that functions can return functions — a factory. Let's build one for sounds.

## createSound

Add this to `audio.js`:

```js
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
```

`createSound` takes a configuration object and returns a **play function**. The play function closes over the config — every time you call it, it creates fresh audio nodes with those parameters.

## Rewrite the sounds

Now you can define sounds as data:

```js
export const playLaser = createSound({
  type: 'square',
  startFreq: 880,
  endFreq: 110,
  duration: 0.15,
  volume: 0.15
});

export const playPowerUp = createSound({
  type: 'sine',
  startFreq: 300,
  endFreq: 900,
  duration: 0.2,
  volume: 0.2
});

export const playHit = createSound({
  type: 'sawtooth',
  startFreq: 80,
  endFreq: 40,
  duration: 0.2,
  volume: 0.25
});
```

Three sound definitions, each one line of intent. The structure is handled by the factory. The imports in `main.js` and `Ship.js` don't change at all — `playLaser()` still works exactly the same.

## Sounds that don't fit the factory

`playExplosion` uses noise (a buffer, not an oscillator) and `playBossWarning` plays three tones in sequence. These don't fit the factory's pattern — and that's fine. The factory handles the common case. The special cases stay as standalone functions.

This is the right instinct: abstract the pattern, not the exceptions. A factory that tries to handle noise and sequences would be more complex than the original functions it replaced.

## Per-weapon sounds

Now that sounds are cheap to create, give each weapon its own:

```js
export const playDualBlaster = createSound({
  type: 'square',
  startFreq: 1000,
  endFreq: 200,
  duration: 0.1,
  volume: 0.12
});

export const playSpray = createSound({
  type: 'sawtooth',
  startFreq: 600,
  endFreq: 300,
  duration: 0.08,
  volume: 0.1
});

export const playDetonatorFire = createSound({
  type: 'sine',
  startFreq: 200,
  endFreq: 400,
  duration: 0.3,
  volume: 0.15
});
```

In `Ship.js`, import them and branch in `fire()`:

```js
import { playLaser, playDualBlaster, playSpray, playDetonatorFire } from './audio.js';
```

```js
  fire(projectiles) {
    if (this.weapon === 'dualBlaster') {
      playDualBlaster();
      // ...
    } else if (this.weapon === 'wideSpray') {
      playSpray();
      // ...
    } else if (this.weapon === 'detonator') {
      playDetonatorFire();
      // ...
    } else {
      playLaser();
      // ...
    }
  }
```

Each weapon now sounds distinct. The factory made it trivial to create new sounds — just a few numbers in an object.

## Try it

- Create a `playEnemyShoot` sound for the `ShooterEnemy` — something quieter and lower-pitched than the player's laser so you can tell the difference.
- Experiment with `type: 'triangle'` — it's the smoothest, most muted waveform.
