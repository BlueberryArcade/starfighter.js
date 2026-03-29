# Tuning and Balance

The systems are built. This step is about playing the game and adjusting it until it feels right. There's no single correct answer here — game balance is a design problem, not a coding one.

## What to look for

Play through all the waves several times and pay attention to these questions:

- **Is wave 1 too easy?** The player should get comfortable, but not bored. If it takes too long to clear, reduce the count.
- **Is the jump between waves too steep?** Each wave should feel slightly harder than the last — not the same, and not overwhelming.
- **Are shooter enemies too punishing?** Watch how often you die to enemy bullets versus just being overwhelmed by volume. If bullets are the main killer, slow their fire rate or speed.
- **Does the boss feel like a real fight?** It should take long enough to feel like an event, but not so long that it's tedious. Adjust the boss HP.
- **Is there enough variety?** If every wave feels the same despite different enemy types, the types might be too similar in speed or behaviour.

## Knobs you can turn

**Enemy stats** (in each class constructor):
- `speed` — how fast enemies fall
- `hp` — how many hits to destroy
- `radius` — collision size
- `points` — score reward

**Spawn timing** (in `spawnEnemies()`):
- `frameCount % 60` — how often enemies spawn within a wave (lower = faster)
- `betweenWaveTimer = 180` — pause between waves in frames

**Boss tuning** (in `Boss.js`):
- `hp: 30` — total health
- `this.fireTimer = 60` — time between bursts in patrol phase
- `this.fireTimer = 30` — time between bursts when enraged
- `this.patrolSpeed` — horizontal movement speed

**Wave definitions** (the `waves` array):
- Enemy types and counts per wave
- Which waves include a boss

**Player stats** (in `Ship.js` and `main.js`):
- `this.speed` — ship movement speed
- `lives = 9` — starting lives
- Power-up duration (`weaponTimer = 600`)

## The playtesting loop

Game design works the same way as debugging: change one thing, play, observe, repeat. Don't change five things at once — you won't know which change had the effect.

1. Play a full run and note where it feels too easy or too hard.
2. Adjust one parameter.
3. Play again and see if it improved.
4. Repeat.

## What you built in this chapter

- **Inheritance** — `BaseEnemy` holds shared logic, subclasses override what's different.
- **`super`** — calling the parent's methods from a child.
- **Global state** — storing the ship reference in `game.js` for any file to access.
- **Sine wave movement** — `Math.sin` for smooth oscillation.
- **Player tracking** — enemies that react to the ship's position.
- **Enemy projectiles** — objects that create objects, separated from player projectiles.
- **Formations** — spawning coordinated groups.
- **Waypoints** — scripted movement along a path, with vector normalization.
- **State machines** — the boss's enter/patrol/enraged phases.
- **Wave system** — structured progression replacing constant drip spawning.

Each of these is a pattern you'll see again — in other games, in other kinds of software, in other programming languages. The syntax changes, but the ideas don't.

In the next chapter, we'll step outside the game loop and explore how the web platform itself works — events, the DOM, and how JavaScript interacts with the browser.
