# More Sounds

Two sounds make a difference. Five sounds make the game feel designed. Let's add sounds for power-ups, getting hit, and the boss.

## Power-up collect

A quick ascending tone — the opposite of the laser's descending sweep:

```js
export function playPowerUp() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.15);

  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.2);
}
```

Ascending pitch = positive feedback. The player hears "I got something good" without reading anything.

## Player hit

A low, ugly buzz. The opposite feeling of the power-up:

```js
export function playHit() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(80, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.2);

  gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.2);
}
```

Low frequency + sawtooth = harsh and alarming. The player hears "something bad happened."

## Boss warning

A deep pulsing tone that plays when the boss appears:

```js
export function playBossWarning() {
  for (let i = 0; i < 3; i++) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const startTime = audioCtx.currentTime + i * 0.25;
    osc.type = 'square';
    osc.frequency.value = 120;

    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

    osc.start(startTime);
    osc.stop(startTime + 0.15);
  }
}
```

Three low tones, spaced 0.25 seconds apart. The `startTime` offset schedules each tone in the future — Web Audio handles the timing precisely.

## Wire them in

Import in `main.js`:

```js
import { playLaser, playExplosion, playPowerUp, playHit, playBossWarning } from './audio.js';
```

**Power-up:** In the `collectPowerUp` function:

```js
function collectPowerUp(type) {
  playPowerUp();
  ship.weapon = type;
  ship.weaponTimer = 600;
}
```

**Player hit:** In `checkEnemyBullets()`, when a bullet hits:

```js
      if (distance < 18) {
        playHit();
        // ... rest of hit logic
      }
```

**Boss warning:** In `spawnEnemies()`, when the boss spawns:

```js
  if (score >= 50 && !bossSpawned) {
    enemies.push(new Boss());
    bossSpawned = true;
    playBossWarning();
    // ...
  }
```

## Sound design = parameter design

Notice the pattern across all five sounds:

| Sound | Pitch | Direction | Waveform | Duration | Feeling |
|-------|-------|-----------|----------|----------|---------|
| Laser | High | Descending | Square | 0.15s | Snappy, aggressive |
| Explosion | Noise | Decaying | Random | 0.3s | Chaotic, final |
| Power-up | Mid | Ascending | Sine | 0.2s | Positive, rewarding |
| Hit | Low | Descending | Sawtooth | 0.2s | Harsh, alarming |
| Boss | Low | Flat | Square | 3×0.15s | Ominous, rhythmic |

Every emotional response comes from four numbers: pitch, direction, waveform type, and duration. Sound design is parameter tuning — the same skill you've been practicing with enemy stats and spawn rates.

## Try it

- Make the laser sound different per weapon: higher pitch for dual blaster, noise burst for spray, deep thud for detonator.
- Add a game-over sound: a long descending tone that sweeps from 400Hz to 60Hz over a full second.
