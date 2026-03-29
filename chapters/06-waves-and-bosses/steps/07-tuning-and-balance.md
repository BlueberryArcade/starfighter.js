# Tuning and Balance

The systems are built. This step is about playing and adjusting until the game feels right.

## What to look for

Play through all the waves several times:

- **Is wave 1 too easy?** The player should get comfortable, but not bored.
- **Is the jump between waves too steep?** Each should feel slightly harder — not the same, and not overwhelming.
- **Are shooter enemies too punishing?** If bullets are the main killer, slow their fire rate or speed.
- **Does the boss feel like a real fight?** Long enough to be an event, short enough not to be tedious.
- **Does the rotation look right?** Patrol enemies should visibly point along their path. The boss turret should track the player smoothly.

## Knobs you can turn

**Enemy stats** (each class constructor):
- `speed`, `hp`, `radius`, `points`

**Spawn timing** (`spawnEnemies()`):
- `frameCount % 60` — how often enemies appear within a wave
- `betweenWaveTimer = 180` — pause between waves

**Boss** (`Boss.js`):
- `hp: 30`, `fireTimer` intervals, `patrolSpeed`

**Waves** (the `waves` array):
- Enemy types, counts, which waves have bosses

**Player** (`Ship.js` and `main.js`):
- `speed`, `lives`, power-up duration

## The playtesting loop

Change one thing, play, observe, repeat. Don't change five things at once — you won't know which had the effect.

## What you built in these two chapters

Take a step back and look at everything since Chapter 4:

- **Inheritance** — `BaseEnemy` holds shared logic, `extends` lets subclasses override what's different.
- **`super`** — calling the parent's version of a method from a child.
- **Global state** — the ship reference in `game.js`, accessible from any file via import.
- **Sine wave movement** — `Math.sin` for smooth oscillation.
- **Player tracking** — enemies that react to the ship's position in real time.
- **Enemy projectiles** — objects that create objects, separated from player shots.
- **Formations** — spawning coordinated groups with offset positions.
- **Waypoints and vector normalization** — scripted movement along a path at constant speed.
- **State machines** — the boss's enter/patrol/enraged phases driven by `this.phase`.
- **Rotation and `atan2`** — objects that face their direction of travel or aim at a target.
- **Wave system** — structured progression with escalating difficulty.

Each of these is a pattern you'll see again — in other games, in other kinds of software, in other languages. The syntax changes, but the ideas don't.
