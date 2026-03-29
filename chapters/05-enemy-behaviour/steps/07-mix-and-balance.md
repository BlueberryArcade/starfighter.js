# Mix and Balance

You now have six enemy types on the field: regular, fast, tank, wave, tracker, and shooter. Before we move on, take a step back and play the game with all of them active.

## Set up the spawn mix

Update `spawnEnemies()` so every type has a chance to appear:

```js
    const roll = Math.random();
    if (roll < 0.10) {
      enemies.push(new FastEnemy(x, -20));
    } else if (roll < 0.18) {
      enemies.push(new TankEnemy(x, -20));
    } else if (roll < 0.32) {
      enemies.push(new WaveEnemy(x, -20));
    } else if (roll < 0.44) {
      enemies.push(new TrackerEnemy(x, -20));
    } else if (roll < 0.54) {
      enemies.push(new ShooterEnemy(x, -20));
    } else {
      enemies.push(new Enemy(x, -20));
    }
```

These probabilities are a starting point — adjust them based on how the game feels.

## What to watch for

Play through for a few minutes and notice what happens:

- **A tracker pushes you sideways — into the path of a wave enemy.** That's emergent complexity. You didn't code that interaction; it comes from two simple behaviours overlapping.
- **Shooter bullets force you to move, which makes it harder to aim at tanks.** Another emergent interaction.
- **Fast enemies punish hesitation.** If you're focused on dodging bullets, a fast one slips past.

None of this required a single new line of code. The variety comes from six types following six different rules in the same space. This is one of the most valuable things about polymorphism — simple individual behaviours combine into complex group behaviour.

## Adjust the feel

Some things to try:

- **Too chaotic?** Reduce shooter and tracker probabilities. Regular enemies are filler — they create volume without creating pressure.
- **Too easy?** Increase the spawn rate (`frameCount % 60` instead of `% 90`) or add more trackers.
- **One type dominates?** If wave enemies feel trivial, increase their speed or amplitude. If trackers are too aggressive, reduce `trackSpeed`.

There's no correct answer — just a feel you're aiming for. Tweak, play, tweak again.

## What's next

The game has variety now, but it spawns enemies randomly forever. In the next chapter, we'll give the game structure: formations that enter together, scripted movement paths, a boss fight, and a wave system that makes the game feel designed rather than random.
