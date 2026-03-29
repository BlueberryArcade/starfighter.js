# Formations

The game has six enemy types with distinct behaviours. But they spawn one at a time, randomly, forever. The game doesn't feel *designed* — it feels like a slot machine. In this chapter we'll give it structure: formations, scripted paths, a boss fight, and a wave system.

## A formation spawner

A formation is a group of enemies created at the same time with coordinated starting positions. After spawn, they're independent objects — no group state, no leader.

In `main.js`, add these functions:

```js
function spawnFormation(EnemyClass, count, startX, startY, spacingX, spacingY) {
  for (let i = 0; i < count; i++) {
    const x = startX + i * spacingX;
    const y = startY + i * spacingY;
    enemies.push(new EnemyClass(x, y));
  }
}
```

This creates `count` enemies of a given class, each offset from the previous one. Different spacing makes different shapes.

## V-formation

```js
function spawnVFormation(EnemyClass, armLength) {
  const centreX = canvas.width / 2;
  const startY = -20;

  // Centre enemy
  enemies.push(new EnemyClass(centreX, startY));

  // Left and right arms
  for (let i = 1; i <= armLength; i++) {
    enemies.push(new EnemyClass(centreX - i * 40, startY - i * 30));
    enemies.push(new EnemyClass(centreX + i * 40, startY - i * 30));
  }
}
```

Each enemy in the arm starts higher up (more negative `y`) so they enter the screen one by one, leader first.

## Horizontal line

```js
function spawnLine(EnemyClass, count) {
  const spacing = (canvas.width - 60) / (count - 1);
  for (let i = 0; i < count; i++) {
    enemies.push(new EnemyClass(30 + i * spacing, -20 - Math.random() * 10));
  }
}
```

A line spanning the full width. The slight random `y` offset prevents them from looking too rigid.

## Trigger formations

Update `spawnEnemies()` to occasionally spawn a formation instead of a single enemy. Add this check before the regular single-enemy spawn:

```js
  if (frameCount % 600 === 0) {
    const roll = Math.random();
    if (roll < 0.5) {
      spawnVFormation(Enemy, 3);
    } else {
      spawnLine(FastEnemy, 6);
    }
    return;
  }
```

Every 10 seconds, a formation appears instead of a single enemy. The `return` skips the regular spawn for that frame.

## Try it

- Spawn a V of `WaveEnemy` — they'll oscillate in sync.
- Try a diagonal: `spawnFormation(Enemy, 5, 100, -20, 60, -25)`.
- Mix types by calling `spawnFormation` multiple times with different classes and offsets.
