# The Web Audio API

The game is silent. Every laser, explosion, and power-up happens without a sound. Let's fix that — and we're going to do it without any audio files.

The browser has a built-in system called the **Web Audio API** that lets you generate sounds from code. Instead of loading a `.wav` or `.mp3`, you create **oscillators** — simple tone generators that produce sound waves — and shape them with volume and pitch controls.

## The audio context

Everything in Web Audio starts with an `AudioContext`. It's the master control for all sound.

Create a new file `src/audio.js`:

```js
const audioCtx = new AudioContext();

export { audioCtx };
```

That's it for now. The `AudioContext` is created once and shared by every sound in the game. We'll export individual sound functions from this file as we build them.

## Your first sound

Add this to `audio.js`:

```js
export function playTestTone() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.frequency.value = 440;
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.5);
}
```

In `main.js`, import and test it:

```js
import { playTestTone } from './audio.js';
```

In the `keydown` listener, add a temporary trigger:

```js
  if (event.key === 't') { playTestTone(); }
```

Save and press `t`. You should hear a short tone — a clean 440Hz A note that fades out over half a second.

## How it works

Audio in Web Audio flows through a **graph** of nodes, from source to destination:

```
Oscillator → Gain → Speakers
```

- **Oscillator** generates the raw tone. `frequency.value = 440` sets the pitch to 440Hz (the note A above middle C).
- **Gain** controls the volume. `setValueAtTime` sets it to 0.3 (30% volume), then `exponentialRampToValueAtTime` fades it to near-silence over 0.5 seconds. This fade is called an **envelope** — it shapes how the sound starts and ends.
- **`audioCtx.destination`** is the speakers.

`osc.start()` begins generating sound. `osc.stop()` schedules when it ends. Both use `audioCtx.currentTime` as the reference clock.

## Why generate sounds?

You could load audio files instead — `new Audio('laser.wav')`. But generating sounds has advantages for this tutorial:

- No files to find, download, or manage
- Every parameter is visible in code — change a number, hear the difference
- Sound *is* math: frequency is pitch, amplitude is volume, time is duration
- Each sound you build is a function — which connects directly to what you learned in Chapter 7

Remove the `t` key trigger when you're done testing. In the next step, we'll build real game sounds.
