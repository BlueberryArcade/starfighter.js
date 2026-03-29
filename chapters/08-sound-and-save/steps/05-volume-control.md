# Volume Control

The game is noisy now — a rapid stream of lasers and explosions. Let's add a master volume control and a mute toggle.

## Master gain node

In `audio.js`, create a single gain node that sits between all sounds and the speakers:

```js
const audioCtx = new AudioContext();
const masterGain = audioCtx.createGain();
masterGain.connect(audioCtx.destination);

export { audioCtx, masterGain };
```

Now update `createSound` to connect through `masterGain` instead of directly to `audioCtx.destination`:

```js
export function createSound({ type, startFreq, endFreq, duration, volume }) {
  return () => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(masterGain);

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

Do the same for `playExplosion` and `playBossWarning` — change `audioCtx.destination` to `masterGain`.

## Volume and mute functions

```js
export function setVolume(level) {
  masterGain.gain.value = level;
}

export function toggleMute() {
  if (masterGain.gain.value > 0) {
    masterGain.gain._savedValue = masterGain.gain.value;
    masterGain.gain.value = 0;
  } else {
    masterGain.gain.value = masterGain.gain._savedValue || 0.5;
  }
}
```

`masterGain.gain.value` controls the volume for every sound at once. Setting it to `0` is mute. Setting it to `1` is full volume. `_savedValue` is a quick trick to remember the previous volume when unmuting.

## Keyboard controls

In `main.js`:

```js
import { toggleMute } from './audio.js';
```

In the `keydown` listener:

```js
  if (event.key === 'm') { toggleMute(); }
```

Save and play. Press `m` to mute, press again to unmute. Every sound in the game responds instantly because they all flow through the same `masterGain` node.

## Try it

- Add volume up/down with `+` and `-` keys: `setVolume(Math.min(1, masterGain.gain.value + 0.1))`.
- Log the current volume to the watch panel: `console.log('volume', masterGain.gain.value.toFixed(1))`.
