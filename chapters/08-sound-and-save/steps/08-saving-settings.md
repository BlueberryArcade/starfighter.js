# Saving Settings

The mute toggle from step 5 resets every time the page reloads. Let's persist it — along with the volume level — so the player's preferences stick.

## Save volume state

In `audio.js`, update `setVolume` and `toggleMute` to save to `localStorage`:

```js
export function setVolume(level) {
  masterGain.gain.value = level;
  localStorage.setItem('starfighter-volume', String(level));
}

export function toggleMute() {
  if (masterGain.gain.value > 0) {
    localStorage.setItem('starfighter-muted', 'true');
    localStorage.setItem('starfighter-volume-before-mute', String(masterGain.gain.value));
    masterGain.gain.value = 0;
  } else {
    localStorage.removeItem('starfighter-muted');
    const saved = localStorage.getItem('starfighter-volume-before-mute');
    masterGain.gain.value = saved ? Number(saved) : 0.5;
  }
}
```

## Restore on load

Add an initialization function:

```js
export function initAudio() {
  const muted = localStorage.getItem('starfighter-muted');
  if (muted === 'true') {
    masterGain.gain.value = 0;
  } else {
    const saved = localStorage.getItem('starfighter-volume');
    if (saved !== null) {
      masterGain.gain.value = Number(saved);
    }
  }
}
```

In `main.js`, import and call it before the game loop starts:

```js
import { initAudio, toggleMute } from './audio.js';

initAudio();
```

Now mute the game, reload the page — it stays muted. Unmute and reload — it stays unmuted at the same volume.

## The pattern

This is the same pattern as the scoreboard, just simpler:

1. When something changes, save it to `localStorage`.
2. When the page loads, read from `localStorage` and restore the state.
3. Use sensible defaults when no saved value exists.

Any setting works this way: volume, difficulty preference, the player's chosen ship colour, whether debug mode is on. The data flows in one direction: game state → `localStorage` on change, `localStorage` → game state on load.

## A settings object

If you start accumulating settings, you can bundle them into a single JSON object instead of separate keys:

```js
function saveSettings(settings) {
  localStorage.setItem('starfighter-settings', JSON.stringify(settings));
}

function loadSettings() {
  const saved = localStorage.getItem('starfighter-settings');
  if (saved === null) {
    return { volume: 0.5, muted: false };
  }
  return JSON.parse(saved);
}
```

This keeps `localStorage` clean — one key for all settings instead of one per setting. As the game grows, this approach scales better.

## Try it

- Add the debug toggle (`d` key from Chapter 4) to the saved settings so it persists across reloads.
- Save the player's last weapon so they start with it after reloading.
- Add a "Reset Settings" option that calls `localStorage.clear()` — note that this removes *everything*, including high scores. A more careful approach removes only the settings key.
